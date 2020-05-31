const { config } = require('@taboo/cms-core');
const FormModel = require('modules/forms/models/FormModel');
const FormEntryModel = require('modules/forms/models/FormEntryModel');
const AbstractController = require('modules/core/controllers/AbstractController');
const MailerService = require('modules/mailer/services/MailerService');
const { api: { forms: { defaultSort = { createdAt: 'desc' } } = {} } = {} } = config;

class FormsController extends AbstractController {
  constructor() {
    super({
      model: FormModel,
      defaultSort: defaultSort,
      defaultFilter: { enabled: true },
      searchFields: ['title'],
      filterRequestParams: {
        getOne: ['_id'],
      },
    });
  }

  async submit(ctx) {
    const {
      request: { body } = {},
      params: { formId } = {},
      query: { from = null, template = null, html = null, theme = 'standard' } = {},
    } = ctx;
    let success = false;
    let emailResponse;
    let emailParams = { ctx };
    let email = {};
    let form;
    if (formId) {
      form = await FormModel.findOne({ enabled: true, _id: formId });
      if (form) {
        await FormEntryModel.create({ form: formId, data: body });
        success = true;
        if (form.recipients) {
          if (from) {
            email.from = from;
          }
          email.to = form.recipients;
          email.subject = form.title;
          if (html) {
            email.html = html;
          }
          if (template) {
            emailParams.tplPath = template;
            emailParams.tplValues = body;
            emailParams.theme = theme;
          }
          emailResponse = await MailerService.send(email, emailParams);
          success = !!(emailResponse.success || emailResponse.accepted);
        }
      }
    }
    ctx.body = { success: success };
  }
}

module.exports = new FormsController();
