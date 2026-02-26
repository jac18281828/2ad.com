#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { EmomTimerStack } from './emomtimer-stack';
import { SiteDefinition, SITE_DEFINITIONS } from './site-config';
import { SiteStack } from './site-stack';

import { ACCOUNT, REGION } from './config';

const app = new cdk.App();

const createSiteStack = (site: SiteDefinition): void => {
  new SiteStack(app, site.stackName, {
    env: { account: ACCOUNT, region: REGION },
    site: site,
  });
};

SITE_DEFINITIONS.forEach(createSiteStack);

new EmomTimerStack(app, 'StackEmomTimer2adCom', {
  env: { account: ACCOUNT, region: 'us-east-1' },
});

app.synth();
