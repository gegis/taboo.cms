const { config, logger, apiHelper, Model, Service } = require('@taboo/cms-core');
const AbstractAdminController = require('../../core/controllers/AbstractAdminController');
const {
  api: { navigation: { defaultSort = { sort: 'asc' } } = {} },
} = config;

class NavigationAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: 'navigation.Navigation',
      searchFields: ['_id', 'name', 'slug'],
      populate: {},
      defaultSort,
    });
    this.findOneBySlug = this.findOneBySlug.bind(this);
  }

  async findOneBySlug(ctx) {
    const { model } = this.props;
    let { fields } = apiHelper.parseRequestParams(ctx.request.query, ['fields']);
    let item = null;
    try {
      item = await Model(model).findOne({ slug: ctx.params.slug }, fields);
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
      // Clear navigation cache on delete
      Service('navigation.Navigation').deleteNavigationCache();
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
