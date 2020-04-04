const { Service } = require('@taboo/cms-core');

class SettingsController {
  async getSettings(ctx) {
    const item = await Service('settings.Settings').getPublic(ctx.params.key);
    if (!item) {
      ctx.throw(404);
    }
    ctx.body = item;
  }

  async getACLEnabled(ctx) {
    ctx.body = {
      enabled: Service('settings.Settings').getACLEnabled(),
    };
  }
}

module.exports = new SettingsController();
