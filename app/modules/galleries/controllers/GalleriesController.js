const GalleriesService = require('modules/galleries/services/GalleriesService');

class GalleriesController {
  async getOneById(ctx) {
    const gallery = await GalleriesService.findOne({ _id: ctx.params.id, published: true });
    if (!gallery) {
      ctx.throw(404, 'Gallery Not Found');
    }
    ctx.body = gallery;
  }
}

module.exports = new GalleriesController();
