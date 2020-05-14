const { config, logger, apiHelper } = require('@taboo/cms-core');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const NavigationService = require('modules/navigation/services/NavigationService');
const NavigationModel = require('modules/navigation/models/NavigationModel');
const {
  api: { navigation: { defaultSort = { name: 'asc' } } = {} },
} = config;

class NavigationAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: NavigationModel,
      searchFields: ['_id', 'title', 'name'],
      populate: {},
      defaultSort,
    });
    this.findOneByName = this.findOneByName.bind(this);
  }

  async findOneByName(ctx) {
    let { fields } = apiHelper.parseRequestParams(ctx.request.query, ['fields']);
    let item = null;
    try {
      item = await NavigationModel.findOne({ name: ctx.params.name }, fields);
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    if (!item) {
      return ctx.throw(404);
    }
    ctx.body = item;
  }

  async afterUpdate(ctx, itemResult) {
    // Clear navigation cache on update
    NavigationService.deleteNavigationCache();
    return itemResult;
  }

  async afterDelete(ctx, itemResult) {
    // Clear navigation cache on delete
    NavigationService.deleteNavigationCache();
    return itemResult;
  }
}

module.exports = new NavigationAdminController();
