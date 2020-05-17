const { config } = require('@taboo/cms-core');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const PagesService = require('modules/pages/services/PagesService');
const RevisionService = require('modules/core/services/RevisionService');
const PageModel = require('modules/pages/models/PageModel');
const {
  api: {
    pages: { defaultSort = null },
  },
} = config;

class PagesAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: PageModel,
      searchFields: ['_id', 'title', 'url', 'body', 'language'],
      defaultSort,
      populate: {
        findById: ['createdBy', 'updatedBy'],
      },
    });
  }

  async beforeCreate(ctx, data) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    data.createdBy = userId;
    return data;
  }

  async beforeUpdate(ctx, id, data) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    // Save current version as previous revision
    await RevisionService.saveById(PageModel, ctx.params.id);
    data.updatedBy = userId;
    return data;
  }

  async afterUpdate(ctx, itemResult) {
    // Clear pages cache on update
    PagesService.deleteAllPagesCache();
    return itemResult;
  }

  async afterDelete(ctx, itemResult) {
    // Clear pages cache on delete
    PagesService.deleteAllPagesCache();
    return itemResult;
  }

  async getPrevious(ctx) {
    const revisionPage = await RevisionService.getById(PageModel, ctx.params.id);
    if (!revisionPage) {
      return ctx.throw(404, 'Previous version not found');
    }
    ctx.body = revisionPage;
  }
}

module.exports = new PagesAdminController();
