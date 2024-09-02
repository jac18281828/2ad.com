import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_route53 as r53 } from 'aws-cdk-lib';

export class DnsStack extends cdk.Stack {
  public readonly zone: r53.IHostedZone;

  constructor(scope: Construct, id: string, domain: string, props?: cdk.StackProps) {
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
