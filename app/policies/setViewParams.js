module.exports = async (ctx, next) => {
  if (ctx.session && ctx.session.user && ctx.session.user.id) {
    ctx.viewParams.user = ctx.session.user;
  } else {
    ctx.viewParams.user = {};
  }
  return next();
};
