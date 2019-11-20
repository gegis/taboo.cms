const { apiHelper, config, Model, Helper, Service } = require('@taboo/cms-core');

class RolesAdminController {
  async findAll(ctx) {
    const requestParams = ctx.request.query;
    const {
      api: { roles: { defaultSort = null } = {} },
    } = config;
    let { filter, fields, limit, skip, sort } = apiHelper.parseRequestParams(ctx.request.query, [
      'filter',
      'fields',
      'limit',
      'skip',
      'sort',
    ]);
    let searchFields = ['name'];
    if (requestParams && requestParams.search) {
      Helper('core.Core').applySearchToFilter(requestParams.search, searchFields, filter);
    }
    if (sort === null) {
      sort = defaultSort;
    }
    ctx.body = await Model('acl.Role').find(filter, fields, { limit, skip, sort });
  }

  async findById(ctx) {
    let { fields } = apiHelper.parseRequestParams(ctx.request.query, ['fields']);
    const item = await Model('acl.Role').findById(ctx.params.id, fields);
    ctx.body = item;
  }

  async create(ctx) {
    const data = ctx.request.body;
    ctx.body = await Model('acl.Role').create(data);
  }

  async update(ctx) {
    const data = ctx.request.body;
    let role;
    apiHelper.cleanTimestamps(data);
    role = await Model('acl.Role').findByIdAndUpdate(ctx.params.id, data, { new: true });
    // This goes through all sessions that contain updated role and regenerates ACL list
    await Service('acl.ACL').updateUserSessionsACL(role);
    ctx.body = role;
  }

  async delete(ctx) {
    const role = await Model('acl.Role').findByIdAndDelete(ctx.params.id);
    // It's needed for schema post remove middleware to be triggered;
    role.remove();
    await Service('acl.ACL').removeUserSessionsRole(role);
    ctx.body = role;
  }

  async count(ctx) {
    ctx.body = await Model('acl.Role').estimatedDocumentCount();
  }
}

module.exports = new RolesAdminController();
