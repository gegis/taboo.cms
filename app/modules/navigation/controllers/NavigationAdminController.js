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

  async reorder(ctx) {
    const { request: { body: items = {} } = {} } = ctx;
    let sort = -1;
    let promises;

    try {
      if (items && items.length > 0) {
        promises = items.map(async item => {
          sort++;
          return await NavigationModel.updateOne({ _id: item._id }, { sort });
        });
      }
      await Promise.all(promises);
      // Clear navigation cache on delete
      NavigationService.deleteNavigationCache();
    } catch (e) {
      logger.error(e);
      return ctx.throw(e);
    }

    ctx.body = {
      success: true,
    };
  }
}

module.exports = new NavigationAdminController();
