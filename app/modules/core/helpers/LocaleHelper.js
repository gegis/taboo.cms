const { logger, config } = require('@taboo/cms-core');

class LocaleHelper {
  translate(ctx, message, variables) {
    const translations = ctx.taboo && ctx.taboo.translations ? ctx.taboo.translations : {};
    return this.translateMessage(message, translations, variables);
  }

  translateMessage(message, translations = {}, variables = null) {
    const { environment = '' } = config;
    let sRegExInput;
    let translation = message;
    if (message && translations && translations[message]) {
      translation = translations[message];
    } else if (environment !== 'production') {
      logger.warn(`Missing translation '${translation}'`);
    }
    if (variables) {
      for (let key in variables) {
        sRegExInput = new RegExp(`{${key}}`, 'g');
        translation = translation.replace(sRegExInput, variables[key]);
      }
    }
    return translation;
  }
}
module.exports = new LocaleHelper();
