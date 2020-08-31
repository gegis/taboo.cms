const { config } = require('@taboo/cms-core');

const AuthService = require('modules/users/services/AuthService');
const LogsApiService = require('modules/logs/services/LogsApiService');

const { api: { authorization: { apiKeyName } = {} } = {} } = config;

module.exports = async (ctx, next) => {
  let { session: { user = null } = {} } = ctx;
  const { header: { authorization = null } = {}, routeParams: { moduleRoute = {} } = {} } = ctx;
  let allowed;

  if (!user && authorization) {
    user = await AuthService.parseUserFromHeader(ctx);
  }
  allowed = AuthService.isUserRequestAllowed(ctx, user);
  // if allowed value is undefined - it means acl is not enabled / implemented
  if (allowed === false) {
    if (authorization.indexOf(apiKeyName) !== -1) {
      await LogsApiService.create({
        action: moduleRoute.path,
        token: AuthService.parseAuthorizationToken(apiKeyName, authorization),
        authType: apiKeyName,
        user,
        code: 403,
        error: 'Forbidden',
      });
    }
    return ctx.throw(403, 'Forbidden');
  }
  return next();
};
