const { config, cmsHelper } = require('@taboo/cms-core');
const striptags = require('striptags');
const sgMail = require('@sendgrid/mail');

class SendGridService {
  constructor() {
    sgMail.setApiKey(config.mailer.sendGrid.apiKey);
  }

  async send(params, ctx = null, tplName = null, tplValues = {}) {
    const from = params.from || config.mailer.from;
    const msg = {
      from: from,
      to: params.to,
      subject: params.subject,
    };

    if (ctx && tplName) {
      params.html = await cmsHelper.composeEmailTemplate(ctx, tplName, tplValues);
      if (!params.text) {
        params.text = striptags(params.html);
      }
    }

    if (params.text) {
      msg.text = params.text;
    }

    if (params.html) {
      msg.html = params.html;
    }

    if (!msg.text && msg.html) {
      msg.text = striptags(msg.html);
    }

    if (!msg.html && msg.text) {
      msg.html = msg.text;
    }

    return new Promise((resolve, reject) => {
      sgMail
        .send(msg)
        .then(data => {
          resolve({
            success: true,
            accepted: [msg.to],
            complete: data[0].complete,
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

module.exports = new SendGridService();
