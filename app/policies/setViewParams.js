const UsersService = require('modules/users/services/UsersService');

module.exports = async (ctx, next) => {
  const user = await UsersService.getCurrentUser(ctx);
  if (user) {
    ctx.viewParams.user = user;
  } else {
    ctx.viewParams.user = {};
  }
  return next();
};
