module.exports = async (ctx, next) => {
  if (ctx.session && ctx.session.user && ctx.session.user.id) {
    ctx.view.user = ctx.session.user;
  } else {
    ctx.view.user = {};
  }
  return next();
};
