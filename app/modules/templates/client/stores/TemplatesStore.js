import { decorate, runInAction, observable, action } from 'mobx';
import axios from 'axios';
import { templates } from 'app/modules/templates/client/tpl';
import ResponseHelper from 'modules/core/client/helpers/ResponseHelper';

const { language = 'en', defaultTemplate = 'standard' } = window.app.config;

class TemplatesStore {
  constructor() {
    this.language = language;
    this.templateComponents = templates;
    this.templates = [];
    this.templateName = defaultTemplate;
    this.template = {};
    this.settings = {};
    this.languageSettings = {};
  }

  setTemplate(template) {
    this.template = template;
    this.templateName = template.name;
    this.settings = template.settings;
    if (template.languageSettings && template.languageSettings[this.language]) {
      this.languageSettings = template.languageSettings[this.language];
    }
  }

  loadTemplate(name) {
    return new Promise(resolve => {
      axios
        .get('/api/templates/:name'.replace(':name', name))
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            if (data) {
              this.templates[data.name] = data;
              this.setTemplate(data);
            }
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  setLanguage(language) {
    this.language = language;
    // this.pointSettingsToItem();
  }

  // getSettings(key) {
  //   const {settings = null} = this.template;
  //   if (settings && this.template[key]) {
  //     return this.templates[this.templateName][key];
  //   }
  //   return null;
  // }
  //
  // getLanguageSettings(key) {
  //   if (this.template && this.template[this.language] && this.template[this.language][key]) {
  //     return this.template[this.language][key];
  //   }
  //   return null;
  // }
}

decorate(TemplatesStore, {
  templateComponents: observable,
  templates: observable,
  template: observable,
  templateName: observable,
  settings: observable,
  languageSettings: observable,
  language: observable,
  setTemplate: action,
  setLanguage: action,
});

export default new TemplatesStore();
