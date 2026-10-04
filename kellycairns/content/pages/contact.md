title: Contact
slug: contact
date: 2026-10-02
menu_order: 5

Dr. Kelly Cairns welcomes inquiries about consulting and speaking. Send a message below and she will reply by email.

**Please note:** Dr. Cairns does not give medical advice about individual pets. If your pet is ill, please contact your veterinarian or an emergency veterinary hospital.

To help her respond quickly, please include:

* For speaking: the event, date, audience, session length and whether it's in person or virtual
* For consulting: your goals and timeline

<form id="kc-contact-form" class="kc-contact-form">
<label for="kc-name">Name</label>
<input id="kc-name" name="name" type="text" autocomplete="name" maxlength="100" required>
<label for="kc-email">Email</label>
<input id="kc-email" name="email" type="email" autocomplete="email" maxlength="254" required>
<label for="kc-organization">Organization <span class="kc-optional">(optional)</span></label>
<input id="kc-organization" name="organization" type="text" autocomplete="organization" maxlength="150">
<label for="kc-inquiry-type">Inquiry</label>
<select id="kc-inquiry-type" name="inquiry_type" required>
<option value="">Choose one</option>
<option>Consulting</option>
<option>Speaking</option>
<option>Other</option>
</select>
<label for="kc-message">Message</label>
<textarea id="kc-message" name="message" rows="7" maxlength="5000" required></textarea>
<div class="kc-trap" aria-hidden="true"><label for="kc-website">Leave this field empty</label><input id="kc-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
<div class="cf-turnstile" data-sitekey="1x00000000000000000000AA"></div>
<button type="submit">Send message</button>
<p class="kc-privacy">Your details are used only to reply to your inquiry.</p>
<p id="kc-contact-status" class="kc-contact-status" role="status" aria-live="polite"></p>
<noscript><p>The form needs JavaScript. You can also reach her on LinkedIn, below.</p></noscript>
</form>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<script>
/* Sends the form to /api/contact (a small AWS handler behind the site's
   CloudFront), which checks the Turnstile token and emails the inquiry. */
(function () {
  var form = document.getElementById('kc-contact-form');
  var status = document.getElementById('kc-contact-status');
  var button = form.querySelector('button[type="submit"]');
  var failure = 'Sorry, your message could not be sent. Please try again, or reach her on LinkedIn.';
  function show(text, isError) {
    status.textContent = text;
    status.classList.toggle('kc-error', isError);
  }
  function fail(text) {
    show(text || failure, true);
    button.disabled = false;
    if (window.turnstile) { window.turnstile.reset(); }
  }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) { return; }
    var data = new FormData(form);
    var payload = {
      name: data.get('name'),
      email: data.get('email'),
      organization: data.get('organization'),
      inquiry_type: data.get('inquiry_type'),
      message: data.get('message'),
      website: data.get('website'),
      token: data.get('cf-turnstile-response') || ''
    };
    if (!payload.token) {
      show('Please complete the verification check above the button.', true);
      return;
    }
    button.disabled = true;
    show('Sending...', false);
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (reply) {
        return reply.json().then(
          function (result) { return { status: reply.status, result: result }; },
          function () { return { status: reply.status, result: null }; }
        );
      })
      .then(function (answer) {
        var result = answer.result;
        if (answer.status !== 200 || !result || result.ok !== true) {
          /* Only the handler's own refusals (400, with its JSON) carry a
             message worth showing. Anything else, such as a 429 when the
             Lambda is at its concurrency cap, gets the LinkedIn fallback. */
          var ownRefusal = answer.status === 400 && result && typeof result.message === 'string';
          fail(ownRefusal ? result.message : null);
          return;
        }
        var thanks = document.createElement('p');
        thanks.className = 'kc-contact-status';
        thanks.textContent = 'Thank you. Your message has been sent, and Dr. Cairns will reply by email.';
        form.replaceWith(thanks);
      })
      .catch(function () { fail(); });
  });
})();
</script>

You can also connect with her on [LinkedIn](https://linkedin.com/in/kelly-cairns-68425060).
