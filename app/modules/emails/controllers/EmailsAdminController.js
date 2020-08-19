const { config } = require('@taboo/cms-core');
const EmailModel = require('modules/emails/models/EmailModel');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const { api: { emails: { defaultSort = { createdAt: 'desc' } } = {} } = {} } = config;

class EmailsAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: EmailModel,
      searchFields: ['_id', 'name'],
      populate: {},
      defaultSort,
    });
  }

  async beforeCreate(ctx, data) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    data.user = userId;
    return data;
  }
}

module.exports = new EmailsAdminController();
