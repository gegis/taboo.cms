const ACLService = require('modules/acl/services/ACLService');
const UsersService = require('modules/users/services/UsersService');

class ResourcesController {
  async getAll(ctx) {
    ctx.body = ACLService.getAllResources();
  }

  async getUserACL(ctx) {
    const user = await UsersService.getCurrentUser(ctx);
    let userACL = [];
    if (user && user.acl) {
      userACL = user.acl;
    } else if (user) {
      userACL = ACLService.getUserACL(user);
    }
    ctx.body = userACL;
  }
}

module.exports = new ResourcesController();
