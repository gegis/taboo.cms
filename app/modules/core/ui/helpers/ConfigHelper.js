import ArrayHelper from './ArrayHelper';

class ConfigHelper {
  constructor() {
    this.modulesConfigs = this.importAllModulesConfigs();
    this.pageBlocks = [];
    this.pageBlocksMap = {};
  }

  /**
   * Imports clientConfig from all modules
   */
  importAllModulesConfigs() {
    const modules = require.context('../../../', true, /app\.config\.js$/);
    return modules.keys().map(modules);
  }

  /**
   * Parses app routes from modulesConfigs
   * @returns {Array}
   */
  getRoutes() {
    const routes = [];
    [...this.modulesConfigs].map(config => {
      if (config && config.routes) {
        [...config.routes].map(route => {
          if (!route.order) {
            route.order = 0;
          }
          routes.push(route);
        });
      }
    });
    return ArrayHelper.sortByProperty(routes, 'order');
  }

  /**
   * Parses stores from modulesConfigs
   * @returns {object}
   */
  getStores() {
    return this.getOptionsByKey('stores');
  }

  /**
   * Parses modules config
   * @returns {object}
   */
  getModules() {
    return this.getOptionsByKey('modules');
  }

  getPageBlocks() {
    if (this.pageBlocks.length === 0) {
      this.parsePageBlocks();
    }
    return this.pageBlocks;
  }

  getPageBlocksMap() {
    if (this.pageBlocks.length === 0) {
      this.parsePageBlocks();
    }
    return this.pageBlocksMap;
  }

  parsePageBlocks() {
    [...this.modulesConfigs].map(config => {
      if (config && config.enabled && config.pageBlocks) {
        config.pageBlocks.map(pageBlock => {
          this.pageBlocksMap[pageBlock.name] = pageBlock;
          this.pageBlocks.push(pageBlock);
        });
      }
    });
  }

  getOptionsByKey(key) {
    const options = {};
    [...this.modulesConfigs].map(config => {
      if (config && config[key]) {
        Object.assign(options, config[key]);
      }
    });
    return options;
  }
}

export default new ConfigHelper();
