import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';

import { EmomTimerStack } from './emomtimer-stack';

describe('EmomTimerStack', () => {
  const app = new cdk.App();
  const stack = new EmomTimerStack(app, 'TestEmomTimerStack', {
    env: {
      account: '504242000181',
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);

  it('creates CloudFront, certificate, and DNS alias records', () => {
    template.resourceCountIs('AWS::CloudFront::Distribution', 1);
    template.resourceCountIs('AWS::CertificateManager::Certificate', 1);
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'emomtimer.2ad.com.',
      Type: 'A',
    });
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'emomtimer.2ad.com.',
      Type: 'AAAA',
    });
  });

  it('configures distribution behavior for SPA fallback and compression', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Aliases: Match.arrayWith(['emomtimer.2ad.com']),
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
  });

  it('does not manage bucket policy directly in this stack', () => {
    template.resourceCountIs('AWS::S3::BucketPolicy', 0);
    template.resourceCountIs('Custom::AWS', 0);
  });
});
