const { isAllowed } = require('@taboo/cms-core');

module.exports = async (ctx, next) => {
  if (ctx.taboo.aclResource) {
    // if return value is undefined - it means acl is not enabled / implemented
    if (isAllowed(ctx, ctx.taboo.aclResource) === false) {
      return ctx.throw(403, 'Forbidden');
    }
  }
  return next();
};
