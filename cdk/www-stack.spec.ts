import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { WwwStack } from './www-stack';

describe('WwwStack', () => {
  it('synthesizes the App Fargate', () => {
    const app = new cdk.App();
    const stack = new WwwStack(app, 'TestStack');
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::EC2::VPC', 1);
    template.resourceCountIs('AWS::ECS::Service', 1);
  });
});
