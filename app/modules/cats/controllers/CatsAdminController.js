const { config } = require('@taboo/cms-core');
const CatModel = require('modules/cats/models/CatModel');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const {
  api: { cats: { defaultSort = { createdAt: 'desc' } } = {} },
} = config;

class CatsAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: CatModel,
      searchFields: ['_id', 'name'],
      populate: {},
      defaultSort,
    });
  }

  async beforeCreate(ctx, data) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    data.user = userId;
    return data;
  }
}

module.exports = new CatsAdminController();
