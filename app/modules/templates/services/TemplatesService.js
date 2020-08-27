const path = require('path');
const { filesHelper, config, sockets, events } = require('@taboo/cms-core');
const { templates: { themesPath } = {} } = config;
const NavigationService = require('modules/navigation/services/NavigationService');
const CacheService = require('modules/cache/services/CacheService');
const TemplateModel = require('modules/templates/models/TemplateModel');
const StringHelper = require('modules/core/ui/helpers/StringHelper');

const { templates: { socketsEvents: { templatePreviewEmit = '', templatePreviewReceive = '' } = {} } = {} } = config;

class TemplatesService {
  constructor() {
    this.cacheId = 'templates';
    this.afterModulesSetup = this.afterModulesSetup.bind(this);
    this.beforeTemplateRender = this.beforeTemplateRender.bind(this);
    this.getNavigationByKeys = this.getNavigationByKeys.bind(this);
    this.getByName = this.getByName.bind(this);
    this.getDefault = this.getDefault.bind(this);
    this.getFsTemplates = this.getFsTemplates.bind(this);
    this.getFsTemplate = this.getFsTemplate.bind(this);
    this.getProfilePicture = this.getProfilePicture.bind(this);
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
      footerCopyright: '',
      templatesHelper: {
        getNavigationHtml: this.getNavigationHtml,
        pluralize: this.pluralize,
        firstUpper: StringHelper.firstUpper,
        firstLower: StringHelper.firstLower,
        getProfilePicture: this.getProfilePicture,
      },
    };
    let template = null;
    if (_template && language) {
      template = await this.getByName(_template);
      templateLanguageSettings = await this.getTemplateLanguageSettings(template, language);
    }
    if (template && template.style) {
      newParams.themeStyle = template.style;
    }
    if (template && templateLanguageSettings) {
      const { navigationPreload = [], userNavigationPreload = [] } = template;
      Object.assign(newParams, await this.getNavigationByKeys(navigationPreload, templateLanguageSettings));
      if (userId) {
        Object.assign(newParams, await this.getNavigationByKeys(userNavigationPreload, templateLanguageSettings));
      }
      if (templateLanguageSettings.footerCopyright) {
        newParams.footerCopyright = templateLanguageSettings.footerCopyright;
      }
    }

    return newParams;
  }

  pluralize(count, singular, plural) {
    if (count === 1) {
      return singular;
    } else {
      return plural;
    }
  }

  getProfilePicture(user, { className = '', size = '', alternative = false } = {}) {
    let notFoundImageUrl = '/images/_shared/profile-picture.png';
    let imageUrl = this.getProfilePictureUrl(user);
    let wrapperClassName = 'profile-picture';

    if (alternative) {
      notFoundImageUrl = '/images/_shared/profile-picture-alt.png';
    }

    if (className) {
      wrapperClassName += ` ${className}`;
    }

    if (!imageUrl) {
      imageUrl = notFoundImageUrl;
    }

    if (size) {
      imageUrl += `?size=${size}`;
      wrapperClassName += ` ${size}`;
    }

    return `
<span class="${wrapperClassName}">
  <img src="${imageUrl}" alt="${user.username}" />
</span>`;
  }

  getProfilePictureUrl(user) {
    if (user && user.profilePicture && user.profilePicture.url) {
      return user.profilePicture.url;
    }
    return null;
  }

  getNavigationHtml(navigationItems, level = 0, nav = '<ul>') {
    let item;
    for (let i = 0; i < navigationItems.length; i++) {
      item = navigationItems[i];
      if (item.enabled) {
        if (item.children && item.children.length > 0) {
          nav += `<li><a>${item.title}</a>${this.getNavigationHtml(item.children, level + 1)}</li>`;
        } else {
          nav += `<li><a href="${item.url}">${item.title}</a></li>`;
        }
      }
    }
    return `${nav}</ul>`;
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
