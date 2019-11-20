module.exports = async (ctx, next) => {
  if (ctx.session && ctx.session.user && ctx.session.user.id && ctx.session.user.verified) {
    return next();
  }
  return ctx.throw(403, 'Not Verified');
};
