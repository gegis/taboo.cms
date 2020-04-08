const SettingsService = require('modules/settings/services/SettingsService');

class SettingsController {
  async getSettings(ctx) {
    const item = await SettingsService.getPublic(ctx.params.key);
    if (!item) {
      ctx.throw(404);
    }
    ctx.body = item;
  }

  async getACLEnabled(ctx) {
    ctx.body = {
      enabled: SettingsService.getACLEnabled(),
    };
  }
}

module.exports = new SettingsController();
