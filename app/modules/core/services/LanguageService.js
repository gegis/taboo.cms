const { setLanguage, config } = require('@taboo/cms-core');
const { i18n: { enabledLanguages = [], defaultLocalesMapping = {} } = {} } = config;

class LanguageService {
  setLanguage(ctx, namespace, { language = null, locale = null, saveInSession = false }) {
    // TODO load custom translations from db
    // setLanguage(ctx, namespace, { locale, language, customTranslations: {} });
    setLanguage(ctx, namespace, { locale, language });

    if (saveInSession && ctx.session) {
      if (namespace === 'client') {
        ctx.session.locale = ctx.routeParams.locale;
        ctx.session.language = ctx.routeParams.language;
      } else if (namespace === 'admin') {
        ctx.session.adminLocale = ctx.routeParams.locale;
        ctx.session.adminLanguage = ctx.routeParams.language;
      }
    }

    return {
      language: ctx.routeParams.language,
      locale: ctx.routeParams.locale,
      translations: ctx.routeParams.translations,
    };
  }

  languageIsValid(language) {
    return language && enabledLanguages.indexOf(language) !== -1;
  }

  localeIsValid(locale) {
    return locale && Object.values(defaultLocalesMapping).indexOf(locale) !== -1;
  }
}
module.exports = new LanguageService();
