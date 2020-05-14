import ArrayHelper from './ArrayHelper';

class AdminConfigHelper {
  constructor() {
    this.modulesConfigs = this.importAllModulesConfigs();
    this.primaryMenu = [];
    this.primaryMenuNames = [];
  }

  /**
   * Imports clientConfig from all modules
   */
  importAllModulesConfigs() {
    const modules = require.context('../../../', true, /admin\.config\.js$/);
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
      if (config && config.enabled && config.routes) {
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
      if (config && config.enabled && config.stores) {
        Object.assign(stores, config.stores);
      }
    });
    return stores;
  }

  getPrimaryMenuItems() {
    if (this.primaryMenu.length === 0) {
      this.modulesConfigs.map(config => {
        if (config && config.enabled && config.primaryMenu) {
          config.primaryMenu.map(menuItem => {
            const index = this.primaryMenuNames.indexOf(menuItem.text);
            if (index === -1) {
              this.primaryMenu.push(menuItem);
              this.primaryMenuNames.push(menuItem.text);
            } else {
              if (!this.primaryMenu[index].dropdown) {
                this.primaryMenu[index].dropdown = [];
              }
              this.primaryMenu[index].dropdown = this.primaryMenu[index].dropdown.concat(menuItem.dropdown);
              return ArrayHelper.sortByProperty(this.primaryMenu[index].dropdown, 'order');
            }
          });
        }
      });
      return ArrayHelper.sortByProperty(this.primaryMenu, 'order');
    }
    return this.primaryMenu;
  }

  getTemplates() {
    let items = [];
    [...this.modulesConfigs].map(config => {
      if (config && config.enabled && config.primaryMenu) {
        items = items.concat(config.primaryMenu);
      }
    });
    return ArrayHelper.sortByProperty(items, 'order');
  }
}

export default new AdminConfigHelper();
