const AuthService = require('modules/users/services/AuthService');

module.exports = async (ctx, next) => {
  let { session: { user = null } = {} } = ctx;
  const { header: { authorization } = {} } = ctx;
  let allowed;
  if (!user && authorization) {
    user = AuthService.parseUserFromHeader(ctx.header);
  }
  allowed = AuthService.isUserRequestAllowed(ctx, user);
  // if allowed value is undefined - it means acl is not enabled / implemented
  if (allowed === false) {
    return ctx.throw(403, 'Forbidden');
  }
  return next();
};
