import { decorate, action, observable } from 'mobx';
import AbstractAdminStore from 'modules/core/client/stores/AbstractAdminStore';
import { settingsComponents } from 'app/modules/templates/client/tpl';

const {
  language = 'en',
  templates: {
    previewRoute = '/',
    defaultTemplate = 'standard',
    socketsEvents: { templatePreviewEmit = '' } = {},
  } = {},
} = window.app.config;

const newItem = {
  id: '',
  name: '',
  title: '',
  description: '',
  settings: {},
  languageSettings: {},
  layout: '',
  variables: '',
  default: false,
};

class TemplatesAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/templates',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/templates/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/templates',
        },
        update: {
          method: 'put',
          path: '/api/admin/templates/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/templates/:id',
        },
      },
    });
    this.item = Object.assign({}, newItem);
    this.settings = this.item.settings;
    this.languageSettings = this.item.languageSettings;
    this.settingsComponents = settingsComponents;
    this.previewPath = null;
    this.previewTemplate = null;
    this.language = language;
    this.templatePreviewEmit = templatePreviewEmit;
    this.templateOptions = [{ label: defaultTemplate, value: defaultTemplate }];
    this.setLanguage = this.setLanguage.bind(this);
    this.setPreviewPath = this.setPreviewPath.bind(this);
    this.unsetPreviewPath = this.unsetPreviewPath.bind(this);
    this.pointSettingsToItem = this.pointSettingsToItem.bind(this);
  }

  loadById(id) {
    return new Promise(resolve => {
      super.loadById(id).then(data => {
        this.pointSettingsToItem();
        resolve(data);
      });
    });
  }

  setLanguage(language, resetPath = false) {
    this.language = language;
    this.pointSettingsToItem();
    if (resetPath && this.item && this.item.name) {
      this.unsetPreviewPath();
      this.setPreviewPath(this.item.name);
    }
  }

  loadAll(options = {}) {
    return new Promise(resolve => {
      super.loadAll(options).then(templates => {
        this.setTemplateOptions(templates);
        resolve(templates);
      });
    });
  }

  setTemplateOptions(templates = []) {
    if (templates.length > 0) {
      this.templateOptions = [];
      templates.map(template => {
        this.templateOptions.push({ label: template.title, value: template.name });
      });
    }
  }

  setPreviewPath(templateName) {
    if (templateName) {
      this.previewPath = previewRoute.replace(':language?', this.language).replace(':template', templateName);
    } else {
      this.previewPath = null;
    }
  }

  unsetPreviewPath() {
    this.previewPath = null;
  }

  pointSettingsToItem() {
    if (this.item) {
      if (!this.item.settings) {
        this.item.settings = {};
      }
      if (!this.item.languageSettings) {
        this.item.languageSettings = {};
      }
      if (!this.item.languageSettings[this.language]) {
        this.item.languageSettings[this.language] = {};
      }
      this.settings = this.item.settings;
      this.languageSettings = this.item.languageSettings[this.language];
    }
  }

  onSettingsChange(key, value) {
    this.settings[key] = value;
  }

  onLanguageSettingsChange(key, value) {
    this.languageSettings[key] = value;
  }
}

decorate(TemplatesAdminStore, {
  language: observable,
  item: observable,
  settings: observable,
  languageSettings: observable,
  settingsComponents: observable,
  previewPath: observable,
  previewTemplate: observable,
  loadById: action,
  setLanguage: action,
  setPreviewPath: action,
  unsetPreviewPath: action,
  pointSettingsToItem: action,
  onSettingsChange: action,
  onLanguageSettingsChange: action,
});

export default new TemplatesAdminStore();
