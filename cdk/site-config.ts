import { ACCOUNT, REGION } from './config';

export interface CnameRecordConfig {
  readonly recordName: string;
  readonly domainName: string;
}

export interface TxtRecordConfig {
  readonly recordName: string;
  readonly values: string[];
}

export interface MxValueConfig {
  readonly priority: number;
  readonly hostName: string;
}

export interface MxRecordConfig {
  readonly recordName: string;
  readonly values: MxValueConfig[];
}

export interface ContactFormConfig {
  // Mailbox at the site's own domain that receives form submissions
  readonly recipientLocalPart: string;
  // SSM SecureString parameter holding the Cloudflare Turnstile secret key (created by hand, not by CDK)
  readonly turnstileSecretParameterName: string;
}

export interface SiteDefinition {
  readonly siteKey: string;
  readonly stackName: string;
  readonly domainName: string;
  readonly hostedZoneId: string;
  readonly outputDirectory: string;
  readonly extraCnameRecords?: CnameRecordConfig[];
  readonly extraTxtRecords?: TxtRecordConfig[];
  readonly extraMxRecords?: MxRecordConfig[];
  // Serves POST /api/contact from a Lambda that emails submissions through SES
  readonly contactForm?: ContactFormConfig;
}

const normalizeForBucket = (value: string): string => value.replace(/[^a-z0-9.-]/g, '-').toLowerCase();

export const bucketNameForDomain = (domainName: string): string => normalizeForBucket(`${domainName}-site-${ACCOUNT}-${REGION}`);

export const SITE_DEFINITIONS: SiteDefinition[] = [
  {
    siteKey: '2ad',
    stackName: 'Stack2adCom',
    domainName: '2ad.com',
    hostedZoneId: 'Z09862671HYH6ZFKNPGNL',
    outputDirectory: '2ad/output',
    extraCnameRecords: [
      {
        recordName: '9d9f901ff72b4ed1ee6f00793de4b23c',
        domainName: 'verify.bing.com',
      },
      {
        recordName: 'sig1._domainkey',
        domainName: 'sig1.dkim.2ad.com.at.icloudmailadmin.com',
      },
    ],
    extraTxtRecords: [
      {
        recordName: '2ad.com',
        values: [
          'google-site-verification=ZPTI24LMLAsPrKOwLCv2ElL2O_lVyCZsmp2Z5MRc6vw',
          'apple-domain=qvnVAu8kdNMIafNQ',
          'v=spf1 include:icloud.com ~all',
        ],
      },
      {
        recordName: '_dmarc',
        values: ['v=DMARC1; p=reject; rua=mailto:info@2ad.com; ruf=mailto:info@2ad.com; fo=1;'],
      },
    ],
    extraMxRecords: [
      {
        recordName: '2ad.com',
        values: [
          {
            priority: 10,
            hostName: 'mx01.mail.icloud.com',
          },
          {
            priority: 10,
            hostName: 'mx02.mail.icloud.com',
          },
        ],
      },
    ],
  },
  {
    siteKey: 'kellycairns',
    stackName: 'StackKellyCairnsCom',
    domainName: 'kellycairns.com',
    hostedZoneId: 'Z10085952J607YL0C085Z',
    outputDirectory: 'kellycairns/output',
    contactForm: {
      recipientLocalPart: 'kelly',
      turnstileSecretParameterName: '/kellycairns/contact-form/turnstile-secret',
    },
    extraCnameRecords: [
      {
        recordName: 'sig1._domainkey',
        domainName: 'sig1.dkim.kellycairns.com.at.icloudmailadmin.com.',
      },
    ],
    extraTxtRecords: [
      {
        recordName: 'kellycairns.com',
        values: [
          'v=spf1 include:icloud.com ~all',
          'apple-domain=aqmIRYgnCsmV97Dt',
          'google-site-verification=7xP5FaDJJ6Fjk4_nmmdHWxj9eANEpKxyP2Ca4bCOjNw',
        ],
      },
      {
        recordName: '_dmarc',
        values: ['v=DMARC1; p=reject; rua=mailto:info@kellycairns.com; ruf=mailto:info@kellycairns.com; fo=1;'],
      },
    ],
    extraMxRecords: [
      {
        recordName: 'kellycairns.com',
        values: [
          {
            priority: 10,
            hostName: 'mx01.mail.icloud.com',
          },
          {
            priority: 10,
            hostName: 'mx02.mail.icloud.com',
          },
        ],
      },
    ],
  },
  {
    siteKey: 'archiecairns',
    stackName: 'StackArchieCairnsCom',
    domainName: 'archiecairns.com',
    hostedZoneId: 'Z10102221CSLHU1KC90BY',
    outputDirectory: 'archiecairns/output',
  },
  {
    siteKey: 'emmycairns',
    stackName: 'StackEmmyCairnsCom',
    domainName: 'emmycairns.com',
    hostedZoneId: 'Z0892853S30T7EU6Q7TP',
    outputDirectory: 'emmycairns/output',
  },
  {
    siteKey: 'minacairns',
    stackName: 'StackMinaCairnsCom',
    domainName: 'minacairns.com',
    hostedZoneId: 'Z10102161OH0V46UUANCP',
    outputDirectory: 'minacairns/output',
  },
];
