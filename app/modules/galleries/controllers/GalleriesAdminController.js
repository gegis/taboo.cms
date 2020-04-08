const { config } = require('@taboo/cms-core');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const PagesService = require('modules/pages/services/PagesService');
const GalleryModel = require('modules/galleries/models/GalleryModel');

const {
  api: {
    galleries: { defaultSort = null },
  },
} = config;

class GalleriesAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: GalleryModel,
      searchFields: ['_id', 'title'],
      populate: {
        findById: 'images',
      },
      defaultSort,
    });
  }

  async afterUpdate(ctx, itemResult) {
    // Clear all pages cache on update
    PagesService.deleteAllPagesCache();
    return itemResult;
  }

  async afterDelete(ctx, itemResult) {
    // Clear all pages cache on delete
    PagesService.deleteAllPagesCache();
    return itemResult;
  }
}

module.exports = new GalleriesAdminController();
