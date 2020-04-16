const TemplateModel = require('modules/templates/models/TemplateModel');

class TemplatesService {
  async getAllEnabled() {
    return TemplateModel.find({ enabled: true });
  }
}

module.exports = new TemplatesService();
