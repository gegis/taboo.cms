const path = require('path');
const { filesHelper, config, sockets, events } = require('@taboo/cms-core');
const { templates: { themesPath } = {} } = config;
const NavigationService = require('modules/navigation/services/NavigationService');
const CacheService = require('modules/cache/services/CacheService');
const TemplateModel = require('modules/templates/models/TemplateModel');

const { templates: { socketsEvents: { templatePreviewEmit = '', templatePreviewReceive = '' } = {} } = {} } = config;

class TemplatesService {
  constructor() {
    this.cacheId = 'templates';
    this.afterModulesSetup = this.afterModulesSetup.bind(this);
  }

  async afterModulesSetup() {
    events.on('socket-client-join', data => {
      if (data.room === 'admin') {
        data.socket.on(templatePreviewEmit, data => {
          if (data.user && data.template) {
            sockets.emit('admin', templatePreviewReceive.replace('{userId}', data.user.id), data.template);
          }
        });
      }
    });
  }

  async beforeTemplateRender(ctx) {
    const {
      session: { user: { id: userId } = {} } = {},
      viewParams: { _template } = {},
      routeParams: { language } = {},
    } = ctx;
    let templateLanguageSettings = null;
    let newParams = {
      themeStyle: '',
    };
    let template = null;
    if (_template && language) {
      template = await this.getByName(_template);
      templateLanguageSettings = await this.getTemplateLanguageSettings(template, language);
    }
    if (template && templateLanguageSettings) {
      const { navigationPreload = [], userNavigationPreload = [] } = template;
      Object.assign(newParams, await this.getNavigationByKeys(navigationPreload, templateLanguageSettings));
      if (userId) {
        Object.assign(newParams, await this.getNavigationByKeys(userNavigationPreload, templateLanguageSettings));
      }
      if (template.style) {
        newParams.themeStyle = template.style;
      }
    }

    return newParams;
  }

  async getNavigationByKeys(navigationKeys = [], navigationNames) {
    const navigation = {};
    for (let i = 0; i < [...navigationKeys].length; i++) {
      navigation[navigationKeys[i]] = await NavigationService.getEnabledByName(navigationNames[navigationKeys[i]]);
    }
    return navigation;
  }

  async getTemplateLanguageSettings(template, language) {
    if (template && language && template.languageSettings && template.languageSettings[language]) {
      return template.languageSettings[language];
    }
    return {};
  }

  async getAllEnabled() {
    return await TemplateModel.find({ enabled: true });
  }

  async getByName(name) {
    const cacheKey = name;
    let template = CacheService.get(this.cacheId, cacheKey);
    if (!template) {
      template = await TemplateModel.findOne({ name: name });
      if (template) {
        CacheService.set(this.cacheId, cacheKey, template);
      }
    }
    return template;
  }

  async getDefault() {
    const cacheKey = 'default';
    let template = CacheService.get(this.cacheId, cacheKey);
    if (!template) {
      template = await TemplateModel.findOne({ default: true });
      if (template) {
        CacheService.set(this.cacheId, cacheKey, template);
      }
    }
    return template;
  }

  async initDbTemplates() {
    const fsItems = await this.getFsTemplates();
    for (let i = 0; i < fsItems.length; i++) {
      await this.createDbTemplate(fsItems[i]);
    }
  }

  async removeDbTemplates() {
    const fsItems = await this.getFsTemplates();
    for (let i = 0; i < fsItems.length; i++) {
      await TemplateModel.deleteOne({ name: fsItems[i].name });
    }
  }

  async createDbTemplate(fsItem) {
    let item = Object.assign({}, fsItem);
    item.style = this.generateTemplateStyle(item, item.styleTemplate);
    return TemplateModel.create(item);
  }

  generateTemplateStyle(item, styleTemplate) {
    let style, sRegExInput;
    if (item && styleTemplate) {
      style = item.styleTemplate.toString();
      for (let key in item.settings) {
        sRegExInput = new RegExp(`{{${key}}}`, 'g');
        style = style.replace(sRegExInput, item.settings[key]);
      }
    }
    return style;
  }

  async getFsTemplates() {
    const templates = [];
    const tplNames = this.getAllFsTemplatesNames();
    tplNames.map(name => {
      const template = this.getFsTemplate(name);
      if (template) {
        templates.push(template);
      }
    });
    return templates;
  }

  getFsTemplateConfig(name) {
    let config = {};
    let configPath = this.getTemplateConfigPath(name);
    if (filesHelper.fileExists(configPath)) {
      config = require(configPath);
    }
    return config;
  }

  getFsTemplate(name) {
    let template = null;
    if (name) {
      let configPath = this.getTemplateConfigPath(name);
      if (filesHelper.fileExists(configPath)) {
        const config = require(configPath);
        template = {
          preview: this.getTemplatePreviewPath(name),
          name,
          title: config.title,
          description: config.description,
          settings: config.settings,
          languageSettings: config.languageSettings,
          default: config.default,
          style: config.style,
          styleTemplate: config.styleTemplate,
          navigationPreload: config.navigationPreload,
          userNavigationPreload: config.userNavigationPreload,
        };
      }
    }
    return template;
  }

  getTemplatePreviewPath(name) {
    return `/admin/templates/image-preview/${name}`;
  }

  getTemplateConfigPath(name) {
    return path.resolve(themesPath, name, 'config.js');
  }

  getAllFsTemplatesNames() {
    const tplsPath = path.resolve(themesPath);
    return filesHelper.getAllDirNames(tplsPath);
  }

  deleteTemplatesCache() {
    CacheService.clearCacheId(this.cacheId);
  }
}

module.exports = new TemplatesService();
