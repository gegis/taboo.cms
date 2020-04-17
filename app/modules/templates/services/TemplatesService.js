const path = require('path');
const { filesHelper, config } = require('@taboo/cms-core');
const { templates: { tplPath } = {} } = config;
const CacheService = require('modules/cache/services/CacheService');
const TemplateModel = require('modules/templates/models/TemplateModel');

class TemplatesService {
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
      const config = this.getTemplateConfig(name);
      templates.push({
        preview: this.getTemplatePeviewPath(name),
        name,
        title: config.title,
        description: config.description,
        settings: config.settings,
        languageSettings: config.languageSettings,
        default: config.default,
      });
    });

    return templates;
  }

  getTemplatePeviewPath(name) {
    return `/admin/templates/image-preview/${name}`;
  }

  getTemplateConfig(name) {
    return require(path.resolve(tplPath, name, 'config.js'));
  }

  getAllFsTemplatesNames() {
    const tplsPath = path.resolve(tplPath);
    return filesHelper.getAllDirNames(tplsPath);
  }
}

module.exports = new TemplatesService();
