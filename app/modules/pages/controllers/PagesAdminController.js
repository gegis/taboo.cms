const { config, Service, apiHelper } = require('@taboo/cms-core');
const AdminController = require('../../core/controllers/AdminController');
const {
  api: {
    pages: { defaultSort = null },
  },
} = config;

class PagesAdminController extends AdminController {
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
    // Clear page cache on update
    Service('pages.Pages').deletePageCacheByUrl(itemResult.url);
    return itemResult;
  }

  async afterDelete(ctx, itemResult) {
    // Clear page cache on delete
    Service('pages.Pages').deletePageCacheByUrl(itemResult.url);
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
