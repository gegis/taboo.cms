const LanguageService = require('modules/core/services/LanguageService');

module.exports = async (ctx, next) => {
  const { routeParams: { moduleRoute: { path: routePath = '' } = {} } = {} } = ctx;
  let language = null;
  let locale = null;
  let namespace = 'client';
  if (routePath.indexOf('/admin') !== -1) {
    namespace = 'admin';
  }
  if (ctx.params && (ctx.params.language || ctx.params.locale)) {
    language = ctx.params.language;
    locale = ctx.params.locale;
  } else {
    if (namespace === 'client' && ctx.session && ctx.session.locale) {
      locale = ctx.session.locale;
    } else if (namespace === 'admin' && ctx.session && ctx.session.adminLocale) {
      locale = ctx.session.adminLocale;
    }
  }
  LanguageService.setLanguage(ctx, namespace, { locale, language });
  return next();
};
