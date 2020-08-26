const { config } = require('@taboo/cms-core');
const { api: { authorization: { type: { apiKeyName } = {} } = {} } = {} } = config;
const LogsApiService = require('modules/logs/services/LogsApiService');
const AuthService = require('modules/users/services/AuthService');
const UserService = require('modules/users/services/UsersService');

// TODO - Rethink global policies - because it first hits global policy 'acl'.... which checks for user in ctx session
module.exports = async (ctx, next) => {
  const { header: { authorization } = {}, routeParams: { moduleRoute = {} } = {} } = ctx;
  let token = null;
  let user, allowed;
  if (!authorization) {
    return ctx.throw(401, 'Authorization token not found');
  }
  try {
    token = AuthService.parseAuthorizationToken(apiKeyName, authorization);
    if (!token) {
      return ctx.throw(401, 'ApiKey token not found');
    }
    user = await UserService.getUserData({ apiKey: token }, { loadAcl: true });
    if (!user) {
      return ctx.throw(403, 'Not Authorized');
    }
    allowed = AuthService.isUserRequestAllowed(ctx, user);
    if (allowed === false) {
      return ctx.throw(403, 'Forbidden');
    }
  } catch (e) {
    if (token) {
      LogsApiService.create({
        action: moduleRoute.path,
        token,
        authType: apiKeyName,
        user,
        code: e.status,
        error: e.message,
      });
    }
    return ctx.throw(e.status, e.message);
  }
  LogsApiService.create({ action: moduleRoute.path, token, authType: apiKeyName, user, code: 'SUCCESS' });
  return next();
};
