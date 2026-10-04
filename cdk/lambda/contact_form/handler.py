"""Contact form handler for a site's /api/contact path.

CloudFront forwards the form's POST here. The handler checks that the
request came from the site, verifies the Cloudflare Turnstile token,
validates the fields and emails the inquiry to the site owner through
SES, with the visitor as Reply-To so a plain reply reaches them.

Configuration comes from the environment (set in cdk/site-stack.ts):
RECIPIENT, SENDER, SITE_HOSTNAMES (comma separated) and
TURNSTILE_SECRET_PARAMETER (an SSM SecureString parameter name).

The distribution maps origin 403 and 404 to the site's 404 page for every
path, so the handler never answers with those; refusals are 400.
"""

import base64
import json
import os
import re
import urllib.parse
import urllib.request

TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
INQUIRY_TYPES = ('Consulting', 'Speaking', 'Other')
EMAIL_PATTERN = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
MAX_LENGTHS = {'name': 100, 'email': 254, 'organization': 150, 'inquiry_type': 20, 'message': 5000}

_turnstile_secret = None


def handler(event, context):
    if event.get('requestContext', {}).get('http', {}).get('method') != 'POST':
        return response(405, 'Method not allowed.')

    hostnames = site_hostnames()
    headers = {key.lower(): value for key, value in (event.get('headers') or {}).items()}
    if headers.get('origin') not in {f'https://{hostname}' for hostname in hostnames}:
        return response(400, 'Invalid request.')

    try:
        form = parse_body(event)
    except ValueError:
        return response(400, 'Invalid request.')

    # The honeypot field is hidden from people; only bots fill it in.
    # Answer as if it worked so they learn nothing.
    if form.get('website'):
        return response(200, 'Thank you.')

    error = validate(form)
    if error:
        return response(400, error)

    if not verify_turnstile(form.get('token', ''), hostnames):
        return response(400, 'The verification check failed. Please try again.')

    try:
        send_inquiry(form)
    except Exception as exc:  # noqa: BLE001 - any SES failure gets the same answer
        print(f'contact form: send failed: {type(exc).__name__}')
        return response(502, 'Sorry, your message could not be sent. Please try again later.')

    print('contact form: inquiry sent')
    return response(200, 'Thank you.')


def site_hostnames():
    return [hostname.strip() for hostname in os.environ['SITE_HOSTNAMES'].split(',') if hostname.strip()]


def parse_body(event):
    body = event.get('body') or ''
    if event.get('isBase64Encoded'):
        body = base64.b64decode(body).decode('utf-8')
    data = json.loads(body)
    if not isinstance(data, dict):
        raise ValueError('body is not an object')
    return {key: value.strip() for key, value in data.items() if isinstance(value, str)}


def validate(form):
    for field in ('name', 'email', 'inquiry_type', 'message'):
        if not form.get(field):
            return 'Please fill in all required fields.'
    for field, limit in MAX_LENGTHS.items():
        if len(form.get(field, '')) > limit:
            return f'The {field.replace("_", " ")} field is too long.'
    if not EMAIL_PATTERN.match(form['email']):
        return 'Please enter a valid email address.'
    if form['inquiry_type'] not in INQUIRY_TYPES:
        return 'Please choose an inquiry type.'
    return None


def verify_turnstile(token, hostnames):
    if not token:
        return False
    payload = urllib.parse.urlencode({'secret': turnstile_secret(), 'response': token}).encode()
    request = urllib.request.Request(TURNSTILE_VERIFY_URL, data=payload, method='POST')
    try:
        with urllib.request.urlopen(request, timeout=5) as reply:
            result = json.load(reply)
    except (OSError, ValueError) as exc:
        print(f'contact form: turnstile check failed: {type(exc).__name__}')
        return False
    return bool(result.get('success')) and result.get('hostname') in hostnames


def turnstile_secret():
    global _turnstile_secret
    if _turnstile_secret is None:
        import boto3

        parameter = boto3.client('ssm').get_parameter(Name=os.environ['TURNSTILE_SECRET_PARAMETER'], WithDecryption=True)
        _turnstile_secret = parameter['Parameter']['Value']
    return _turnstile_secret


def one_line(value):
    return ' '.join(value.split())


def send_inquiry(form):
    import boto3

    organization = form.get('organization', '')
    subject = f'Website inquiry ({form["inquiry_type"]}): {one_line(form["name"])}'
    if organization:
        subject += f', {one_line(organization)}'
    body = '\n'.join(
        [
            f'Name: {one_line(form["name"])}',
            f'Email: {form["email"]}',
            f'Organization: {one_line(organization) or "(not given)"}',
            f'Inquiry: {form["inquiry_type"]}',
            '',
            'Message:',
            form['message'],
            '',
            '--',
            'Sent from the contact form on your website. Reply to this email to answer the sender directly.',
        ]
    )
    boto3.client('sesv2').send_email(
        FromEmailAddress=f'Website contact form <{os.environ["SENDER"]}>',
        Destination={'ToAddresses': [os.environ['RECIPIENT']]},
        ReplyToAddresses=[form['email']],
        Content={
            'Simple': {
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body': {'Text': {'Data': body, 'Charset': 'UTF-8'}},
            }
        },
    )


def response(status, message):
    return {
        'statusCode': status,
        'headers': {'Content-Type': 'application/json', 'Cache-Control': 'no-store'},
        'body': json.dumps({'ok': status == 200, 'message': message}),
    }
