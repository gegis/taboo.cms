const { config } = require('@taboo/cms-core');
const { api: { authorization: { type: { apiKeyName } = {} } = {} } = {} } = config;
const LogsApiService = require('modules/logs/services/LogsApiService');
const UserService = require('modules/users/services/UsersService');

// TODO - There is an issue - because it first hits global policy 'acl'.... which checks for user in ctx session
module.exports = async (ctx, next) => {
  const { header: { authorization } = {}, taboo: { moduleRoute = {} } = {} } = ctx;
  let token = null;
  let user, allowed;
  if (!authorization) {
    return ctx.throw(401, 'Authorization token not found');
  }
  try {
    token = UserService.parseAuthorizationToken(apiKeyName, authorization);
    if (!token) {
      return ctx.throw(401, 'ApiKey token not found');
    }
    user = await UserService.getUserData({ apiKey: token }, true);
    if (!user) {
      return ctx.throw(403, 'Not Authorized');
    }
    allowed = UserService.isUserRequestAllowed(ctx, user);
    if (allowed === false) {
      return ctx.throw(403, 'Forbidden');
    }
  } catch (e) {
    if (token) {
      LogsApiService.create({ action: moduleRoute.path, token, user, code: e.status, error: e.message });
    }
    return ctx.throw(e.status, e.message);
  }
  LogsApiService.create({ action: moduleRoute.path, token, user, code: 'SUCCESS' });
  return next();
};
