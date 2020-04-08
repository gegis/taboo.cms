const InitDbService = require('./services/InitDbService');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [],
  npmDependencies: [],
  afterModulesSetup: InitDbService.init,
};
