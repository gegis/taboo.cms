const { config, Service, apiHelper } = require('@taboo/cms-core');
const AbstractAdminController = require('../../core/controllers/AbstractAdminController');
const {
  api: {
    pages: { defaultSort = null },
  },
} = config;

class PagesAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: 'pages.Page',
      searchFields: ['_id', 'title', 'url', 'body'],
      defaultSort,
      populate: {
        findById: ['createdBy', 'updatedBy'],
      },
    });
  }

  async beforeCreate(ctx, data) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    Service('pages.Pages').populatePagesAndGalleries(data);
    data.createdBy = userId;
    return data;
  }

  async beforeUpdate(ctx, id, data) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    // Save current version as previous revision
    await Service('core.RevisionService').save('pages.Page', ctx.params.id);
    apiHelper.cleanTimestamps(data);
    Service('pages.Pages').populatePagesAndGalleries(data);
    data.updatedBy = userId;
    return data;
  }

  async afterUpdate(ctx, itemResult) {
    // Clear pages cache on update
    Service('pages.Pages').deleteAllPagesCache();
    return itemResult;
  }

  async afterDelete(ctx, itemResult) {
    // Clear pages cache on delete
    Service('pages.Pages').deleteAllPagesCache();
    return itemResult;
  }

  async getPrevious(ctx) {
    const item = await Service('core.RevisionService').get('pages.Page', ctx.params.id);
    if (!item) {
      return ctx.throw(404, 'Previous version not found');
    }
    ctx.body = item;
  }
}

module.exports = new PagesAdminController();
