#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { WwwStack } from './www-stack';
import { Ns2adStack } from './ns-2ad-stack';
import { NsKellyCairnsStack } from './ns-kellycairns-stack';
import { DnsStack } from './dns-stack';

import * as r53 from '@aws-cdk/aws-route53';
import * as r53t from '@aws-cdk/aws-route53-targets';

const ACCOUNT = '504242000181';
const REGION = 'us-east-2';

const app = new cdk.App();
const lbStack = new WwwStack(app, 'Stack2ad', {
  env: { account: ACCOUNT, region: REGION },
});

new Ns2adStack(app, 'StackNs2ad', {
  env: { account: ACCOUNT, region: REGION },
});

new NsKellyCairnsStack(app, 'StackNsKc', {
  env: { account: ACCOUNT, region: REGION },
});

new DnsStack(app, 'StackNsEc', 'emmycairns.com', {
  env: { account: ACCOUNT, region: REGION },
});

new DnsStack(app, 'StackNsMc', 'minacairns.com', {
  env: { account: ACCOUNT, region: REGION },
});

new DnsStack(app, 'StackNsAc', 'archiecairns.com', {
  env: { account: ACCOUNT, region: REGION },
});

// fix dns for all hosted zones address record
const lb = lbStack.loadBalancer;
const loadBalancerTarget = new r53t.LoadBalancerTarget(lb);

const zone2ad = r53.HostedZone.fromLookup(lbStack, 'Zone2ad', {
  domainName: '2ad.com',
});

new r53.ARecord(lbStack, 'Www2adDefaultRecord', {
  zone: zone2ad,
  recordName: '2ad.com',
  target: r53.RecordTarget.fromAlias(loadBalancerTarget),
});

const zoneKc = r53.HostedZone.fromLookup(lbStack, 'ZoneKc', {
  domainName: 'kellycairns.com',
});

new r53.ARecord(lbStack, 'WwwKcDefaultRecord', {
  zone: zoneKc,
  recordName: 'kellycairns.com',
  target: r53.RecordTarget.fromAlias(loadBalancerTarget),
});

const zoneAc = r53.HostedZone.fromLookup(lbStack, 'ZoneAc', {
  domainName: 'archiecairns.com',
});

new r53.ARecord(lbStack, 'WwwAcDefaultRecord', {
  zone: zoneAc,
  recordName: 'archiecairns.com',
  target: r53.RecordTarget.fromAlias(loadBalancerTarget),
});

const zoneMc = r53.HostedZone.fromLookup(lbStack, 'ZoneMc', {
  domainName: 'minacairns.com',
});

new r53.ARecord(lbStack, 'WwwMcDefaultRecord', {
  zone: zoneMc,
  recordName: 'minacairns.com',
  target: r53.RecordTarget.fromAlias(loadBalancerTarget),
});

const zoneEc = r53.HostedZone.fromLookup(lbStack, 'ZoneEc', {
  domainName: 'emmycairns.com',
});

new r53.ARecord(lbStack, 'WwwEcDefaultRecord', {
  zone: zoneEc,
  recordName: 'emmycairns.com',
  target: r53.RecordTarget.fromAlias(loadBalancerTarget),
});

app.synth();
