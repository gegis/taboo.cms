const ModelNameModel = require('modules/moduleName/models/ModelNameModel');

class ModuleNameService {
  async getAllEnabled() {
    return ModelNameModel.find({ enabled: true });
  }
}

module.exports = new ModuleNameService();
