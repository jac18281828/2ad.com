import * as r53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';

export class Ns2adStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zone = r53.HostedZone.fromLookup(this, 'Zone2ad', {
      domainName: '2ad.com',
    });

    new r53.ARecord(this, 'MailAlias', {
      zone: zone,
      recordName: 'mail',
      target: r53.RecordTarget.fromIpAddresses('162.241.226.16'),
    });

    new r53.ARecord(this, 'WebMailAlias', {
      zone: zone,
      recordName: 'webmail',
      target: r53.RecordTarget.fromIpAddresses('162.241.226.16'),
    });

    new r53.CnameRecord(this, 'wwwCname', {
      zone: zone,
      recordName: 'www',
      domainName: '2ad.com',
    });

    new r53.CnameRecord(this, 'awsVerfCname', {
      zone: zone,
      recordName: '_1625a3cb561f546dbaa1424e88225aad',
      domainName: '_6f153893b703d8b5ee2a15a60b781bb9.yygwskclfy.acm-validations.aws',
    });

    new r53.CnameRecord(this, 'bingVerfCname', {
      zone: zone,
      recordName: '9d9f901ff72b4ed1ee6f00793de4b23c',
      domainName: 'verify.bing.com',
    });

    new r53.TxtRecord(this, 'Domain2adText', {
      zone: zone,
      recordName: '2ad.com',
      values: [
        'google-site-verification=ZPTI24LMLAsPrKOwLCv2ElL2O_lVyCZsmp2Z5MRc6vw v=spf1 +a +mx +ip4:69.89.31.242 ?all',
        'v=spf1 ip4:162.241.226.16 +a +mx include:bluehost.com redirect=icloud.com -all',
      ],
    });

    // mail setup
    // spf set above

    new r53.TxtRecord(this, 'dmarcText', {
      zone: zone,
      recordName: '_dmarc',
      values: ['v=DMARC1; p=reject; rua=mailto:info@2ad.com; ruf=mailto:info@2ad.com; fo=1;'],
    });

    new r53.TxtRecord(this, 'domainkeyText', {
      zone: zone,
      recordName: '_domainkey',
      values: [
        'k=rsa; p=MHwwDQYJKoZIhvcNAQEBBQADawAwaAJhAMVylte4J6HurmazZwQCKrLOjobvFNGuPh37a13xzPpECQ7ICcl8ok5KofSyTUejSiDbNevd9KE7AJEZjauQb9c7aKGH+LYWUcGctnULjpZCBHmqQx+0Ce7DbBgA7pxi9wIDAQAB',
      ],
    });

    new r53.TxtRecord(this, 'domainkey2adText', {
      zone: zone,
      recordName: 'default._domainkey',
      values: [
        'k=rsa; p=MHwwDQYJKoZIhvcNAQEBBQADawAwaAJhAMVylte4J6HurmazZwQCKrLOjobvFNGuPh37a13xzPpECQ7ICcl8ok5KofSyTUejSiDbNevd9KE7AJEZjauQb9c7aKGH+LYWUcGctnULjpZCBHmqQx+0Ce7DbBgA7pxi9wIDAQAB',
      ],
    });

    new r53.MxRecord(this, 'Mx2ad', {
      zone: zone,
      recordName: '@',
      values: [
        {
          priority: 10,
          hostName: 'mx.spamexperts.com',
        },
        {
          priority: 20,
          hostName: 'fallbackmx.spamexperts.eu',
        },
        {
          priority: 30,
          hostName: 'fallbackmx.spamexperts.eu',
        },
      ],
    });
  }
}
