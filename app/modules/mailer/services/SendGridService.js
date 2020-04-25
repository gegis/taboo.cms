const { config, cmsHelper } = require('@taboo/cms-core');
const striptags = require('striptags');
const sgMail = require('@sendgrid/mail');

const { mailer: { sendGrid: { apiKey } = {} } = {} } = config;

class SendGridService {
  constructor() {
    sgMail.setApiKey(apiKey);
  }

  /**
   * email:
   *  from: '"Fred Foo 👻" <foo@example.com>',
   *  to: "bar@example.com, baz@example.com",
   *  subject: "Hello ✔",
   *  text: "Hello world?",
   *  html: "<i>Hello world?</i>"
   */
  async send(email, { ctx = null, tplPath = null, tplValues = {}, theme = null }) {
    if (!email.to) {
      throw new Error('Please specify options.to');
    }
    const from = email.from || config.mailer.from;
    const sgEmail = {
      from: from,
      to: email.to,
      subject: email.subject,
    };

    if (ctx && tplPath && !email.html) {
      email.html = await cmsHelper.composeEmailTemplate(ctx, { tplPath, tplValues, theme });
      if (!email.text) {
        email.text = striptags(email.html);
      }
    }

    this.setEmailBody(sgEmail, email);

    return new Promise((resolve, reject) => {
      sgMail
        .send(sgEmail)
        .then(data => {
          resolve({
            success: true,
            accepted: [sgEmail.to],
            complete: data[0].complete,
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  setEmailBody(email, data) {
    if (data.text) {
      email.text = data.text;
    }
    if (data.html) {
      email.html = data.html;
    }
    if (!email.text && email.html) {
      email.text = striptags(email.html);
    }
    if (!email.html && email.text) {
      email.html = email.text;
    }
  }
}

module.exports = new SendGridService();
