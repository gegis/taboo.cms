const { config, app, Service } = require('@taboo/cms-core');

class CoreController {
  async dashboard() {}

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

  async getPublicSettings(ctx) {
    ctx.body = await Service('core.Settings').getPublic(ctx.params.key);
  }

  async getACLEnabled(ctx) {
    ctx.body = {
      enabled: Service('core.Settings').getACLEnabled(),
    };
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
