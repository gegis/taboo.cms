const { config, app } = require('@taboo/cms-core');
const { locales } = app;
const { defaultLanguage, defaultLocalesMapping } = config.i18n;

class LanguageService {
  setLanguage(ctx, language = defaultLanguage, locale = null, saveInSession = false) {
    if (language) {
      ctx.routeParams.language = language;
      if (defaultLocalesMapping[language]) {
        ctx.routeParams.locale = defaultLocalesMapping[language];
      }
    }
    if (locale) {
      ctx.routeParams.locale = locale;
      for (let lang in defaultLocalesMapping) {
        if (defaultLocalesMapping[lang] === locale) {
          ctx.routeParams.language = lang;
        }
      }
    }
    if (locales[ctx.routeParams.locale]) {
      ctx.routeParams.translations = locales[ctx.routeParams.locale];
    }
    if (saveInSession && ctx.session) {
      ctx.session.locale = ctx.routeParams.locale;
      ctx.session.language = ctx.routeParams.language;
    }

    return {
      language: ctx.routeParams.language,
      locale: ctx.routeParams.locale,
      translations: ctx.routeParams.translations,
    };
  }
}
module.exports = new LanguageService();
