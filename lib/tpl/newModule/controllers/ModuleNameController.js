const ModuleNameService = require('modules/moduleName/services/ModuleNameService');
const ModuleNameHelper = require('modules/moduleName/helpers/ModuleNameHelper');

class ModuleNameController {
  async index(ctx) {
    if (!ctx.view) {
      ctx.view = {};
    }
    ctx.view.module = ModuleNameHelper.getModule();
    ctx.view.items = await ModuleNameService.getAllEnabled();
  }

  async getAll(ctx) {
    ctx.body = await ModuleNameService.getAllEnabled();
  }
}

module.exports = new ModuleNameController();
