import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import defaultTranslations from 'app/locales/en-gb';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';

const defaultLanguage = 'en';
const defaultLocale = 'en-gb';
const defaultLocaleMapping = {
  en: 'en-gb',
  it: 'it-it',
};
const language = window.app.config.language || defaultLanguage;
const locale = window.app.config.locale || defaultLocale;
const translations = window.app.config.translations || defaultTranslations;

class LocaleStore {
  constructor() {
    this.messageKeyStart = '{';
    this.messageKeyEnd = '}';
    this.language = language;
    this.locale = locale;
    this.translations = translations;
  }

  setLanguage(language, admin = false) {
    const url = admin ? `/api/admin/language/${language}` : `/api/language/${language}`;
    axios
      .put(url)
      .then(response => {
        runInAction(() => {
          const { locale, translations, language } = response.data;
          if (language && locale && translations) {
            this.language = language;
            this.locale = locale;
            this.translations = translations;
          }
        });
      })
      .catch(ResponseHelper.handleError);
  }

  setTranslations(options) {
    let { locale, language, translations } = options;
    if (!locale && language) {
      locale = defaultLocaleMapping[language];
    }
    if (locale && translations) {
      this.locale = locale;
      this.translations = translations;
    }
  }

  replaceWithValues(message, values) {
    let sRegExInput;
    if (values) {
      for (let key in values) {
        sRegExInput = new RegExp(`${this.messageKeyStart}${key}${this.messageKeyEnd}`, 'g');
        message = message.replace(sRegExInput, values[key]);
      }
    }
    return message;
  }

  getTranslation(message, values) {
    if (this.translations && this.translations[message]) {
      return this.replaceWithValues(this.translations[message], values);
    } else if (window.app.config.env === 'debug') {
      console.error(`Translation for "${message}" was not found.`); // eslint-disable-line no-console
    }
    return this.replaceWithValues(message, values);
  }
}

decorate(LocaleStore, {
  language: observable,
  locale: observable,
  translations: observable,
  setLanguage: action,
  setTranslations: action,
});

export default LocaleStore;
