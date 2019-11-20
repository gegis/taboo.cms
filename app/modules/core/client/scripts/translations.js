window.app.Translations = {
  get(key, variables) {
    const { config: { translations = {} } = {} } = window.app;
    let translation = key;
    let sRegExInput;
    if (Object.prototype.hasOwnProperty.call(translations, key)) {
      translation = translations[key];
      if (variables) {
        for (let key in variables) {
          sRegExInput = new RegExp(`{${key}}`, 'g');
          translation = translation.replace(sRegExInput, variables[key]);
        }
      }
      return translation;
    } else {
      console.error(`Missing translation: ${translation}`); // eslint-disable-line no-console
      return translation;
    }
  },
};
