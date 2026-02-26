import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { aws_route53 as r53 } from 'aws-cdk-lib';
import * as r53t from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

const ROOT_DOMAIN = '2ad.com';
const SUBDOMAIN = 'solitare.2ad.com';
const ROOT_ZONE_ID = 'Z09862671HYH6ZFKNPGNL';
const ORIGIN_BUCKET_NAME = 'solitare-us-east-2-504242000181';
const ORIGIN_BUCKET_REGION = 'us-east-2';

export class SolitareStack extends cdk.Stack {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stackRegion = cdk.Stack.of(this).region;
    if (!cdk.Token.isUnresolved(stackRegion) && stackRegion !== 'us-east-1') {
      throw new Error('SolitareStack must be deployed in us-east-1 for CloudFront ACM certificates.');
    }

    const zone = r53.HostedZone.fromHostedZoneAttributes(this, 'RootZone', {
      hostedZoneId: ROOT_ZONE_ID,
      zoneName: ROOT_DOMAIN,
    });

    const certificate = new acm.Certificate(this, 'SolitareCertificate', {
      domainName: SUBDOMAIN,
      validation: acm.CertificateValidation.fromDns(zone),
    });

    const originBucket = s3.Bucket.fromBucketAttributes(this, 'SolitareOriginBucket', {
      bucketName: ORIGIN_BUCKET_NAME,
      region: ORIGIN_BUCKET_REGION,
    });

    this.distribution = new cloudfront.Distribution(this, 'SolitareDistribution', {
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

    const distributionArn = `arn:${cdk.Aws.PARTITION}:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${this.distribution.distributionId}`;

    new s3.CfnBucketPolicy(this, 'SolitareOriginBucketPolicy', {
      bucket: ORIGIN_BUCKET_NAME,
      policyDocument: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            sid: 'AllowCloudFrontServicePrincipalReadOnly',
            effect: iam.Effect.ALLOW,
            principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
            actions: ['s3:GetObject'],
            resources: [`${originBucket.bucketArn}/*`],
            conditions: {
              StringEquals: {
                'AWS:SourceArn': distributionArn,
                'AWS:SourceAccount': cdk.Aws.ACCOUNT_ID,
              },
            },
          }),
          new iam.PolicyStatement({
            sid: 'DenyDirectS3ReadForObjects',
            effect: iam.Effect.DENY,
            principals: [new iam.AnyPrincipal()],
            actions: ['s3:GetObject'],
            resources: [`${originBucket.bucketArn}/*`],
            conditions: {
              StringNotEquals: {
                'AWS:SourceArn': distributionArn,
              },
            },
          }),
        ],
      }),
    });

    const cloudFrontTarget = r53.RecordTarget.fromAlias(new r53t.CloudFrontTarget(this.distribution));

    new r53.ARecord(this, 'SolitareARecord', {
      zone: zone,
      recordName: 'solitare',
      target: cloudFrontTarget,
    });

    new r53.AaaaRecord(this, 'SolitareAaaaRecord', {
      zone: zone,
      recordName: 'solitare',
      target: cloudFrontTarget,
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'Set this as CLOUDFRONT_DISTRIBUTION_ID in solitaire repository secrets.',
    });

    new cdk.CfnOutput(this, 'DistributionArn', {
      value: distributionArn,
      description: 'CloudFront distribution ARN used by solitare S3 bucket policy.',
    });
  }
}
