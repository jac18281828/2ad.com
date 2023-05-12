#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';

import { WwwStack } from './www-stack';
import { NsLbStack } from './ns-lb-stack';

import { ACCOUNT, REGION } from './config';
import { ns } from './ns';

const run = async () => {
  const app = new cdk.App();

  ns(app);

  const wwwLbStack = new WwwStack(app, 'Stack2ad', {
    env: { account: ACCOUNT, region: REGION },
  });

  // fix dns for all hosted zones address record
  const lb = wwwLbStack.loadBalancer;

  new NsLbStack(app, 'StackNsLb', lb, {
    env: { account: ACCOUNT, region: REGION },
  });

  app.synth();
};

run()
  .then(() => process.exit(0))
  .catch((error) => console.error(error));
