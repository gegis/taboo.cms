const path = require('path');
const { filesHelper, config, sockets, events } = require('@taboo/cms-core');
const { templates: { themesPath } = {} } = config;
const CacheService = require('modules/cache/services/CacheService');
const TemplateModel = require('modules/templates/models/TemplateModel');

const { templates: { socketsEvents: { templatePreviewEmit = '', templatePreviewReceive = '' } = {} } = {} } = config;

class TemplatesService {
  constructor() {
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

  async getAllEnabled() {
    return TemplateModel.find({ enabled: true });
  }

  async getByName(name) {
    let template = CacheService.get('template', `${name}`);
    if (!template) {
      template = await TemplateModel.findOne({ name: name });
      if (template) {
        CacheService.set('template', `${name}`, template);
      }
    }
    return template;
  }

  async getDefault() {
    let template = CacheService.get('template', 'default');
    if (!template) {
      template = await TemplateModel.findOne({ default: true });
      if (template) {
        CacheService.set('template', 'default', template);
      }
    }
    return template;
  }

  async getFsTemplates() {
    const templates = [];
    const tplNames = this.getAllFsTemplatesNames();
    tplNames.map(name => {
      templates.push(this.getFsTemplate(name));
    });
    return templates;
  }

  getFsTemplate(name) {
    let template = null;
    if (name) {
      const config = this.getTemplateConfig(name);
      template = {
        preview: this.getTemplatePeviewPath(name),
        name,
        title: config.title,
        description: config.description,
        settings: config.settings,
        languageSettings: config.languageSettings,
        default: config.default,
        style: config.style,
        styleTemplate: config.styleTemplate,
      };
    }
    return template;
  }

  getTemplatePeviewPath(name) {
    return `/admin/templates/image-preview/${name}`;
  }

  getTemplateConfig(name) {
    return require(path.resolve(themesPath, name, 'config.js'));
  }

  getAllFsTemplatesNames() {
    const tplsPath = path.resolve(themesPath);
    return filesHelper.getAllDirNames(tplsPath);
  }
}

module.exports = new TemplatesService();
