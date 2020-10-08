const { config } = require('@taboo/cms-core');
const EmailModel = require('modules/emails/models/EmailModel');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const UsersService = require('modules/users/services/UsersService');
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
    const user = await UsersService.getCurrentUser(ctx);
    data.user = user.id;
    return data;
  }
}

module.exports = new EmailsAdminController();
