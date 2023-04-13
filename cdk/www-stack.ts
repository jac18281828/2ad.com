import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as ecsp from '@aws-cdk/aws-ecs-patterns';
import * as cert from '@aws-cdk/aws-certificatemanager';
import * as ga from '@aws-cdk/aws-globalaccelerator';
import * as ga_endpoints from '@aws-cdk/aws-globalaccelerator-endpoints';
import { CfnOutput } from '@aws-cdk/core';

export class WwwStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const accl = new ga.Accelerator(this, 'Www2adAccelerator', { acceleratorName: 'Www2adAccelerator' });

    const listener = accl.addListener('Listener', {
      portRanges: [{ fromPort: 80 }, { fromPort: 443 }],
    });

    const certArn = 'arn:aws:acm:us-east-2:504242000181:certificate/ebd3baac-67d8-4f32-a07d-20985efce38c';
    const certificate = cert.Certificate.fromCertificateArn(this, 'SiteCertificate', certArn);

    const fargate = new ecsp.ApplicationLoadBalancedFargateService(this, 'Www2adFargateService', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('ghcr.io/jac18281828/2ad.com:latest'),
      },
      publicLoadBalancer: true,
      desiredCount: 2,
      cpu: 256,
      memoryLimitMiB: 512,
      redirectHTTP: true,
      certificate: certificate,
    });

    const lb = fargate.loadBalancer;
    const endpoint = new ga_endpoints.ApplicationLoadBalancerEndpoint(lb, { weight: 128, preserveClientIp: true });

    listener.addEndpointGroup('Group1', {
      endpoints: [endpoint],
    });

    new CfnOutput(this, 'LoadBalancerDNS', {
      value: fargate.loadBalancer.loadBalancerDnsName,
    });
  }
}
