import * as fs from 'fs';
import * as path from 'path';

// Runs the kellycairns.com Contact page's inline form script against small fakes for the few
// browser pieces it touches, to check what a visitor sees for each kind of answer from /api/contact.

const page = fs.readFileSync(path.join(__dirname, '..', 'kellycairns', 'content', 'pages', 'contact.md'), 'utf8');
const scriptPattern = /<script>([\s\S]*?)<\/script>/g;
let formScript = '';
for (let match = scriptPattern.exec(page); match; match = scriptPattern.exec(page)) {
  if (match[1].includes('/api/contact')) {
    formScript = match[1];
  }
}

const FAILURE = 'Sorry, your message could not be sent. Please try again, or reach her on LinkedIn.';
const THANKS = 'Thank you. Your message has been sent, and Dr. Cairns will reply by email.';

type Listener = (event: { preventDefault: () => void }) => void;

class FakeElement {
  textContent = '';
  className = '';
  disabled = false;
  replacement: FakeElement | null = null;
  readonly classes = new Set<string>();
  readonly classList = {
    toggle: (name: string, on: boolean): void => {
      if (on) {
        this.classes.add(name);
      } else {
        this.classes.delete(name);
      }
    },
  };

  replaceWith(element: FakeElement): void {
    this.replacement = element;
  }
}

class FakeForm extends FakeElement {
  readonly button = new FakeElement();
  submit: Listener | null = null;

  querySelector(): FakeElement {
    return this.button;
  }

  addEventListener(type: string, listener: Listener): void {
    this.submit = listener;
  }

  reportValidity(): boolean {
    return true;
  }
}

interface Reply {
  readonly status: number;
  readonly body: string;
}

interface Outcome {
  readonly form: FakeForm;
  readonly status: FakeElement;
  readonly resets: number;
}

const submitWith = async (reply: Reply | Error): Promise<Outcome> => {
  const form = new FakeForm();
  const status = new FakeElement();
  const elements: Record<string, FakeElement> = { 'kc-contact-form': form, 'kc-contact-status': status };
  let resets = 0;

  const fakeDocument = {
    getElementById: (id: string): FakeElement => elements[id],
    createElement: (): FakeElement => new FakeElement(),
  };
  const fakeWindow = {
    turnstile: {
      reset: (): void => {
        resets += 1;
      },
    },
  };
  const fakeFetch = async (): Promise<{ status: number; json: () => Promise<unknown> }> => {
    if (reply instanceof Error) {
      throw reply;
    }
    const { status: code, body } = reply;
    return { status: code, json: async () => JSON.parse(body) };
  };
  class FakeFormData {
    get(name: string): string {
      return name === 'cf-turnstile-response' ? 'token' : 'value';
    }
  }

  new Function('document', 'window', 'fetch', 'FormData', formScript)(fakeDocument, fakeWindow, fakeFetch, FakeFormData);
  form.submit?.({ preventDefault: () => undefined });
  await new Promise((resolve) => setTimeout(resolve, 0));
  return { form, status, resets };
};

const fallbackCases: [string, Reply][] = [
  ['a 429 from the Lambda concurrency cap', { status: 429, body: '{"Message":"Rate Exceeded."}' }],
  ['a 429 with a lowercase message', { status: 429, body: '{"message":"Too Many Requests"}' }],
  ['a 502 with an HTML body', { status: 502, body: '<html>Bad Gateway</html>' }],
  ['a 200 without the handler JSON', { status: 200, body: '{}' }],
];

describe('Contact page form script', () => {
  it('is on the page', () => {
    expect(formScript).toContain("fetch('/api/contact'");
  });

  it.each(fallbackCases)('shows the LinkedIn fallback for %s', async (label, reply) => {
    const outcome = await submitWith(reply);

    expect(outcome.status.textContent).toBe(FAILURE);
    expect(outcome.status.classes.has('kc-error')).toBe(true);
    expect(outcome.form.button.disabled).toBe(false);
    expect(outcome.form.replacement).toBeNull();
    expect(outcome.resets).toBe(1);
  });

  it('shows the LinkedIn fallback when the network fails', async () => {
    const outcome = await submitWith(new TypeError('Failed to fetch'));

    expect(outcome.status.textContent).toBe(FAILURE);
    expect(outcome.form.button.disabled).toBe(false);
  });

  it("shows the handler's own message when it refuses a submission", async () => {
    const outcome = await submitWith({ status: 400, body: '{"ok":false,"message":"Please enter a valid email address."}' });

    expect(outcome.status.textContent).toBe('Please enter a valid email address.');
    expect(outcome.form.button.disabled).toBe(false);
  });

  it('replaces the form with a thank-you note on success', async () => {
    const outcome = await submitWith({ status: 200, body: '{"ok":true,"message":"Thank you."}' });

    expect(outcome.form.replacement?.textContent).toBe(THANKS);
    expect(outcome.status.classes.has('kc-error')).toBe(false);
  });
});
