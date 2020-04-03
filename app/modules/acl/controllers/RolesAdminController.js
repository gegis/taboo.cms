const { config, Service } = require('@taboo/cms-core');
const AbstractAdminController = require('../../core/controllers/AbstractAdminController');
const {
  api: {
    roles: { defaultSort = null },
  },
} = config;

class RolesAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: 'acl.Role',
      searchFields: ['_id', 'name'],
      defaultSort,
    });
  }
  async afterUpdate(ctx, role) {
    await Service('acl.ACL').updateUserSessionsACL(role);
    return role;
  }
  async afterDelete(ctx, role) {
    await Service('acl.ACL').removeUserSessionsRole(role);
    return role;
  }
}

module.exports = new RolesAdminController();
