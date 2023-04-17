import * as r53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';

export class Ns2adStack extends cdk.Stack {

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        
        const zone = r53.HostedZone.fromLookup(this, 'Zone2ad', {
            domainName: '2ad.com'
        });

        new r53.ARecord(this, 'MailAlias', {
            zone: zone,
            recordName: 'mail',
            target: r53.RecordTarget.fromIpAddresses('162.241.226.16')
        });

        new r53.ARecord(this, 'WebmailAlias', {
            zone: zone,
            recordName: 'webmail',
            target: r53.RecordTarget.fromIpAddresses('162.241.226.16')
        });
    }
}