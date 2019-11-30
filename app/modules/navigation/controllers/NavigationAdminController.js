const { config, logger, Model, Service } = require('@taboo/cms-core');
const AdminController = require('../../core/controllers/AdminController');
const {
  api: { navigation: { defaultSort = { sort: 'asc' } } = {} },
} = config;

class NavigationAdminController extends AdminController {
  constructor() {
    super({
      model: 'navigation.Navigation',
      searchFields: ['_id', 'title', 'url'],
      populate: {},
      defaultSort,
    });
  }

  async afterUpdate(ctx, itemResult) {
    // Clear navigation cache on update
    Service('navigation.Navigation').deleteNavigationCache();
    return itemResult;
  }

  async afterDelete(ctx, itemResult) {
    // Clear navigation cache on delete
    Service('navigation.Navigation').deleteNavigationCache();
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
          return await Model('navigation.Navigation').updateOne({ _id: item._id }, { sort });
        });
      }
      await Promise.all(promises);
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
