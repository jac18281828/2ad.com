import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';

import { SiteStack } from './site-stack';
import { SITE_DEFINITIONS } from './site-config';

describe('SiteStack', () => {
  const app = new cdk.App();
  const site = SITE_DEFINITIONS.find((entry) => entry.domainName === '2ad.com');

  if (!site) {
    throw new Error('2ad.com site definition is required for tests');
  }

  const stack = new SiteStack(app, 'TestSiteStack', {
    env: {
      account: '504242000181',
      region: 'us-east-1',
    },
    site: site,
  });

  const template = Template.fromStack(stack);

  it('creates core static hosting resources', () => {
    template.resourceCountIs('AWS::S3::Bucket', 1);
    template.resourceCountIs('AWS::CloudFront::Distribution', 1);
    template.resourceCountIs('AWS::CertificateManager::Certificate', 1);
  });

  it('configures CloudFront aliases and ACM DNS validation', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        Aliases: Match.arrayWith(['2ad.com', 'www.2ad.com']),
      },
    });

    template.hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: '2ad.com',
      SubjectAlternativeNames: Match.arrayWith(['www.2ad.com']),
      ValidationMethod: 'DNS',
    });
  });

  it('creates apex A/AAAA alias records and a www cname alias', () => {
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: '2ad.com.',
      Type: 'A',
    });

    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: '2ad.com.',
      Type: 'AAAA',
    });

    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Name: 'www.2ad.com.',
      Type: 'CNAME',
    });
  });
});
