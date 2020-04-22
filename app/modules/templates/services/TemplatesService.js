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

  async beforeTemplateRender(ctx, tpl, params) {
    const { session: { user: { id: userId } = {} } = {}, viewParams: { _template } = {} } = ctx;
    // TODO implement navigation!!!! for tpls
    console.log('~~~~~~~~~~get for template~~~~~~~~~~~~~');
    console.log(_template);
    if (userId) {
      // TODO get authenticated
      params.headerNavigation = [];
      params.footerNavigation = [];
    } else {
      // TODO get not auth
      params.headerNavigation = [];
      params.footerNavigation = [];
    }
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
      const template = this.getFsTemplate(name);
      if (template) {
        templates.push(template);
      }
    });
    return templates;
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
}

module.exports = new TemplatesService();
