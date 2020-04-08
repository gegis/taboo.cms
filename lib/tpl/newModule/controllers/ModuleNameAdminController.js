const { config } = require('@taboo/cms-core');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const {
  api: { moduleName: { defaultSort = { createdAt: 'desc' } } = {} },
} = config;

class ModuleNameAdminController extends AbstractAdminController {
  constructor() {
    super({
      // TODO change this
      model: 'moduleName.ModelName',
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
