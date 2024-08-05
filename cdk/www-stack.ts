import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as ecsp from '@aws-cdk/aws-ecs-patterns';
import * as cert from '@aws-cdk/aws-certificatemanager';
import { RetentionDays } from '@aws-cdk/aws-logs';

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
      containerInsights: false,
      enableFargateCapacityProviders: true,
      vpc: vpc,
    });

    const certArn = 'arn:aws:acm:us-east-2:504242000181:certificate/fd9145a8-38a6-431a-ab21-b0b77a3e2c17';
    const certificate = cert.Certificate.fromCertificateArn(this, 'SiteCertificate', certArn);
    const registryPath = imageRepository.valueAsString + ':' + imageVersion.valueAsString;
    const image = ecs.ContainerImage.fromRegistry(registryPath);

    const fargate = new ecsp.ApplicationLoadBalancedFargateService(this, 'Www2adFargateService', {
      cluster: cluster,
      assignPublicIp: true,
      taskSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      minHealthyPercent: 50,
      maxHealthyPercent: 200,
      circuitBreaker: {
        rollback: true,
      },
      taskImageOptions: {
        containerPort: 80,
        image: image,
        environment: {
          ECS_DISABLE_METRICS: 'true',
        },
        enableLogging: true,
        logDriver: ecs.LogDrivers.awsLogs({
          streamPrefix: id,
          logRetention: RetentionDays.ONE_WEEK,
        }),
      },
      publicLoadBalancer: true,
      desiredCount: 1,
      cpu: 256,
      memoryLimitMiB: 512,
      redirectHTTP: true,
      certificate: certificate,
      healthCheckGracePeriod: cdk.Duration.seconds(60),
    });

    const scaling = fargate.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 8,
    });

    scaling.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    scaling.scaleOnCpuUtilization('CPUScaling', {
      targetUtilizationPercent: 75,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    fargate.targetGroup.configureHealthCheck({
      path: '/',
      interval: cdk.Duration.seconds(30),
      unhealthyThresholdCount: 2,
    });

    this.loadBalancer = fargate.loadBalancer;

    this.loadBalancer.setAttribute('idle_timeout.timeout_seconds', '60');
    this.loadBalancer.setAttribute('routing.http.drop_invalid_header_fields.enabled', 'true');

    new CfnOutput(this, 'LoadBalancerDNS', {
      value: fargate.loadBalancer.loadBalancerDnsName,
    });
  }
}
