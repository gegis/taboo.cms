const { config, Service, isAllowed } = require('@taboo/cms-core');

class CoreAdminController {
  constructor() {
    this.adminTitle = config.admin.title;
    // Bind functions to this scope
    this.admin = this.admin.bind(this);
  }

  async admin(ctx) {
    ctx.view = {
      _layout: 'admin',
      pageTitle: this.adminTitle,
    };
  }

  async getSettings(ctx) {
    const allowed = isAllowed(ctx, `admin.settings.${ctx.params.key}.view`);
    if (allowed === false) {
      return ctx.throw(403, 'Forbidden');
    } else {
      ctx.body = await Service('core.Settings').get(ctx.params.key);
    }
  }

  async setSettings(ctx) {
    const allowed = isAllowed(ctx, `admin.settings.${ctx.params.key}.manage`);
    if (allowed === false) {
      return ctx.throw(403, 'Forbidden');
    } else {
      ctx.body = await Service('core.Settings').set(ctx.params.key, ctx.request.body);
    }
  }
}

module.exports = new CoreAdminController();
