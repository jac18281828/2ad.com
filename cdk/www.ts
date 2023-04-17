#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { WwwStack } from './www-stack';
import { Ns2adStack } from './ns-2ad-stack';

const ACCOUNT = '504242000181';
const REGION = 'us-east-2';

const app = new cdk.App();
new WwwStack(app, 'Stack2ad', {
  env: { account: ACCOUNT, region:  REGION},
});

new Ns2adStack(app, 'StackNs2ad', {
  env: { account: ACCOUNT, region: REGION },
})

app.synth();
