import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { CfnOutput } from '@aws-cdk/core';

export class WwwStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'Vpc2ad', {
      maxAzs: 3, // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, 'Cluster2ad', {
      vpc: vpc,
    });

    const wwwTaskDefintion = new ecs.TaskDefinition(this, 'Task2ad', {
      compatibility: ecs.Compatibility.FARGATE,
      cpu: '256',
      memoryMiB: '512',
    });

    const container = wwwTaskDefintion.addContainer('Container2ad', {
      image: ecs.ContainerImage.fromRegistry('ghcr.io/jac18281828/2ad.com:latest'),
    });

    container.addPortMappings({
      containerPort: 80,
      protocol: ecs.Protocol.TCP,
    });

    const service = new ecs.FargateService(this, 'Service2ad', {
      cluster: cluster,
      taskDefinition: wwwTaskDefintion,
      assignPublicIp: true,
      desiredCount: 2,
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'Alb2ad', {
      vpc: vpc,
      internetFacing: true,
    });

    const listener = lb.addListener('Listener', { port: 80 });
    service.registerLoadBalancerTargets({
      containerName: 'Container2ad',
      containerPort: 80,
      newTargetGroupId: 'ECS',
      listener: ecs.ListenerConfig.applicationListener(listener, {
        protocol: elbv2.ApplicationProtocol.HTTPS,
      }),
    });

    new CfnOutput(this, 'LoadBalancerDNS', {
      value: lb.loadBalancerDnsName,
    });
  }
}
