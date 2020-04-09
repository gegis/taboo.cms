const { config } = require('@taboo/cms-core');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const ACLService = require('modules/acl/services/ACLService');
const RoleModel = require('modules/acl/models/RoleModel');

const {
  api: {
    roles: { defaultSort = null },
  },
} = config;

class RolesAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: RoleModel,
      searchFields: ['_id', 'name'],
      defaultSort,
    });
  }
  async afterUpdate(ctx, role) {
    await ACLService.updateUserSessionsACL(role);
    return role;
  }
  async afterDelete(ctx, role) {
    await ACLService.removeUserSessionsRole(role);
    return role;
  }
}

module.exports = new RolesAdminController();
