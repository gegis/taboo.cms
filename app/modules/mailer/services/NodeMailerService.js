const { mailer, logger } = require('@taboo/cms-core');

class NodeMailerService {
  /**
   * email:
   *  from: '"Fred Foo 👻" <foo@example.com>',
   *  to: "bar@example.com, baz@example.com",
   *  subject: "Hello ✔",
   *  text: "Hello world?",
   *  html: "<i>Hello world?</i>"
   */
  async send(email = {}, { ctx = null, tplPath = null, tplValues = {}, theme = null }) {
    let response = null;
    try {
      response = await mailer.send(email, { ctx, tplPath, tplValues, theme });
    } catch (e) {
      logger.error(e);
    }
    return response;
  }
}

module.exports = new NodeMailerService();
