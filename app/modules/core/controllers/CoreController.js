const { config, app } = require('@taboo/cms-core');
const LanguageService = require('../services/LanguageService');

class CoreController {
  async dashboard() {}

  async setLanguage(ctx) {
    const { params: { language = null } = {} } = ctx;
    let data = {};
    if (language) {
      data = LanguageService.setLanguage(ctx, 'client', { language });
    }

    ctx.body = data;
  }

  async health(ctx) {
    const data = {
      status: 'success',
      environment: config.environment,
      version: config.version,
    };
    if (['production'].indexOf(config.environment) === -1) {
      data.routes = app.routes;
      data.modules = app.modules;
    }
    ctx.body = data;
  }

  async example(ctx) {
    ctx.flashMessages.push({
      message: 'Test Flash Message',
      type: 'error',
      sticky: true,
    });
  }
}

module.exports = new CoreController();
