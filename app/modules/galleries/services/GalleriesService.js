const GalleryModel = require('modules/galleries/models/GalleryModel');

class GalleriesService {
  async findOne(filter) {
    console.log(filter);
    return await GalleryModel.findOne(filter).populate('images');
  }
}

module.exports = new GalleriesService();
