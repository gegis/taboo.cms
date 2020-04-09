const { logger, config } = require('@taboo/cms-core');
const UsersService = require('modules/users/services/UsersService');
const SettingsService = require('modules/settings/services/SettingsService');
const UserModel = require('modules/users/models/UserModel');
const RoleModel = require('modules/acl/models/RoleModel');
const PageModel = require('modules/pages/models/PageModel');
const NavigationModel = require('modules/navigation/models/NavigationModel');

const pages = require('../data/pages');
const navigation = require('../data/navigation');

// TODO - implement db migrations and data fixtures
class InitDbService {
  constructor() {
    this.dbInitialized = false;
    this.newUserRole = null;
    this.newAdminRole = null;
    this.newAdminUser = null;
    this.init = this.init.bind(this);
  }

  async init(modules, aclResources) {
    // TODO - think of putting this db value not in db - to have every restart faster - put in config like init user!!!
    const dbValue = await SettingsService.getValue('db');
    if (dbValue && dbValue.initialized) {
      this.dbInitialized = true;
    }
    if (!this.dbInitialized) {
      await this.setupAdminRole(aclResources);
      await this.setupUserRole(aclResources);
      await this.setupAdminUser(this.newAdminRole);
      await this.setupPages(pages);
      await this.setupNavigation(navigation);
      // TODO setup any settings to db if needed in here
      await SettingsService.setValue('db', { initialized: true }, 'object');
    }
  }

  async setupAdminRole(aclResources) {
    this.newAdminRole = await RoleModel.create({
      name: 'Administrator',
      resources: aclResources,
    });
    logger.info(`Successfully created '${this.newAdminRole.name}' role`);
  }

  async setupUserRole() {
    this.newUserRole = await RoleModel.create({
      name: 'User',
      resources: ['api.uploads.userFiles'],
    });
    logger.info(`Successfully created '${this.newUserRole.name}' role`);
  }

  async setupAdminUser(role) {
    const { admin: { cms: { initialUser } = {} } = {} } = config;
    const userData = {
      admin: true,
      active: true,
      firstName: initialUser.firstName,
      lastName: initialUser.lastName,
      email: initialUser.email,
      password: await UsersService.hashPassword(initialUser.pass),
      roles: [role],
    };
    this.newAdminUser = await UserModel.create(userData);
    logger.info('Successfully created ADMIN USER!');
    logger.info(`EMAIL: '${this.newAdminUser.email}'`);
    logger.info(`PASSWORD: ${initialUser.pass}`);
    logger.warn('Make sure to change the password!');
  }

  async setupPages(pages = []) {
    for (let i = 0; i < pages.length; i++) {
      await PageModel.create(pages[i]);
    }
  }

  async setupNavigation(navigation = []) {
    for (let i = 0; i < navigation.length; i++) {
      await NavigationModel.create(navigation[i]);
    }
  }
}

module.exports = new InitDbService();
