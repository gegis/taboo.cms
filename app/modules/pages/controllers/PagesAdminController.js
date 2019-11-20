const { config, Service, apiHelper } = require('@taboo/cms-core');
const GenericAdminController = require('../../core/controllers/GenericAdminController');
const {
  api: {
    pages: { defaultSort = null },
  },
} = config;
const props = {
  model: 'pages.Page',
  searchFields: ['_id', 'title', 'url', 'body'],
  defaultSort,
  populate: {
    findById: ['createdBy', 'updatedBy'],
  },
  beforeCreate: async (ctx, data) => {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    Service('pages.Pages').populatePagesAndGalleries(data);
    data.createdBy = userId;
    return data;
  },
  beforeUpdate: async (ctx, id, data) => {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    // Save current version as previous revision
    await Service('core.RevisionService').save('pages.Page', ctx.params.id);
    apiHelper.cleanTimestamps(data);
    Service('pages.Pages').populatePagesAndGalleries(data);
    data.updatedBy = userId;
    return data;
  },
};

class PagesAdminController extends GenericAdminController {
  constructor(props) {
    super(props);
  }

  async getPrevious(ctx) {
    const item = await Service('core.RevisionService').get('pages.Page', ctx.params.id);
    if (!item) {
      return ctx.throw(404, 'Previous version not found');
    }
    ctx.body = item;
  }
}

module.exports = new PagesAdminController(props);
