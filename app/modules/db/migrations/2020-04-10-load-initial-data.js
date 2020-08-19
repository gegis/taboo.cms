const { config, getAclResources } = require('@taboo/cms-core');
const CLIHelper = require('modules/cli/helpers/CLIHelper');
const UsersService = require('modules/users/services/UsersService');
const RoleModel = require('modules/acl/models/RoleModel');
const UserModel = require('modules/users/models/UserModel');
const PageModel = require('modules/pages/models/PageModel');
const NavigationModel = require('modules/navigation/models/NavigationModel');
const SettingsModel = require('modules/settings/models/SettingsModel');
const EmailModel = require('modules/emails/models/EmailModel');
const CountryModel = require('modules/countries/models/CountryModel');
const CoreHelper = require('modules/core/helpers/CoreHelper');

const { admin: { cms: { initialUser, adminRoleName, userRoleName, userAclResources } = {} } = {} } = config;
const pages = require('../data/pages');
const navigation = require('../data/navigation');
const settings = require('../data/settings');
const emails = require('../data/emails');
const countries = require('../data/countries');
const TemplatesService = require('modules/templates/services/TemplatesService');

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

    await TemplatesService.initDbTemplates();
    CLIHelper.log('Initialized Templates', 'info');

    await this.createPages(pages);
    CLIHelper.log('Created Pages', 'info');

    await this.createNavigation(navigation);
    CLIHelper.log('Created Navigation', 'info');

    await this.createSettings(settings);
    CLIHelper.log('Created Settings', 'info');

    await this.createEmails(emails);
    CLIHelper.log('Created Emails', 'info');

    await this.createCountries(countries);
    CLIHelper.log('Created Settings', 'info');

    return 'Initial data load UP has successfully finished.';
  },

  async down() {
    this.adminRole = await this.deleteAdminRole();
    CLIHelper.log(`Deleted Admin Role: ${this.adminRole.name}`, 'info');

    this.userRole = await this.deleteUserRole();
    CLIHelper.log(`Deleted User Role: ${this.userRole.name}`, 'info');

    this.adminUser = await this.deleteAdminUser();
    CLIHelper.log(`Deleted Admin User: ${this.adminUser.email}`, 'info');

    await TemplatesService.removeDbTemplates();
    CLIHelper.log('Removed Templates', 'info');

    await this.deletePages(pages);
    CLIHelper.log('Deleted Pages', 'info');

    await this.deleteNavigation(navigation);
    CLIHelper.log('Deleted Navigation', 'info');

    await this.deleteSettings(settings);
    CLIHelper.log('Deleted Settings', 'info');

    await this.deleteEmails(emails);
    CLIHelper.log('Deleted Emails', 'info');

    await this.deleteCountries(countries);
    CLIHelper.log('Deleted Countries', 'info');

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
      await NavigationModel.findOneAndDelete({ name: navigation[i].name });
    }
  },

  async createSettings(settings = []) {
    for (let i = 0; i < settings.length; i++) {
      await SettingsModel.create(settings[i]);
    }
  },

  async deleteSettings(settings = []) {
    for (let i = 0; i < settings.length; i++) {
      await SettingsModel.findOneAndDelete({ key: settings[i].key });
    }
  },

  async createEmails(emails = []) {
    for (let i = 0; i < emails.length; i++) {
      await EmailModel.create(emails[i]);
    }
  },

  async deleteEmails(emails = []) {
    for (let i = 0; i < emails.length; i++) {
      await EmailModel.findOneAndDelete({ key: emails[i].key });
    }
  },

  async createCountries(countries = []) {
    for (let i = 0; i < countries.length; i++) {
      await CountryModel.create(countries[i]);
    }
  },

  async deleteCountries(countries = []) {
    for (let i = 0; i < countries.length; i++) {
      await CountryModel.findOneAndDelete({ key: countries[i].key });
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
      country: 'GB',
      username: CoreHelper.parseSlug(initialUser.firstName),
      password: await UsersService.hashPassword(initialUser.pass),
      roles: [role],
    };
  },
};
