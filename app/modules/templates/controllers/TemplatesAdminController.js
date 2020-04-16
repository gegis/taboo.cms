const { config } = require('@taboo/cms-core');
const TemplateModel = require('modules/templates/models/TemplateModel');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const { api: { templates: { defaultSort = { name: 'asc' } } = {} } = {} } = config;

class TemplatesAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: TemplateModel,
      searchFields: ['_id', 'name', 'title', 'description'],
      populate: {},
      defaultSort,
    });
  }
}

module.exports = new TemplatesAdminController();
