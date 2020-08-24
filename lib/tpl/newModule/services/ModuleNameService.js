const ModelNameModel = require('modules/moduleName/models/ModelNameModel');

class ModuleNameService {
  // This is just an example
  async getAllEnabled() {
    return ModelNameModel.find({ enabled: true });
  }
}

module.exports = new ModuleNameService();
