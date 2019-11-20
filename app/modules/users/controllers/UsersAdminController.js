const { Model, Service, apiHelper, Helper, config, sockets } = require('@taboo/cms-core');

class UsersAdminController {
  async admin(ctx) {
    const { title } = config.admin;
    ctx.view = {
      _layout: 'admin',
      pageTitle: title,
    };
  }

  async findAll(ctx) {
    const requestParams = ctx.request.query;
    const {
      api: {
        users: { defaultSort = null },
      },
    } = config;
    let { filter, fields, limit, skip, sort } = apiHelper.parseRequestParams(ctx.request.query, [
      'filter',
      'fields',
      'limit',
      'skip',
      'sort',
    ]);
    let searchFields = ['firstName', 'lastName', 'email'];
    if (requestParams && requestParams.search) {
      Helper('core.Core').applySearchToFilter(requestParams.search, searchFields, filter);
    }
    if (sort === null) {
      sort = defaultSort;
    }
    ctx.body = await Model('users.User')
      .find(filter, fields, { limit, skip, sort })
      .populate('roles');
  }

  async findById(ctx) {
    let { fields } = apiHelper.parseRequestParams(ctx.request.query, ['fields']);
    if (!fields) {
      fields = '-password';
    }
    const user = await Model('users.User')
      .findById(ctx.params.id, fields)
      .populate(['documentPassport1', 'documentPassport2', 'documentIncorporation']);
    ctx.body = user;
  }

  async create(ctx) {
    const data = ctx.request.body;
    data.password = await Service('users.Users').hashPassword(data.password);
    ctx.body = await Model('users.User').create(data);
  }

  async update(ctx) {
    const data = ctx.request.body;
    let user;
    if (data.password) {
      data.password = await Service('users.Users').hashPassword(data.password);
    } else if (Object.prototype.hasOwnProperty.call(data, 'password')) {
      delete data.password;
    }
    apiHelper.cleanTimestamps(data);
    if (data.verified) {
      data.verificationStatus = 'approved';
    }
    user = await Model('users.User')
      .findByIdAndUpdate(ctx.params.id, data, { new: true })
      .populate('roles');
    await Service('users.Users').updateUserSession(user);
    sockets.emit('users', `user-${user._id}-user-update`, {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    ctx.body = user;
  }

  async delete(ctx) {
    let user;
    user = await Model('users.User').findByIdAndDelete(ctx.params.id);
    await Service('acl.ACL').deleteUserSession(user);
    ctx.body = user;
  }

  async count(ctx) {
    ctx.body = await Model('users.User').estimatedDocumentCount();
  }
}

module.exports = new UsersAdminController();
