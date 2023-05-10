import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as ecsp from '@aws-cdk/aws-ecs-patterns';
import * as cert from '@aws-cdk/aws-certificatemanager';

import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import { SubnetType } from '@aws-cdk/aws-ec2';
import { CfnOutput } from '@aws-cdk/core';

export class WwwStack extends cdk.Stack {
  readonly loadBalancer: ApplicationLoadBalancer;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const imageRepository = new cdk.CfnParameter(this, 'repository', {
      type: 'String',
      description: 'The location of the repository path for the image',
    });

    const imageVersion = new cdk.CfnParameter(this, 'version', {
      type: 'String',
      description: 'The version for the repository to deploy',
    });

    const vpc = new ec2.Vpc(this, 'www-vpc', {
      natGateways: 0,
      maxAzs: 2,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          name: 'public-subnet',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    const cluster = new ecs.Cluster(this, 'www-cluster', {
      clusterName: 'www-2ad-cluster',
      containerInsights: true,
      vpc: vpc,
    });

    const certArn = 'arn:aws:acm:us-east-2:504242000181:certificate/fd9145a8-38a6-431a-ab21-b0b77a3e2c17';
    const certificate = cert.Certificate.fromCertificateArn(this, 'SiteCertificate', certArn);
    const registryPath = imageRepository.valueAsString + ':' + imageVersion.valueAsString;
    const image = ecs.ContainerImage.fromRegistry(registryPath);

    const LOG_RETENTION = 1;

    const fargate = new ecsp.ApplicationLoadBalancedFargateService(this, 'Www2adFargateService', {
      cluster: cluster,
      circuitBreaker: {
        rollback: true,
      },
      taskImageOptions: {
        containerPort: 80,
        image: image,
        environment: {
          ECS_DISABLE_METRICS: 'true'
        },
        logDriver: ecs.LogDrivers.awsLogs({
          streamPrefix: id,
          logRetention: LOG_RETENTION,
        }),
      },
      assignPublicIp: true,
      publicLoadBalancer: true,
      desiredCount: 1,
      cpu: 256,
      memoryLimitMiB: 512,
      redirectHTTP: true,
      certificate: certificate,
    });

    this.loadBalancer = fargate.loadBalancer;

    new CfnOutput(this, 'LoadBalancerDNS', {
      value: fargate.loadBalancer.loadBalancerDnsName,
    });
  }
}
