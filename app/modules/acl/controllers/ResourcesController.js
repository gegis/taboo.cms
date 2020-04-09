const ACLService = require('modules/acl/services/ACLService');

class ResourcesController {
  async getAll(ctx) {
    ctx.body = ACLService.getAllResources();
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
