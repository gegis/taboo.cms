const { config } = require('@taboo/cms-core');
const LanguageService = require('modules/core/services/LanguageService');
const { uploads: { urlPath: userFilesPath = '/files', secureUrlPath: secureFilesPath = '/user-files' } = {} } = config;

module.exports = async (ctx, next) => {
  const { routeParams: { moduleRoute: { path: routePath = '' } = {} } = {} } = ctx;
  let language = null;
  let locale = null;
  let namespace = 'client';

  if (routePath && routePath.indexOf(userFilesPath) !== 0 && routePath.indexOf(secureFilesPath) !== 0) {
    if (routePath.indexOf('/admin') !== -1) {
      namespace = 'admin';
    }
    if (ctx.params && (ctx.params.language || ctx.params.locale)) {
      if (ctx.params.language && LanguageService.languageIsValid(ctx.params.language)) {
        language = ctx.params.language;
      }
      if (ctx.params.locale && LanguageService.localeIsValid(ctx.params.locale)) {
        locale = ctx.params.locale;
      }
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
