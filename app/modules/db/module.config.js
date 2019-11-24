const InitDbService = require('./services/InitDbService');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [],
  npmDependencies: [],
  afterModelsSetup: InitDbService.init,
};
