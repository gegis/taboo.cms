const { config } = require('@taboo/cms-core');
const AbstractAdminController = require('../../core/controllers/AbstractAdminController');
const {
  api: { moduleName: { defaultSort = { createdAt: 'desc' } } = {} },
} = config;

class ModuleNameAdminController extends AbstractAdminController {
  constructor() {
    super({
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
