const AuthService = require('modules/users/services/AuthService');

module.exports = async (ctx, next) => {
  const { session: { user: { id = null } = {} } = {} } = ctx;
  const { header: { authorization } = {} } = ctx;
  let user;

  if (id) {
    return next();
  } else if (authorization) {
    user = AuthService.parseUserFromHeader(ctx.header);
    if (user && user.id) {
      return next();
    }
  }
  return ctx.throw(401, 'Not Authorized');
};
