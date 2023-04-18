#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as r53 from '@aws-cdk/aws-route53';

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

const emmyDns = new DnsStack(app, 'StackNsEc', 'emmycairns.com', {
  env: { account: ACCOUNT, region: REGION },
});

new r53.CnameRecord(emmyDns, 'emmyAwsVerfCname', {
  zone: emmyDns.zone,
  recordName: '_143a5e6a2257b9b778df7931d6d4297a.emmycairns.com',
  domainName: '_9f6db1eae1bc81dccd8d74724f9f8780.fgsdscwdjl.acm-validations.aws',
});

const minaDns = new DnsStack(app, 'StackNsMc', 'minacairns.com', {
  env: { account: ACCOUNT, region: REGION },
});

new r53.CnameRecord(minaDns, 'minaAwsVerfCname', {
  zone: minaDns.zone,
  recordName: '_093abbd018e548bda3f3c07429b77225.minacairns.com',
  domainName: '_1542ea4cf9fdbbf2a425358f4db92606.fgsdscwdjl.acm-validations.aws',
});

const archieDns = new DnsStack(app, 'StackNsAc', 'archiecairns.com', {
  env: { account: ACCOUNT, region: REGION },
});

new r53.CnameRecord(archieDns, 'archieAwsVerfCname', {
  zone: archieDns.zone,
  recordName: '_501692bba148720fea0783e27fe29282.archiecairns.com',
  domainName: '_6f0078d3750a26a9f734fcaed2517a7c.fgsdscwdjl.acm-validations.aws',
});

// fix dns for all hosted zones address record
const lb = wwwLbStack.loadBalancer;

new NsLbStack(app, 'StackNsLb', lb, {
  env: { account: ACCOUNT, region: REGION },
});

app.synth();
