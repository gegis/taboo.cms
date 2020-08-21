const { cmsHelper } = require('@taboo/cms-core');
const EmailModel = require('modules/emails/models/EmailModel');

const variableOpenTag = '{{';
const variableCloseTag = '}}';
const sRegExOpen = new RegExp(variableOpenTag, 'g');
const sRegExClose = new RegExp(variableCloseTag, 'g');

class EmailsService {
  async getEmail(action, language) {
    return EmailModel.findOne({ action, language });
  }

  async composeEmailBody(ctx, tpl, tplValues) {
    if (tpl) {
      tpl = tpl.replace(sRegExOpen, '<%- ');
      tpl = tpl.replace(sRegExClose, ' %>');
      return cmsHelper.composeTemplate(ctx, tpl, tplValues);
    }
    return null;
  }
}

module.exports = new EmailsService();
