#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { WwwStack } from './www-stack';

const app = new cdk.App();
new WwwStack(app, '2adStack', {
  env: { account: '504242000181', region: 'us-east-2' },
});

app.synth();
