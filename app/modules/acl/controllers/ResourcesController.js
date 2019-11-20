const { Service } = require('@taboo/cms-core');

class ResourcesController {
  async getAll(ctx) {
    ctx.body = Service('acl.ACL').getAllResources();
  }

  async getUserACL(ctx) {
    let userACL = [];
    if (ctx.session && ctx.session.user && ctx.session.user.acl) {
      userACL = ctx.session.user.acl;
    }
    ctx.body = userACL;
  }
}

module.exports = new ResourcesController();
