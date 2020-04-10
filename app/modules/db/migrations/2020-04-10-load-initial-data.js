const { config, getAclResources } = require('@taboo/cms-core');
const CLIHelper = require('modules/cli/helpers/CLIHelper');
const UsersService = require('modules/users/services/UsersService');
const RoleModel = require('modules/acl/models/RoleModel');
const UserModel = require('modules/users/models/UserModel');
const PageModel = require('modules/pages/models/PageModel');
const NavigationModel = require('modules/navigation/models/NavigationModel');

const { admin: { cms: { initialUser, adminRoleName, userRoleName, userAclResources } = {} } = {} } = config;
const pages = require('../data/pages');
const navigation = require('../data/navigation');

module.exports = {
  adminRoleName: adminRoleName,
  userRoleName: userRoleName,
  userAclResources: userAclResources,
  adminUser: null,
  adminRole: null,
  userRole: null,

  async up() {
    this.adminRole = await this.createAdminRole();
    CLIHelper.log(`Created Admin Role: ${this.adminRole.name}`, 'info');

    this.userRole = await this.createUserRole();
    CLIHelper.log(`Created User Role: ${this.userRole.name}`, 'info');

    this.adminUser = await this.createAdminUser(this.adminRole);
    CLIHelper.log('Successfully created ADMIN USER!', 'info');
    CLIHelper.log(`EMAIL: ${this.adminUser.email}`, 'notice');
    CLIHelper.log(`PASSWORD: ${initialUser.pass}`, 'notice');
    CLIHelper.log('Make sure to change the password later on!', 'warn');

    await this.createPages(pages);
    CLIHelper.log('Created Pages', 'info');

    await this.createNavigation(navigation);
    CLIHelper.log('Created Navigation', 'info');

    return 'Initial data load UP has successfully finished.';
  },

  async down() {
    this.adminRole = await this.deleteAdminRole();
    CLIHelper.log(`Deleted Admin Role: ${this.adminRole.name}`, 'info');

    this.userRole = await this.deleteUserRole();
    CLIHelper.log(`Deleted User Role: ${this.userRole.name}`, 'info');

    this.adminUser = await this.deleteAdminUser();
    CLIHelper.log(`Deleted Admin User: ${this.adminUser.email}`, 'info');

    await this.deletePages(pages);
    CLIHelper.log('Deleted Pages', 'info');

    await this.deleteNavigation(navigation);
    CLIHelper.log('Deleted Navigation', 'info');

    return 'Initial data load DOWN has successfully finished.';
  },

  async createAdminRole() {
    return RoleModel.create({
      name: this.adminRoleName,
      resources: this.getAclResources(),
    });
  },

  async deleteAdminRole() {
    return RoleModel.findOneAndDelete({ name: this.adminRoleName });
  },

  async createUserRole() {
    return RoleModel.create({
      name: this.userRoleName,
      resources: this.userAclResources,
    });
  },

  async deleteUserRole() {
    return RoleModel.findOneAndDelete({ name: this.userRoleName });
  },

  async createAdminUser(role) {
    const userData = await this.getAdminUserData(role);
    return UserModel.create(userData);
  },

  async deleteAdminUser() {
    return UserModel.findOneAndDelete({ email: initialUser.email });
  },

  async createPages(pages = []) {
    for (let i = 0; i < pages.length; i++) {
      await PageModel.create(pages[i]);
    }
  },

  async deletePages(pages = []) {
    for (let i = 0; i < pages.length; i++) {
      await PageModel.findOneAndDelete({ url: pages[i].url });
    }
  },

  async createNavigation(navigation = []) {
    for (let i = 0; i < navigation.length; i++) {
      await NavigationModel.create(navigation[i]);
    }
  },

  async deleteNavigation(navigation = []) {
    for (let i = 0; i < navigation.length; i++) {
      await NavigationModel.findOneAndDelete({ slug: navigation[i].slug });
    }
  },

  getAclResources() {
    return getAclResources();
  },

  async getAdminUserData(role) {
    return {
      admin: true,
      active: true,
      firstName: initialUser.firstName,
      lastName: initialUser.lastName,
      email: initialUser.email,
      password: await UsersService.hashPassword(initialUser.pass),
      roles: [role],
    };
  },
};
