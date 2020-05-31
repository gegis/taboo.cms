const { config } = require('@taboo/cms-core');
const FormModel = require('modules/forms/models/FormModel');
const FormEntryModel = require('modules/forms/models/FormEntryModel');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const { api: { forms: { defaultSort = { createdAt: 'desc' } } = {} } = {} } = config;

class FormsAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: FormModel,
      searchFields: ['_id', 'title'],
      populate: {},
      defaultSort,
    });
  }

  async getEntries(ctx) {
    const { params: { formId } = {} } = ctx;
    ctx.body = await FormEntryModel.find({ form: formId }, null, { sort: { createdAt: 'desc' } });
  }
}

module.exports = new FormsAdminController();
