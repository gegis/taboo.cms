const { Model } = require('@taboo/cms-core');

class ModuleNameService {
  async getAllEnabled() {
    return Model('moduleName.ModelName').find({enabled: true});
  }
}

module.exports = new ModuleNameService();
