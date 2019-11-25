const { config } = require('@taboo/cms-core');
const AdminController = require('../../core/controllers/AdminController');
const {
  api: {
    moduleName: { defaultSort = { createdAt: 'desc' } } = {},
  },
} = config;

class ModuleNameAdminController extends AdminController {
  constructor() {
    super({
      model: 'moduleName.ModelName',
      searchFields: ['_id'],
      populate: {},
      defaultSort,
    });
  }
}

module.exports = new ModuleNameAdminController();
