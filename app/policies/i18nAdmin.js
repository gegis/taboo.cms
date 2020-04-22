const { config, app } = require('@taboo/cms-core');

module.exports = async (ctx, next) => {
  const { i18n: { admin: i18nAdmin = {} } = {} } = config;
  const { adminLocales } = app;
  if (ctx.session && ctx.session.adminLocale) {
    ctx.routeParams.adminLocale = ctx.session.adminLocale;
    ctx.routeParams.adminLanguage = ctx.session.adminLanguage;
    if (adminLocales[ctx.routeParams.locale]) {
      ctx.routeParams.adminTranslations = adminLocales[ctx.routeParams.locale];
    }
  } else if (ctx.params) {
    if (ctx.params.adminLanguage) {
      ctx.routeParams.adminLanguage = ctx.params.adminLanguage;
      if (i18nAdmin.defaultLocalesMapping[ctx.params.adminLanguage]) {
        ctx.routeParams.adminLocale = i18nAdmin.defaultLocalesMapping[ctx.params.adminLanguage];
      }
    }
    if (ctx.params.adminLocale) {
      ctx.routeParams.adminLocale = ctx.params.adminLocale;
    }
    if (adminLocales[ctx.routeParams.adminLocale]) {
      ctx.routeParams.adminTranslations = adminLocales[ctx.routeParams.adminLocale];
    }
  }
  ctx.routeParams.clientConfig.language = ctx.routeParams.adminLanguage;
  ctx.routeParams.clientConfig.locale = ctx.routeParams.adminLocale;
  ctx.routeParams.clientConfig.translations = ctx.routeParams.adminTranslations;
  return next();
};
