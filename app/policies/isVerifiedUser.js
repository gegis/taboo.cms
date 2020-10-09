const UsersService = require('modules/users/services/UsersService');

module.exports = async (ctx, next) => {
  const user = await UsersService.getCurrentUser(ctx);
  if (user && user.id && user.verified) {
    return next();
  }
  return ctx.throw(403, 'Not Verified');
};
