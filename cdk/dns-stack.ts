import * as r53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';

export class DnsStack extends cdk.Stack {
  public readonly zone: r53.IHostedZone;

  constructor(scope: cdk.Construct, id: string, domain: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zone = r53.HostedZone.fromLookup(this, 'ZoneRec', {
      domainName: domain,
    });

    new r53.CnameRecord(this, 'wwwCname', {
      zone: zone,
      recordName: 'www',
      domainName: domain,
    });

    this.zone = zone;
  }
}
