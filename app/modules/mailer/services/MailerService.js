const { config } = require('@taboo/cms-core');
const NodeMailerService = require('./NodeMailerService');
const SendGridService = require('./SendGridService');

class MailerService {
  /**
   * email:
   *  from: '"Fred Foo 👻" <foo@example.com>',
   *  to: "bar@example.com, baz@example.com",
   *  subject: "Hello ✔",
   *  text: "Hello world?",
   *  html: "<i>Hello world?</i>"
   */
  async send(email, { ctx = null, tplPath = null, tplValues = {}, theme = null }) {
    const { mailer: { sendGrid: { apiKey: sendGridApiKey } = {} } = {} } = config;
    let emailResponse;
    if (sendGridApiKey) {
      emailResponse = await SendGridService.send(email, { ctx, tplPath, tplValues, theme });
    } else {
      emailResponse = await NodeMailerService.send(email, { ctx, tplPath, tplValues, theme });
    }
    return emailResponse;
  }
}

module.exports = new MailerService();
