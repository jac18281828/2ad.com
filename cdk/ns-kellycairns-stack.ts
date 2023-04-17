import * as r53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';

export class NsKellyCairnsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zone = r53.HostedZone.fromLookup(this, 'ZoneKc', {
      domainName: 'kellycairns.com',
    });

    new r53.CnameRecord(this, 'wwwCname', {
      zone: zone,
      recordName: 'www',
      domainName: 'kellycairns.com',
    });

    new r53.CnameRecord(this, 'awsVerfCname', {
      zone: zone,
      recordName: '_7dc4ec0aef35cc1aef85031ce076a9e1',
      domainName: '_3ca3e8d155328d0a8c56400857c2bacf.yygwskclfy.acm-validations.aws',
    });

    new r53.TxtRecord(this, 'DomainKellyCairnsText', {
      zone: zone,
      recordName: 'kellycairns.com',
      values: [
        'v=spf1 include:icloud.com ~all',
        'apple-domain=aqmIRYgnCsmV97Dt',
        'google-site-verification=7xP5FaDJJ6Fjk4_nmmdHWxj9eANEpKxyP2Ca4bCOjNw v=spf1 +a +mx +ip4:69.89.31.242 ?all',
      ],
    });

    // mail setup

    new r53.CnameRecord(this, 'AppleDomainKeyCname', {
      zone: zone,
      recordName: 'sig1._domainkey',
      domainName: 'sig1.dkim.kellycairns.com.at.icloudmailadmin.com.',
    });

    new r53.TxtRecord(this, 'dmarcText', {
      zone: zone,
      recordName: '_dmarc',
      values: ['v=DMARC1; p=reject; rua=mailto:info@kellycairns.com; ruf=mailto:info@kellycairns.com; fo=1;'],
    });

    new r53.MxRecord(this, 'MxKellyCairns', {
      zone: zone,
      recordName: 'kellycairns.com',
      values: [
        {
          priority: 10,
          hostName: 'mx01.mail.icloud.com',
        },
        {
          priority: 10,
          hostName: 'mx02.mail.icloud.com',
        },
      ],
    });
  }
}
