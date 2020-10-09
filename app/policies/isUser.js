const LogsApiService = require('modules/logs/services/LogsApiService');
const UsersService = require('modules/users/services/UsersService');

module.exports = async (ctx, next) => {
  const user = await UsersService.getCurrentUser(ctx);
  if (user && user.id) {
    await LogsApiService.logApiAction(ctx, user, 200, 'Success');
    return next();
  }

  return ctx.throw(401, 'Not Authorized');
};
