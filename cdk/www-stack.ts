import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as ecsp from '@aws-cdk/aws-ecs-patterns';
import { CfnOutput } from '@aws-cdk/core';

export class WwwStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fargate = new ecsp.ApplicationLoadBalancedFargateService(this, 'WebServer2ad', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('ghcr.io/jac18281828/2ad.com:latest'),
      },
      publicLoadBalancer: true,
      desiredCount: 2,
      cpu: 256,
      memoryLimitMiB: 512,
    });

    new CfnOutput(this, 'LoadBalancerDNS', {
      value: fargate.loadBalancer.loadBalancerDnsName,
    });
  }
}
