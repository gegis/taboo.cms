const { config, app } = require('@taboo/cms-core');
const { i18n: { enabledLanguages = [] } = {} } = config;

module.exports = async (ctx, next) => {
  const { i18n } = config;
  const { locales } = app;
  if (ctx.session && ctx.session.locale) {
    ctx.taboo.locale = ctx.session.locale;
    ctx.taboo.language = ctx.session.language;
    if (locales[ctx.taboo.locale]) {
      ctx.taboo.translations = locales[ctx.taboo.locale];
    }
  } else if (ctx.params) {
    if (ctx.params.language && enabledLanguages.indexOf(ctx.params.language) !== -1) {
      ctx.taboo.language = ctx.params.language;
      if (i18n.defaultLocalesMapping[ctx.params.language]) {
        ctx.taboo.locale = i18n.defaultLocalesMapping[ctx.params.language];
      }
    }
    if (ctx.params.locale) {
      ctx.taboo.locale = ctx.params.locale;
    }
    if (locales[ctx.taboo.locale]) {
      ctx.taboo.translations = locales[ctx.taboo.locale];
    }
  }
  return next();
};
