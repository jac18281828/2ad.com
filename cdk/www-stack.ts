import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';

export class WwwStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, network: network, props?: cdk.StackProps) {
    const vpc = new ec2.Vpc(this, "2ad-Vpc", {
      maxAzs: 3 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "2ad-Cluster", {
      vpc: vpc
    });

    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "2ad-Service", {
      cluster: cluster, // Required
      cpu: 256, 
      desiredCount: 2, 
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry("ghcr.io/jac18281828/2ad.com:latest") },
      memoryLimitMiB: 1024, 
      publicLoadBalancer: true 
    });
  }
}
