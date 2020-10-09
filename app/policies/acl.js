const AuthService = require('modules/users/services/AuthService');
const LogsApiService = require('modules/logs/services/LogsApiService');
const UsersService = require('modules/users/services/UsersService');

module.exports = async (ctx, next) => {
  const user = await UsersService.getCurrentUser(ctx);
  const allowed = AuthService.isUserRequestAllowed(ctx, user);
  // if allowed value is undefined - it means acl is not enabled / implemented
  if (allowed === false) {
    await LogsApiService.logApiAction(ctx, user, 403, 'Forbidden');
    return ctx.throw(403, 'Forbidden');
  }
  return next();
};
