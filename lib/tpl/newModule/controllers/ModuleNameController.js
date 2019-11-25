const { Service, Helper } = require('@taboo/cms-core');

class ModuleNameController {
  async index(ctx) {
    ctx.view = {
      module: Helper('moduleName.ModuleName').getModule(),
    };
  }

  async getAll(ctx) {
    ctx.body = await Service('moduleName.ModuleName').getAllEnabled();
  }
}

module.exports = new ModuleNameController();
