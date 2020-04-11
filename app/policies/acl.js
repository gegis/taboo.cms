const UserService = require('modules/users/services/UsersService');

module.exports = async (ctx, next) => {
  const { session: { user } = {} } = ctx;
  const allowed = UserService.isUserRequestAllowed(ctx, user);
  // if return value is undefined - it means acl is not enabled / implemented
  if (allowed === false) {
    return ctx.throw(403, 'Forbidden');
  }
  return next();
};
