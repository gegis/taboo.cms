const { config, Service, isAllowed } = require('@taboo/cms-core');
const AbstractAdminController = require('../../core/controllers/AbstractAdminController');
const {
  api: { settings: { defaultSort = { createdAt: 'desc' } } = {} },
} = config;

class SettingsAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: 'settings.Settings',
      searchFields: ['_id', 'name'],
      populate: {},
      defaultSort,
    });
  }

  async getSettings(ctx) {
    const allowed = isAllowed(ctx, `admin.settings.${ctx.params.key}.view`);
    if (allowed === false) {
      return ctx.throw(403, 'Forbidden');
    } else {
      ctx.body = await Service('settings.Settings').get(ctx.params.key);
    }
  }

  async setSettings(ctx) {
    const allowed = isAllowed(ctx, `admin.settings.${ctx.params.key}.manage`);
    if (allowed === false) {
      return ctx.throw(403, 'Forbidden');
    } else {
      ctx.body = await Service('settings.Settings').set(ctx.params.key, ctx.request.body);
    }
  }
}

module.exports = new SettingsAdminController();
