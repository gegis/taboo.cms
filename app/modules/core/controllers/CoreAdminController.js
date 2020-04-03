const { config } = require('@taboo/cms-core');

class CoreAdminController {
  constructor() {
    this.adminTitle = config.admin.title;
    // Bind functions to this scope
    this.admin = this.admin.bind(this);
  }

  async admin(ctx) {
    ctx.view = {
      _layout: 'admin',
      metaTitle: this.adminTitle,
    };
  }
}

module.exports = new CoreAdminController();
