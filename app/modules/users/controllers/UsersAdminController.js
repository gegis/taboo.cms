const { Service, config, sockets } = require('@taboo/cms-core');
const AdminController = require('../../core/controllers/AdminController');
const {
  api: {
    users: { defaultSort = null },
  },
} = config;

class UsersAdminController extends AdminController {
  constructor() {
    super({
      model: 'users.User',
      searchFields: ['_id', 'firstName', 'lastName', 'email'],
      defaultSort,
      populate: {
        findAll: 'roles',
        findById: ['documentPassport1', 'documentPassport2', 'documentIncorporation'],
        create: 'roles',
        update: 'roles',
      },
    });
  }

  async admin(ctx) {
    const { title } = config.admin;
    ctx.view = {
      _layout: 'admin',
      pageTitle: title,
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
    data.password = await Service('users.Users').hashPassword(data.password);
    return data;
  }

  async beforeUpdate(ctx, id, data) {
    if (data.password) {
      data.password = await Service('users.Users').hashPassword(data.password);
    } else if (Object.prototype.hasOwnProperty.call(data, 'password')) {
      delete data.password;
    }
    if (data.verified) {
      data.verificationStatus = 'approved';
    }
    return data;
  }

  async afterUpdate(ctx, user) {
    await Service('users.Users').updateUserSession(user);
    sockets.emit('users', `user-${user._id}-user-update`, {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    return user;
  }
  async afterDelete(ctx, user) {
    await Service('acl.ACL').deleteUserSession(user);
    return user;
  }
}

module.exports = new UsersAdminController();
