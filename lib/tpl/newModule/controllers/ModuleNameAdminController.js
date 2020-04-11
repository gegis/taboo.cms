const { config } = require('@taboo/cms-core');
const ModelNameModel = require('modules/moduleName/models/ModelNameModel');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const { api: { moduleName: { defaultSort = { createdAt: 'desc' } } = {} } = {} } = config;

class ModuleNameAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: ModelNameModel,
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

module.exports = new ModuleNameAdminController();
