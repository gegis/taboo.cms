const { config } = require('@taboo/cms-core');

class CoreAdminController {
  constructor() {
    const { cms: { title } = {} } = config.admin;
    this.adminTitle = title;
    // Bind functions to this scope
    this.admin = this.admin.bind(this);
  }

  async admin(ctx) {
    ctx.viewParams = {
      _template: 'admin',
      metaTitle: this.adminTitle,
    };
  }
}

module.exports = new CoreAdminController();
