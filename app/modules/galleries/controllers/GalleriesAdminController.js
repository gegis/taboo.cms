const { config, Service } = require('@taboo/cms-core');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const {
  api: {
    galleries: { defaultSort = null },
  },
} = config;

class GalleriesAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: 'galleries.Gallery',
      searchFields: ['_id', 'title'],
      populate: {
        findById: 'images',
      },
      defaultSort,
    });
  }

  async afterUpdate(ctx, itemResult) {
    // Clear all pages cache on update
    Service('pages.Pages').deleteAllPagesCache();
    return itemResult;
  }

  async afterDelete(ctx, itemResult) {
    // Clear all pages cache on delete
    Service('pages.Pages').deleteAllPagesCache();
    return itemResult;
  }
}

module.exports = new GalleriesAdminController();
