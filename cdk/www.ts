#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { WwwStack } from './www-stack';
import { Ns2adStack } from './ns-2ad-stack';
import { NsKellyCairnsStack } from './ns-kellycairns-stack';
import { DnsStack } from './dns-stack';
import { NsLbStack } from './ns-lb-stack';

const ACCOUNT = '504242000181';
const REGION = 'us-east-2';

const app = new cdk.App();
const wwwLbStack = new WwwStack(app, 'Stack2ad', {
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
const lb = wwwLbStack.loadBalancer;

new NsLbStack(app, 'StackNsLb', lb, {
  env: { account: ACCOUNT, region: REGION },
});

app.synth();
