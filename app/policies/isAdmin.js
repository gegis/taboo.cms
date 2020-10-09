const UsersService = require('modules/users/services/UsersService');

module.exports = async (ctx, next) => {
  const user = await UsersService.getCurrentUser(ctx);
  if (user && user.id && user.admin === true) {
    return next();
  }
  return ctx.throw(401, 'Not Authorized');
};
