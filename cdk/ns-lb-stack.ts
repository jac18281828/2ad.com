import * as r53 from '@aws-cdk/aws-route53';
import * as r53t from '@aws-cdk/aws-route53-targets';
import * as cdk from '@aws-cdk/core';

import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';

export class NsLbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, lb: ApplicationLoadBalancer, props?: cdk.StackProps) {
    super(scope, id, props);

    const loadBalancerTarget = new r53t.LoadBalancerTarget(lb);

    const zone2ad = r53.HostedZone.fromLookup(this, 'Zone2ad', {
      domainName: '2ad.com',
    });

    new r53.ARecord(this, 'Www2adDefaultRecord', {
      zone: zone2ad,
      recordName: '2ad.com',
      target: r53.RecordTarget.fromAlias(loadBalancerTarget),
    });

    const zoneKc = r53.HostedZone.fromLookup(this, 'ZoneKc', {
      domainName: 'kellycairns.com',
    });

    new r53.ARecord(this, 'WwwKcDefaultRecord', {
      zone: zoneKc,
      recordName: 'kellycairns.com',
      target: r53.RecordTarget.fromAlias(loadBalancerTarget),
    });

    const zoneAc = r53.HostedZone.fromLookup(this, 'ZoneAc', {
      domainName: 'archiecairns.com',
    });

    new r53.ARecord(this, 'WwwAcDefaultRecord', {
      zone: zoneAc,
      recordName: 'archiecairns.com',
      target: r53.RecordTarget.fromAlias(loadBalancerTarget),
    });

    const zoneMc = r53.HostedZone.fromLookup(this, 'ZoneMc', {
      domainName: 'minacairns.com',
    });

    new r53.ARecord(this, 'WwwMcDefaultRecord', {
      zone: zoneMc,
      recordName: 'minacairns.com',
      target: r53.RecordTarget.fromAlias(loadBalancerTarget),
    });

    const zoneEc = r53.HostedZone.fromLookup(this, 'ZoneEc', {
      domainName: 'emmycairns.com',
    });

    new r53.ARecord(this, 'WwwEcDefaultRecord', {
      zone: zoneEc,
      recordName: 'emmycairns.com',
      target: r53.RecordTarget.fromAlias(loadBalancerTarget),
    });
  }
}
