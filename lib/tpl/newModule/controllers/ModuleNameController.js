const ModuleNameService = require('modules/moduleName/services/ModuleNameService');
const ModuleNameHelper = require('modules/moduleName/helpers/ModuleNameHelper');

class ModuleNameController {
  async index(ctx) {
    ctx.viewParams.module = ModuleNameHelper.getModule();
    ctx.viewParams.items = await ModuleNameService.getAllEnabled();
  }

  async getAll(ctx) {
    ctx.body = await ModuleNameService.getAllEnabled();
  }
}

module.exports = new ModuleNameController();
