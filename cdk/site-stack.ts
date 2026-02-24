import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { aws_route53 as r53 } from 'aws-cdk-lib';
import * as r53t from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { bucketNameForDomain, SiteDefinition } from './site-config';

export interface SiteStackProps extends cdk.StackProps {
  readonly site: SiteDefinition;
}

const sanitizeLogicalIdValue = (value: string): string => value.replace(/[^a-zA-Z0-9]/g, '');

export class SiteStack extends cdk.Stack {
  public readonly distribution: cloudfront.Distribution;
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);

    const { site } = props;

    const zone = r53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
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
