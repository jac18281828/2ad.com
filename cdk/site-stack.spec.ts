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

describe.each(SITE_DEFINITIONS)('SiteStack error pages for $domainName', (site) => {
  it('maps origin 403 and 404 to /404.html with status 404', () => {
    const stack = new SiteStack(new cdk.App(), 'ErrorPageStack', {
      env: {
        account: '504242000181',
        region: 'us-east-1',
      },
      site: site,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        CustomErrorResponses: Match.arrayEquals([
          { ErrorCode: 403, ResponseCode: 404, ResponsePagePath: '/404.html', ErrorCachingMinTTL: 60 },
          { ErrorCode: 404, ResponseCode: 404, ResponsePagePath: '/404.html', ErrorCachingMinTTL: 60 },
        ]),
      },
    });
  });
});

describe('SiteStack contact form', () => {
  const site = SITE_DEFINITIONS.find((entry) => entry.domainName === 'kellycairns.com');

  if (!site?.contactForm) {
    throw new Error('kellycairns.com contact form definition is required for tests');
  }

  const stack = new SiteStack(new cdk.App(), 'ContactFormStack', {
    env: {
      account: '504242000181',
      region: 'us-east-1',
    },
    site: site,
  });

  const template = Template.fromStack(stack);

  it('creates a Python handler with a public function URL', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'handler.handler',
      Runtime: 'python3.12',
      ReservedConcurrentExecutions: 2,
      Environment: {
        Variables: {
          RECIPIENT: 'kelly@kellycairns.com',
          SENDER: 'contact-form@kellycairns.com',
          SITE_HOSTNAMES: 'kellycairns.com,www.kellycairns.com',
          TURNSTILE_SECRET_PARAMETER: '/kellycairns/contact-form/turnstile-secret',
          ORIGIN_SECRET: Match.anyValue(),
        },
      },
    });
    template.resourceCountIs('AWS::Lambda::Url', 1);
    template.hasResourceProperties('AWS::Lambda::Url', { AuthType: 'NONE' });
  });

  it('routes /api/contact to the handler without caching', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        CacheBehaviors: Match.arrayWith([
          Match.objectLike({
            PathPattern: '/api/contact',
            ViewerProtocolPolicy: 'https-only',
            AllowedMethods: Match.arrayWith(['POST']),
            CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
          }),
        ]),
      },
    });
  });

  it('shares a generated origin secret between CloudFront and the handler', () => {
    template.resourceCountIs('AWS::SecretsManager::Secret', 1);
    template.hasResourceProperties('AWS::SecretsManager::Secret', {
      GenerateSecretString: { PasswordLength: 32, ExcludePunctuation: true },
    });

    const secretId = Object.keys(template.findResources('AWS::SecretsManager::Secret'))[0];
    const distribution = Object.values(template.findResources('AWS::CloudFront::Distribution'))[0];
    const functions = Object.values(template.findResources('AWS::Lambda::Function'));
    const contactFunction = functions.find((fn) => fn.Properties.Handler === 'handler.handler');
    const origins = JSON.stringify(distribution.Properties.DistributionConfig.Origins);

    expect(origins).toContain('"HeaderName":"x-origin-secret"');
    expect(origins).toContain(secretId);
    expect(JSON.stringify(contactFunction?.Properties.Environment.Variables.ORIGIN_SECRET)).toContain(secretId);
  });

  it('verifies the domain in SES and limits sending to it', () => {
    template.resourceCountIs('AWS::SES::EmailIdentity', 1);
    template.hasResourceProperties('AWS::SES::EmailIdentity', { EmailIdentity: 'kellycairns.com' });

    const policies = Object.values(template.findResources('AWS::IAM::Policy'));
    const statements = policies.flatMap((policy) => policy.Properties.PolicyDocument.Statement);
    const send = statements.find((statement) => statement.Action === 'ses:SendEmail');
    const resources = JSON.stringify(send?.Resource);

    expect(resources).toContain('identity/kellycairns.com');
    expect(resources).toContain('identity/kelly@kellycairns.com');
    expect(resources).not.toContain('*');
  });
});

const sitesWithoutContactForm = SITE_DEFINITIONS.filter((site) => !site.contactForm);

describe.each(sitesWithoutContactForm)('SiteStack without a contact form for $domainName', (site) => {
  it('creates no handler, SES identity or extra behaviors', () => {
    const stack = new SiteStack(new cdk.App(), 'NoContactFormStack', {
      env: {
        account: '504242000181',
        region: 'us-east-1',
      },
      site: site,
    });

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::Lambda::Url', 0);
    template.resourceCountIs('AWS::SES::EmailIdentity', 0);
    template.resourceCountIs('AWS::SecretsManager::Secret', 0);
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        CacheBehaviors: Match.absent(),
      },
    });
  });
});
