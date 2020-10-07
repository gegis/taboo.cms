const { config } = require('@taboo/cms-core');
const moment = require('moment');
const Json2csvParser = require('json2csv').Parser;

const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const CoreHelper = require('modules/core/helpers/CoreHelper');
const CountriesService = require('modules/countries/services/CountriesService');
const AuthService = require('modules/users/services/AuthService');
const UsersService = require('modules/users/services/UsersService');
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
      searchFields: ['_id', 'username', 'email'],
      defaultSort,
      populate: {
        findAll: 'roles',
        findById: ['documentPersonal1', 'documentPersonal2'],
        create: 'roles',
        update: ['roles'],
      },
    });
  }

  async admin(ctx) {
    const { cms: { title } = {} } = config.admin;
    ctx.viewParams = {
      _template: 'admin',
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
    await UsersService.validateUniqueApiKey(ctx, data);
    data.password = await AuthService.hashPassword(data.password);
    return data;
  }

  async beforeUpdate(ctx, id, data) {
    await UsersService.validateUniqueApiKey(ctx, data, id);
    if (data.password) {
      data.password = await AuthService.hashPassword(data.password);
    } else if (Object.prototype.hasOwnProperty.call(data, 'password')) {
      delete data.password;
    }
    if (data.verified) {
      data.verificationStatus = 'approved';
    }
    return data;
  }

  async afterUpdate(ctx, user) {
    await UsersService.updateUserSession(ctx, user);
    UsersService.socketsEmitUserChanges(user);
    return user;
  }

  async afterDelete(ctx, user) {
    await UsersService.onUserDelete(user);
    await UsersService.deleteUserSession(user);
    return user;
  }

  async resendVerifyEmail(ctx) {
    const { params: { id } = {} } = ctx;
    const user = await UserModel.findById(id);
    ctx.body = await UsersService.sendUserVerificationEmail(ctx, user);
  }

  async exportUsers(ctx) {
    const params = CoreHelper.parseRequestParams(ctx);
    const userFields = ['_id', 'username', 'email', 'country', 'createdAt', 'active', 'verified'];
    const allCountries = CountriesService.getAll();
    const jsonFields = [
      {
        label: 'ID',
        value: '_id',
      },
      {
        label: 'Username',
        value: 'username',
      },
      {
        label: 'Email',
        value: 'email',
      },
      {
        label: 'Country Code',
        value: 'country',
      },
      {
        label: 'Country',
        value: row => {
          if (row.country && allCountries[row.country]) {
            return allCountries[row.country];
          }
          return '';
        },
      },
      {
        label: 'Created At',
        value: 'createdAt',
      },
      {
        label: 'Active',
        value: 'active',
      },
      {
        label: 'Verified',
        value: 'verified',
      },
    ];
    const users = await UsersService.getUsers(params.filter, userFields);
    const json2csvParser = new Json2csvParser({ jsonFields });
    const csv = json2csvParser.parse(users);
    const exportFileName = `Users-${moment().format('YYYY-MM-DD_hh_mm_ss')}.csv`;
    ctx.set('Content-type', 'text/csv');
    ctx.set('Content-disposition', `attachment; filename=${exportFileName}`);
    ctx.body = csv;
  }

  async findUserApiKeys(ctx) {
    const { params: { userId } = {} } = ctx;
    ctx.body = await AuthService.getUserApiKeys(userId);
  }

  async createUserApiKey(ctx) {
    const { params: { userId } = {} } = ctx;
    ctx.body = await AuthService.createUserApiKey(userId);
  }

  async renewUserApiKey(ctx) {
    const { params: { userId, apiKeyId } = {} } = ctx;
    ctx.body = await AuthService.renewUserApiKey(userId, apiKeyId);
  }

  async deleteUserApiKey(ctx) {
    const { params: { userId, apiKeyId } = {} } = ctx;
    ctx.body = await AuthService.deleteUserApiKey(userId, apiKeyId);
  }
}

module.exports = new UsersAdminController();
