const { config } = require('@taboo/cms-core');
const LanguageService = require('modules/core/services/LanguageService');
const {
  api: { routePrefix = '/api' } = {},
  uploads: { urlPath = '/user-files', secureUrlPath = '/secure-files' } = {},
} = config;

module.exports = async (ctx, next) => {
  const { routeParams: { moduleRoute: { path: routePath = '' } = {} } = {} } = ctx;
  let language = null;
  let locale = null;
  let namespace = 'client';
  // Set Language and Translations only for non api routes
  if (
    routePath &&
    routePath.indexOf(routePrefix) !== 0 &&
    routePath.indexOf(urlPath) !== 0 &&
    routePath.indexOf(secureUrlPath) !== 0
  ) {
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
  }

  return next();
};
