const { Model } = require('@taboo/cms-core');

class ModuleNameController {
  async index() {}

  async getAll(ctx) {
    ctx.body = await Model('moduleName.ModelName').find();
  }
}

module.exports = new ModuleNameController();
