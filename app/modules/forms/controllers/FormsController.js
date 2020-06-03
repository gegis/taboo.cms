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
    this.submit = this.submit.bind(this);
    this.getFormRecipients = this.getFormRecipients.bind(this);
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
    let recipients;
    let form;
    if (formId) {
      form = await FormModel.findOne({ enabled: true, _id: formId });
      if (form) {
        await FormEntryModel.create({ form: formId, data: body });
        success = true;
        recipients = this.getFormRecipients(form, body);
        if (recipients) {
          if (from) {
            email.from = from;
          }
          email.to = recipients;
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

  getFormRecipients(form, formData = {}) {
    let recipients = form.recipients;
    let formField;
    let fieldValue;
    if (form && form.conditionalRecipients && form.conditionalRecipients.length > 0) {
      for (let i = 0; i < form.conditionalRecipients.length; i++) {
        formField = form.conditionalRecipients[i].formField;
        fieldValue = form.conditionalRecipients[i].fieldValue;
        if (formData[formField] && formData[formField] === fieldValue && form.conditionalRecipients[i].recipients) {
          recipients = form.conditionalRecipients[i].recipients;
          break;
        }
      }
    }
    return recipients;
  }
}

module.exports = new FormsController();
