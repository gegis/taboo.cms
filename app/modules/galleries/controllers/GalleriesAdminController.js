const { config } = require('@taboo/cms-core');
const AdminController = require('../../core/controllers/AdminController');
const {
  api: {
    galleries: { defaultSort = null },
  },
} = config;

class GalleriesAdminController extends AdminController {
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
}

module.exports = new GalleriesAdminController();
