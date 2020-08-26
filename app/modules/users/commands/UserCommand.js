const { Password, Confirm, Input } = require('enquirer');
const CLIHelper = require('modules/cli/helpers/CLIHelper');
const CoreHelper = require('modules/core/helpers/CoreHelper');
const AuthService = require('modules/users/services/AuthService');
const UserModel = require('modules/users/models/UserModel');
const RoleModel = require('modules/acl/models/RoleModel');

class UserCommand {
  constructor() {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roles: [],
      admin: false,
      active: true,
    };
  }

  async create() {
    let userRolesIds = [];
    let newUser, newAdminRole;

    await this.promptUser();

    if (this.user.admin) {
      userRolesIds = await this.getAllRolesIds();
      if (userRolesIds.length === 0) {
        newAdminRole = this.createAdminRole();
        if (newAdminRole) {
          userRolesIds.push(newAdminRole._id);
        }
      }
      this.user.roles = userRolesIds;
    }
    this.user.password = await AuthService.hashPassword(this.user.password);
    newUser = await UserModel.create(this.user);
    if (newUser) {
      CLIHelper.log(newUser, 'info');
      return 'User successfully created!';
    } else {
      throw new Error('Failed to create user');
    }
  }

  async promptUser() {
    const emailPrompt = this.getEmailPrompt();
    const passwordPrompt = this.getPasswordPrompt();
    const adminPrompt = this.getAdminPrompt();

    this.user.email = await emailPrompt.run();
    this.user.password = await passwordPrompt.run();
    this.user.admin = await adminPrompt.run();

    this.user.firstName = this.user.email.split('@')[0];
    this.user.lastName = this.user.email.split('@')[0];

    this.user.username = CoreHelper.parseSlug(this.user.firstName);
    this.user.country = 'GB';
  }

  getEmailPrompt() {
    return new Input({
      name: 'email',
      message: 'Please enter email:',
    });
  }

  getPasswordPrompt() {
    return new Password({
      name: 'password',
      message: 'Please enter password:',
    });
  }

  getAdminPrompt() {
    return new Confirm({
      name: 'admin',
      message: 'Create as admin?',
    });
  }

  async getAllRolesIds() {
    const rolesIds = [];
    let roles = await RoleModel.find();
    if (roles && roles.length > 0) {
      roles.map(role => {
        rolesIds.push(role._id);
      });
    }
    return rolesIds;
  }

  async createAdminRole() {
    return await RoleModel.create({
      name: 'Administrator',
      resources: ['admin.dashboard', 'admin.acl.view', 'admin.acl.manage', 'admin.users.view', 'admin.users.manage'],
    });
  }
}

module.exports = new UserCommand();
