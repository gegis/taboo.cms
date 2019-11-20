module.exports = async (ctx, next) => {
  if (ctx.session && ctx.session.user && ctx.session.user.id) {
    return next();
  }
  return ctx.throw(401, 'Not Authorized');
};
