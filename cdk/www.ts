#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { WwwStack } from './www-stack';
import { Ns2adStack } from './ns-2ad-stack';

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

// update dns for load balancer
const zone = r53.HostedZone.fromLookup(lbStack, 'Zone2ad', {
  domainName: '2ad.com',
});

const lb = lbStack.loadBalancer;
const loadBalancerTarget = new r53t.LoadBalancerTarget(lb);

new r53.ARecord(lbStack, 'WwwDefaultRecord', {
  zone: zone,
  recordName: '2ad.com',
  target: r53.RecordTarget.fromAlias(loadBalancerTarget),
});

app.synth();
