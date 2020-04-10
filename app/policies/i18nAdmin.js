const { config, app } = require('@taboo/cms-core');

module.exports = async (ctx, next) => {
  const { i18n: { admin: i18nAdmin = {} } = {} } = config;
  const { adminLocales } = app;
  if (ctx.session && ctx.session.adminLocale) {
    ctx.taboo.adminLocale = ctx.session.adminLocale;
    ctx.taboo.adminLanguage = ctx.session.adminLanguage;
    if (adminLocales[ctx.taboo.locale]) {
      ctx.taboo.adminTranslations = adminLocales[ctx.taboo.locale];
    }
  } else if (ctx.params) {
    if (ctx.params.adminLanguage) {
      ctx.taboo.adminLanguage = ctx.params.adminLanguage;
      if (i18nAdmin.defaultLocalesMapping[ctx.params.adminLanguage]) {
        ctx.taboo.adminLocale = i18nAdmin.defaultLocalesMapping[ctx.params.adminLanguage];
      }
    }
    if (ctx.params.adminLocale) {
      ctx.taboo.adminLocale = ctx.params.adminLocale;
    }
    if (adminLocales[ctx.taboo.adminLocale]) {
      ctx.taboo.adminTranslations = adminLocales[ctx.taboo.adminLocale];
    }
  }
  ctx.taboo.clientConfig.language = ctx.taboo.adminLanguage;
  ctx.taboo.clientConfig.locale = ctx.taboo.adminLocale;
  ctx.taboo.clientConfig.translations = ctx.taboo.adminTranslations;
  return next();
};
