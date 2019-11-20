module.exports = async (ctx, next) => {
  if (ctx.session && ctx.session.user && ctx.session.user.id && ctx.session.user.admin === true) {
    return next();
  }
  return ctx.throw(401, 'Not Authorized');
};
