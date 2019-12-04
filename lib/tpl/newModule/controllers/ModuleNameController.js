const { Service, Helper } = require('@taboo/cms-core');

class ModuleNameController {
  async index(ctx) {
    if (!ctx.view) {
      ctx.view = {};
    }
    ctx.view.module = Helper('moduleName.ModuleName').getModule();
    ctx.view.dogs = await Service('moduleName.ModuleName').getAllEnabled();
  }

  async getAll(ctx) {
    ctx.body = await Service('moduleName.ModuleName').getAllEnabled();
  }
}

module.exports = new ModuleNameController();
