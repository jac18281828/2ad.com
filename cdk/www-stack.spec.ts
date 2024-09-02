import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { WwwStack } from './www-stack';

describe('WwwStack', () => {
  let app: cdk.App;
  let stack: WwwStack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new WwwStack(app, 'TestStack');
    template = Template.fromStack(stack);
  });

  it('synthesizes the App Fargate', () => {
    template.resourceCountIs('AWS::EC2::VPC', 1);
    template.resourceCountIs('AWS::ECS::Service', 1);
    template.resourceCountIs('AWS::ECS::TaskDefinition', 1);
  });

  it('creates an Application Load Balancer', () => {
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'application',
    });
  });

  it('creates a Fargate service with the correct properties', () => {
    template.hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
      DesiredCount: 1,
    });
  });

  it('creates a VPC with the correct configuration', () => {
    template.hasResourceProperties('AWS::EC2::VPC', {
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
    });
    template.resourceCountIs('AWS::EC2::Subnet', 2);
  });

  it('references the correct certificate in the load balancer', () => {
    template.hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Certificates: [
        {
          CertificateArn: 'arn:aws:acm:us-east-2:504242000181:certificate/fd9145a8-38a6-431a-ab21-b0b77a3e2c17',
        },
      ],
    });
  });

  it('configures auto-scaling for the Fargate service', () => {
    template.hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
      MinCapacity: 1,
      MaxCapacity: 8,
    });

    template.hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      TargetTrackingScalingPolicyConfiguration: {
        TargetValue: 80,
        ScaleInCooldown: 60,
        ScaleOutCooldown: 60,
      },
    });
  });
});
