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
    this.defaultTemplateName = defaultTemplate;
    this.template = {};
    this.settings = {};
    this.languageSettings = {};
  }

  setPreviewTemplate(template) {
    // TODO (layouts) think of how to set as preview and never override while in edit preview mode
    // TODO (layouts) one of the ways to replace this.templates[standard]!!!
    if (template && template.name) {
      this.templates[template.name] = template;
      this.setTemplate(template, true);
    }
  }

  setTemplate(template, force = false) {
    if (Object.keys(this.template).length === 0 || this.template.name !== template.name || force) {
      this.template = template;
      this.templateName = template.name;
      this.settings = template.settings;
      if (template.languageSettings && template.languageSettings[this.language]) {
        this.languageSettings = template.languageSettings[this.language];
      }
    }
  }

  loadTemplate(name, reload = false) {
    return new Promise(resolve => {
      if (this.templates[name] && !reload) {
        runInAction(() => {
          this.setTemplate(this.templates[name]);
          resolve(this.templates[name]);
        });
      } else {
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
      }
    });
  }

  loadDefaultTemplate(reload = false) {
    return new Promise(resolve => {
      if (this.defaultTemplateName && this.templates[this.defaultTemplateName] && !reload) {
        runInAction(() => {
          this.defaultTemplateName = this.templates[this.defaultTemplateName].name;
          resolve(this.templates[this.defaultTemplateName]);
        });
      } else {
        axios
          .get('/api/templates/default')
          .then(response => {
            runInAction(() => {
              const { data = {} } = response;
              if (data) {
                this.templates[data.name] = data;
                this.defaultTemplateName = data.name;
              }
              resolve(data);
            });
          })
          .catch(ResponseHelper.handleError);
      }
    });
  }

  setLanguage(language) {
    this.language = language;
  }
}

decorate(TemplatesStore, {
  templateComponents: observable,
  templates: observable,
  template: observable,
  defaultTemplateName: observable,
  templateName: observable,
  settings: observable,
  languageSettings: observable,
  language: observable,
  loadDefaultTemplate: action,
  loadTemplate: action,
  setTemplate: action,
  setLanguage: action,
  setPreviewTemplate: action,
});

export default new TemplatesStore();
