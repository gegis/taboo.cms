const { config } = require('@taboo/cms-core');

const AuthService = require('modules/users/services/AuthService');
const LogsApiService = require('modules/logs/services/LogsApiService');

const { api: { authorization: { apiKeyName } = {} } = {} } = config;

module.exports = async (ctx, next) => {
  const {
    session: { user: { id = null } = {} } = {},
    header: { authorization = null } = {},
    routeParams: { moduleRoute = {} } = {},
  } = ctx;
  let user;

  if (id) {
    return next();
  } else if (authorization) {
    user = await AuthService.parseUserFromHeader(ctx);
    if (user && user.id) {
      if (authorization.indexOf(apiKeyName) !== -1) {
        await LogsApiService.create({
          action: moduleRoute.path,
          token: AuthService.parseAuthorizationToken(apiKeyName, authorization),
          authType: apiKeyName,
          user,
          code: 'SUCCESS',
        });
      }
      return next();
    }
  }
  return ctx.throw(401, 'Not Authorized');
};
