const { logger } = require('@taboo/cms-core');

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
    const { Settings: SettingsService } = modules.core.services;
    const dbValue = await SettingsService.getValue('db');
    if (dbValue && dbValue.initialized) {
      this.dbInitialized = true;
    }
    if (!this.dbInitialized) {
      await this.setupAdminRole(modules, aclResources);
      await this.setupUserRole(modules, aclResources);
      await this.setupAdminUser(modules, this.newAdminRole);
      await SettingsService.setValue('db', { initialized: true });
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
      resources: [],
    });
    logger.info(`Successfully created '${this.newUserRole.name}' role`);
  }

  async setupAdminUser(modules, role) {
    const { Users: UsersService } = modules.users.services;
    const { User: UserModel } = modules.users.models;
    const pass = 'admin';
    const userData = {
      admin: true,
      active: true,
      firstName: 'Taboo',
      lastName: 'CMS',
      email: 'admin@taboo.solutions',
      password: await UsersService.hashPassword(pass),
      roles: [role],
    };
    this.newAdminUser = await UserModel.create(userData);
    logger.info(`Successfully created ADMIN USER, email: '${this.newAdminUser.email}', password: ${pass}`);
  }

  // TODO - setup initial pages, like home, about, contact
  async setupPages() {}
}

module.exports = new InitDbService();
