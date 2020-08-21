const shared = require('./shared');

module.exports = {
  enabledLanguages: ['en'],
  // enabledLanguages: ['en', 'it'],
  languages: shared.languages,
  defaultLanguage: 'en',
  defaultLocale: 'en-gb',
  defaultLocalesMapping: {
    en: 'en-gb',
    // it: 'it-it',
  },
  admin: {
    defaultLanguage: 'en',
    defaultLocale: 'en-gb',
    defaultLocalesMapping: {
      en: 'en-gb',
      // it: 'it-it',
    },
  },
};
