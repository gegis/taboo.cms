const { config } = require('@taboo/cms-core');
const BlockModel = require('modules/blocks/models/BlockModel');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const { api: { blocks: { defaultSort = { name: 'asc' } } = {} } = {} } = config;

class BlocksAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: BlockModel,
      searchFields: ['_id', 'name'],
      populate: {},
      defaultSort,
    });
  }

  async beforeCreate(ctx, data) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    data.createdBy = userId;
    return data;
  }

  async beforeUpdate(ctx, id, data) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    data.updatedBy = userId;
    return data;
  }
}

module.exports = new BlocksAdminController();
