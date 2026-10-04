import * as path from 'path';

import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { aws_route53 as r53 } from 'aws-cdk-lib';
import * as r53t from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { bucketNameForDomain, ContactFormConfig, SiteDefinition } from './site-config';

export interface SiteStackProps extends cdk.StackProps {
  readonly site: SiteDefinition;
}

interface ContactFormOrigin {
  readonly url: lambda.FunctionUrl;
  // CloudFront sends this as x-origin-secret; the handler refuses requests without it
  readonly originSecret: string;
}

const sanitizeLogicalIdValue = (value: string): string => value.replace(/[^a-zA-Z0-9]/g, '');

export class SiteStack extends cdk.Stack {
  public readonly distribution: cloudfront.Distribution;
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);

    const { site } = props;

    const zone = r53.PublicHostedZone.fromPublicHostedZoneAttributes(this, 'Zone', {
      hostedZoneId: site.hostedZoneId,
      zoneName: site.domainName,
    });

    const certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName: site.domainName,
      subjectAlternativeNames: [`www.${site.domainName}`],
      validation: acm.CertificateValidation.fromDns(zone),
    });

    this.bucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: bucketNameForDomain(site.domainName),
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // The form posts to the site's own origin, so the page needs no API URL and no CORS.
    const additionalBehaviors: Record<string, cloudfront.BehaviorOptions> = {};
    if (site.contactForm) {
      const contactForm = this.createContactForm(zone, site.domainName, site.contactForm);
      additionalBehaviors['/api/contact'] = {
        // CloudFront sets this header on its own request to the origin, replacing any a viewer sends.
        origin: new origins.FunctionUrlOrigin(contactForm.url, {
          customHeaders: { 'x-origin-secret': contactForm.originSecret },
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      };
    }

    this.distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultRootObject: 'index.html',
      certificate: certificate,
      domainNames: [site.domainName, `www.${site.domainName}`],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enableIpv6: true,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
      },
      additionalBehaviors: additionalBehaviors,
      // The OAC origin answers a missing key with 403; 404 covers a list grant.
      errorResponses: [403, 404].map((httpStatus) => ({
        httpStatus,
        responseHttpStatus: 404,
        responsePagePath: '/404.html',
        ttl: cdk.Duration.seconds(60),
      })),
    });

    const cloudFrontTarget = r53.RecordTarget.fromAlias(new r53t.CloudFrontTarget(this.distribution));

    new r53.ARecord(this, 'ApexARecord', {
      zone: zone,
      recordName: site.domainName,
      target: cloudFrontTarget,
    });

    new r53.AaaaRecord(this, 'ApexAaaaRecord', {
      zone: zone,
      recordName: site.domainName,
      target: cloudFrontTarget,
    });

    new r53.CnameRecord(this, 'WwwAlias', {
      zone: zone,
      recordName: 'www',
      domainName: site.domainName,
      ttl: cdk.Duration.minutes(5),
    });

    this.createExtraDnsRecords(zone, site);

    new cdk.CfnOutput(this, 'SiteBucketName', {
      value: this.bucket.bucketName,
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distribution.distributionDomainName,
    });
  }

  private createContactForm(zone: r53.IPublicHostedZone, domainName: string, form: ContactFormConfig): ContactFormOrigin {
    // SES sends as the site's domain; Easy DKIM records go in the zone so the mail passes DMARC.
    new ses.EmailIdentity(this, 'ContactFormEmailIdentity', {
      identity: ses.Identity.publicHostedZone(zone),
    });

    const recipient = `${form.recipientLocalPart}@${domainName}`;
    const turnstileSecret = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'TurnstileSecret', {
      parameterName: form.turnstileSecretParameterName,
    });

    // Shared secret between CloudFront and the handler, so the public function URL is no use on its own.
    // Generated once; later deploys keep the same value.
    const originSecret = new secretsmanager.Secret(this, 'ContactFormOriginSecret', {
      generateSecretString: { passwordLength: 32, excludePunctuation: true },
    });
    const originSecretValue = originSecret.secretValue.unsafeUnwrap();

    const handler = new lambda.Function(this, 'ContactFormFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda', 'contact_form')),
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      // Bounds the worst-case bill; calls over the cap get a 429 and the page's LinkedIn fallback.
      reservedConcurrentExecutions: 2,
      environment: {
        RECIPIENT: recipient,
        SENDER: `contact-form@${domainName}`,
        SITE_HOSTNAMES: `${domainName},www.${domainName}`,
        TURNSTILE_SECRET_PARAMETER: form.turnstileSecretParameterName,
        ORIGIN_SECRET: originSecretValue,
      },
    });

    turnstileSecret.grantRead(handler);
    // SES authorizes sending against the domain identity and, while the account is in the
    // SES sandbox, against the recipient too.
    const identityArn = (id: string): string => this.formatArn({ service: 'ses', resource: 'identity', resourceName: id });
    handler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail'],
        resources: [identityArn(domainName), identityArn(recipient)],
      }),
    );

    // Public URL; CloudFront fronts it at /api/contact and the handler checks the origin secret, Origin and Turnstile.
    return { url: handler.addFunctionUrl({ authType: lambda.FunctionUrlAuthType.NONE }), originSecret: originSecretValue };
  }

  private createExtraDnsRecords(zone: r53.IHostedZone, site: SiteDefinition): void {
    site.extraCnameRecords?.forEach((record, index) => {
      new r53.CnameRecord(this, `ExtraCname${index}${sanitizeLogicalIdValue(record.recordName)}`, {
        zone: zone,
        recordName: record.recordName,
        domainName: record.domainName,
      });
    });

    site.extraTxtRecords?.forEach((record, index) => {
      new r53.TxtRecord(this, `ExtraTxt${index}${sanitizeLogicalIdValue(record.recordName)}`, {
        zone: zone,
        recordName: record.recordName,
        values: record.values,
      });
    });

    site.extraMxRecords?.forEach((record, index) => {
      new r53.MxRecord(this, `ExtraMx${index}${sanitizeLogicalIdValue(record.recordName)}`, {
        zone: zone,
        recordName: record.recordName,
        values: record.values,
      });
    });
  }
}
