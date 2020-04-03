const { Service } = require('@taboo/cms-core');

class SettingsController {
  async getSettings(ctx) {
    ctx.body = await Service('settings.Settings').getPublic(ctx.params.key);
  }

  async getACLEnabled(ctx) {
    ctx.body = {
      enabled: Service('settings.Settings').getACLEnabled(),
    };
  }
}

module.exports = new SettingsController();
