import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { aws_route53 as r53 } from 'aws-cdk-lib';
import * as r53t from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

const ROOT_DOMAIN = '2ad.com';
const SUBDOMAIN = 'emomtimer.2ad.com';
const ROOT_ZONE_ID = 'Z09862671HYH6ZFKNPGNL';
const ORIGIN_BUCKET_NAME = 'emom-timer-us-east-2-504242000181';
const ORIGIN_BUCKET_REGION = 'us-east-2';

export class EmomTimerStack extends cdk.Stack {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stackRegion = cdk.Stack.of(this).region;
    if (!cdk.Token.isUnresolved(stackRegion) && stackRegion !== 'us-east-1') {
      throw new Error('EmomTimerStack must be deployed in us-east-1 for CloudFront ACM certificates.');
    }

    const zone = r53.HostedZone.fromHostedZoneAttributes(this, 'RootZone', {
      hostedZoneId: ROOT_ZONE_ID,
      zoneName: ROOT_DOMAIN,
    });

    const certificate = new acm.Certificate(this, 'EmomTimerCertificate', {
      domainName: SUBDOMAIN,
      validation: acm.CertificateValidation.fromDns(zone),
    });

    const originBucket = s3.Bucket.fromBucketAttributes(this, 'EmomTimerOriginBucket', {
      bucketName: ORIGIN_BUCKET_NAME,
      region: ORIGIN_BUCKET_REGION,
    });

    this.distribution = new cloudfront.Distribution(this, 'EmomTimerDistribution', {
      defaultRootObject: 'index.html',
      certificate: certificate,
      domainNames: [SUBDOMAIN],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enableIpv6: true,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(originBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    const cloudFrontTarget = r53.RecordTarget.fromAlias(new r53t.CloudFrontTarget(this.distribution));

    new r53.ARecord(this, 'EmomTimerARecord', {
      zone: zone,
      recordName: 'emomtimer',
      target: cloudFrontTarget,
    });

    new r53.AaaaRecord(this, 'EmomTimerAaaaRecord', {
      zone: zone,
      recordName: 'emomtimer',
      target: cloudFrontTarget,
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'Set this as CLOUDFRONT_DISTRIBUTION_ID in emomtimer repository secrets.',
    });

    new cdk.CfnOutput(this, 'DistributionArn', {
      value: `arn:${cdk.Aws.PARTITION}:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${this.distribution.distributionId}`,
      description: 'Use this in emomtimer bucket policy (managed in emomtimer repo) to allow OAC read access.',
    });
  }
}
