const { config, app } = require('@taboo/cms-core');
const { locales } = app;
const { defaultLanguage, defaultLocalesMapping } = config.i18n;

class LanguageService {
  setLanguage(ctx, language = defaultLanguage, locale = null, saveInSession = false) {
    if (language) {
      ctx.taboo.language = language;
      if (defaultLocalesMapping[language]) {
        ctx.taboo.locale = defaultLocalesMapping[language];
      }
    }
    if (locale) {
      ctx.taboo.locale = locale;
      for (let lang in defaultLocalesMapping) {
        if (defaultLocalesMapping[lang] === locale) {
          ctx.taboo.language = lang;
        }
      }
    }
    if (locales[ctx.taboo.locale]) {
      ctx.taboo.translations = locales[ctx.taboo.locale];
    }
    if (saveInSession && ctx.session) {
      ctx.session.locale = ctx.taboo.locale;
      ctx.session.language = ctx.taboo.language;
    }
  }
}
module.exports = new LanguageService();
