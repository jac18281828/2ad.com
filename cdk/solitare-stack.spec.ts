import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';

import { SolitareStack } from './solitare-stack';

describe('SolitareStack', () => {
  const app = new cdk.App();
  const stack = new SolitareStack(app, 'TestSolitareStack', {
    env: {
      account: '504242000181',
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);

  it('creates CloudFront, certificate, DNS aliases, and bucket policy', () => {
    template.resourceCountIs('AWS::CloudFront::Distribution', 1);
    template.resourceCountIs('AWS::CertificateManager::Certificate', 1);
    template.resourceCountIs('AWS::S3::BucketPolicy', 1);
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'solitare.2ad.com.',
      Type: 'A',
    });
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'solitare.2ad.com.',
      Type: 'AAAA',
    });
  });

  it('configures SPA behavior and strict S3 origin policy for OAC', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Aliases: Match.arrayWith(['solitare.2ad.com']),
        DefaultRootObject: 'index.html',
        CustomErrorResponses: Match.arrayWith([
          Match.objectLike({
            ErrorCode: 403,
            ResponseCode: 200,
            ResponsePagePath: '/index.html',
          }),
          Match.objectLike({
            ErrorCode: 404,
            ResponseCode: 200,
            ResponsePagePath: '/index.html',
          }),
        ]),
      },
    });

    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: 'solitare-us-east-2-504242000181',
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Sid: 'AllowCloudFrontServicePrincipalReadOnly',
            Effect: 'Allow',
            Action: 's3:GetObject',
          }),
          Match.objectLike({
            Sid: 'DenyDirectS3ReadForObjects',
            Effect: 'Deny',
            Action: 's3:GetObject',
          }),
        ]),
      },
    });
  });
});
