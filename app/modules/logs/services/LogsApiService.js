const { config } = require('@taboo/cms-core');
const LogApiModel = require('modules/logs/models/LogApiModel');
const AuthService = require('modules/users/services/AuthService');
const { api: { authorization: { apiKeyName } = {} } = {} } = config;

class LogsApiService {
  async logApiAction(ctx, user, code = 200, message = '') {
    const { header: { authorization = {} } = {}, routeParams: { moduleRoute = {} } = {} } = ctx;
    let log = null;
    if (authorization.indexOf(apiKeyName) !== -1) {
      log = await this.create({
        action: moduleRoute.path,
        token: AuthService.parseAuthorizationToken(apiKeyName, authorization),
        authType: apiKeyName,
        user,
        code: code,
        message: message,
      });
    }

    return log;
  }

  async create({ action = '', token = null, authType = '', user = null, code = '', message = '' }) {
    return await LogApiModel.create({ action, token, authType, code, message, user });
  }
}

module.exports = new LogsApiService();
