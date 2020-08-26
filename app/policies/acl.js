const AuthService = require('modules/users/services/AuthService');

module.exports = async (ctx, next) => {
  const { session: { user } = {} } = ctx;
  const allowed = AuthService.isUserRequestAllowed(ctx, user);
  // if return value is undefined - it means acl is not enabled / implemented
  if (allowed === false) {
    return ctx.throw(403, 'Forbidden');
  }
  return next();
};
