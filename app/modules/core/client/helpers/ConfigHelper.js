import ArrayHelper from './ArrayHelper';

class ConfigHelper {
  constructor() {
    this.modulesConfigs = this.importAllModulesConfigs();
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
   * @param modulesConfigs
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
   * @param modulesConfigs
   * @returns {object}
   */
  getStores() {
    const stores = {};
    [...this.modulesConfigs].map(config => {
      if (config && config.stores) {
        Object.assign(stores, config.stores);
      }
    });
    return stores;
  }
}

export default new ConfigHelper();
