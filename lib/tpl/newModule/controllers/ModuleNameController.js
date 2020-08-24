const ModelNameModel = require('modules/moduleName/services/ModelNameModel');
const ModuleNameHelper = require('modules/moduleName/helpers/ModuleNameHelper');
const AbstractController = require('modules/core/controllers/AbstractController');

class ModuleNameController extends AbstractController {
  constructor() {
    super({
      model: ModelNameModel,
      defaultSort: { createdAt: 'desc' },
      defaultFilter: { enabled: true },
      searchFields: ['name'],
    });
    this.index = this.index.bind(this);
  }

  async index(ctx) {
    const result = await this.getAllItems(ctx);
    ctx.viewParams.module = ModuleNameHelper.getModule();
    ctx.viewParams.data = await this.parseGetAllItemsResult(result);
  }
}

module.exports = new ModuleNameController();
