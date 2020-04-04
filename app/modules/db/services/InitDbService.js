const { logger, config } = require('@taboo/cms-core');
const pages = require('../data/pages');
const navigation = require('../data/navigation');

// TODO - think of refactoring db adapter to move from app/db/adapters into this module
// TODO - also implement db migrations
class InitDbService {
  constructor() {
    this.dbInitialized = false;
    this.newUserRole = null;
    this.newAdminRole = null;
    this.newAdminUser = null;
    this.init = this.init.bind(this);
  }

  async init(modules, aclResources) {
    const { Settings: SettingsService } = modules.settings.services;
    // TODO - think of putting this db value not in db - to have every restart faster
    const dbValue = await SettingsService.getValue('db');
    if (dbValue && dbValue.initialized) {
      this.dbInitialized = true;
    }
    if (!this.dbInitialized) {
      await this.setupAdminRole(modules, aclResources);
      await this.setupUserRole(modules, aclResources);
      await this.setupAdminUser(modules, this.newAdminRole);
      await this.setupPages(modules, pages);
      await this.setupNavigation(modules, navigation);
      // TODO setup any settings to db if needed in here
      await SettingsService.setValue('db', { initialized: true }, 'object');
    }
  }

  async setupAdminRole(modules, aclResources) {
    const { Role: RoleModel } = modules.acl.models;
    this.newAdminRole = await RoleModel.create({
      name: 'Administrator',
      resources: aclResources,
    });
    logger.info(`Successfully created '${this.newAdminRole.name}' role`);
  }

  async setupUserRole(modules) {
    const { Role: RoleModel } = modules.acl.models;
    this.newUserRole = await RoleModel.create({
      name: 'User',
      resources: ['api.uploads.userFiles'],
    });
    logger.info(`Successfully created '${this.newUserRole.name}' role`);
  }

  async setupAdminUser(modules, role) {
    const { Users: UsersService } = modules.users.services;
    const { User: UserModel } = modules.users.models;
    const { admin: { initialUser } = {} } = config;
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
  }

  async setupPages(modules, pages = []) {
    const { Page: PageModel } = modules.pages.models;
    for (let i = 0; i < pages.length; i++) {
      await PageModel.create(pages[i]);
    }
  }

  async setupNavigation(modules, navigation = []) {
    const { Navigation: NavigationModel } = modules.navigation.models;
    for (let i = 0; i < navigation.length; i++) {
      await NavigationModel.create(navigation[i]);
    }
  }
}

module.exports = new InitDbService();
