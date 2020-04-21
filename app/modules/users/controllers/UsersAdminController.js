const { config, sockets } = require('@taboo/cms-core');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const UsersService = require('modules/users/services/UsersService');
const ACLService = require('modules/acl/services/ACLService');
const UserModel = require('modules/users/models/UserModel');
const {
  api: {
    users: { defaultSort = null },
  },
} = config;

class UsersAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: UserModel,
      searchFields: ['_id', 'firstName', 'lastName', 'email'],
      defaultSort,
      populate: {
        findAll: 'roles',
        findById: ['documentPersonal1', 'documentPersonal2', 'documentIncorporation'],
        create: 'roles',
        update: ['roles'],
      },
    });
  }

  async admin(ctx) {
    const { cms: { title } = {} } = config.admin;
    ctx.view = {
      _theme: 'admin',
      metaTitle: title,
    };
  }

  async beforeFindAll(ctx, data) {
    if (!data.fields) {
      data.fields = '-password';
    }
    return data;
  }

  async beforeFindById(ctx, id, data) {
    if (!data.fields) {
      data.fields = '-password';
    }
    return data;
  }

  async beforeCreate(ctx, data) {
    data.password = await UsersService.hashPassword(data.password);
    return data;
  }

  async beforeUpdate(ctx, id, data) {
    if (data.password) {
      data.password = await UsersService.hashPassword(data.password);
    } else if (Object.prototype.hasOwnProperty.call(data, 'password')) {
      delete data.password;
    }
    if (data.verified) {
      data.verificationStatus = 'approved';
    }
    return data;
  }

  async afterUpdate(ctx, user) {
    await UsersService.updateUserSession(user);
    sockets.emit('users', `user-${user._id}-user-update`, {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    return user;
  }
  async afterDelete(ctx, user) {
    await ACLService.deleteUserSession(user);
    return user;
  }
}

module.exports = new UsersAdminController();
