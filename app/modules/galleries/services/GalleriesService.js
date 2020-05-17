const GalleryModel = require('modules/galleries/models/GalleryModel');

class GalleriesService {
  async findOne(filter) {
    return await GalleryModel.findOne(filter).populate('images');
  }

  async beforeGalleryRender(props) {
    props.gallery = {};
    if (props.id) {
      props.gallery = await this.findOne({ _id: props.id, published: true });
    }
    return props;
  }
}

module.exports = new GalleriesService();
