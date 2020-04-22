const { config, app } = require('@taboo/cms-core');
const { i18n: { enabledLanguages = [] } = {} } = config;

module.exports = async (ctx, next) => {
  const { i18n } = config;
  const { locales } = app;
  if (ctx.session && ctx.session.locale) {
    ctx.routeParams.locale = ctx.session.locale;
    ctx.routeParams.language = ctx.session.language;
    if (locales[ctx.routeParams.locale]) {
      ctx.routeParams.translations = locales[ctx.routeParams.locale];
    }
  } else if (ctx.params) {
    if (ctx.params.language && enabledLanguages.indexOf(ctx.params.language) !== -1) {
      ctx.routeParams.language = ctx.params.language;
      if (i18n.defaultLocalesMapping[ctx.params.language]) {
        ctx.routeParams.locale = i18n.defaultLocalesMapping[ctx.params.language];
      }
    }
    if (ctx.params.locale) {
      ctx.routeParams.locale = ctx.params.locale;
    }
    if (locales[ctx.routeParams.locale]) {
      ctx.routeParams.translations = locales[ctx.routeParams.locale];
    }
  }
  return next();
};
