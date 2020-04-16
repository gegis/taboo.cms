import { decorate, action, observable, runInAction } from 'mobx';
import AbstractAdminStore from 'modules/core/client/stores/AbstractAdminStore';
import { settings as settingsComponents } from 'app/modules/templates/client/tpl';

const defaultLanguage = 'en';
const language = window.app.config.language || defaultLanguage;
const previewRoute = '/:language/templates/preview/:template'; // TODO move to config
const newItem = {
  id: '',
  name: '',
  title: '',
  description: '',
  settings: {},
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
    this.settingsComponents = settingsComponents;
    this.previewPath = null;
    this.previewTemplate = null;
    this.language = language;
    this.setLanguage = this.setLanguage.bind(this);
    this.setPreviewPath = this.setPreviewPath.bind(this);
    this.unsetPreviewPath = this.unsetPreviewPath.bind(this);
    this.setItemSettings = this.setItemSettings.bind(this);
    this.getItemSettingsData = this.getItemSettingsData.bind(this);
  }

  loadById(id) {
    return new Promise(resolve => {
      super.loadById(id).then(data => {
        runInAction(() => {
          this.settings = this.item.settings;
        });
        resolve(data);
      });
    });
  }

  setLanguage(language, resetPath = false) {
    this.language = language;
    if (resetPath && this.item && this.item.name) {
      this.unsetPreviewPath();
      this.setPreviewPath(this.item.name);
    }
  }

  setPreviewPath(templateName) {
    if (templateName) {
      this.previewPath = previewRoute.replace(':template', templateName).replace(':language', this.language);
    } else {
      this.previewPath = null;
    }
  }

  unsetPreviewPath() {
    this.previewPath = null;
  }

  setItemSettings(settings) {
    // if (this.item) {
    this.settings = Object.assign(this.settings, settings);
    // }
  }

  getItemSettingsData() {
    const data = {};
    // if (this.item) {
    Object.keys(this.settings).map(key => {
      data[key] = this.settings[key];
    });
    // }
    return data;
  }
}

decorate(TemplatesAdminStore, {
  language: observable,
  item: observable,
  settings: observable,
  settingsComponents: observable,
  previewPath: observable,
  previewTemplate: observable,
  setLanguage: action,
  setPreviewPath: action,
  unsetPreviewPath: action,
  setItemSettings: action,
  getItemSettingsData: action,
});

export default new TemplatesAdminStore();
