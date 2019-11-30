const { cmsHelper } = require('@taboo/cms-core');

class GalleryHelper {
  getTemplate(ctx, gallery, galleryTpl) {
    let tpl = '';
    if (gallery && gallery.published && gallery.images) {
      tpl = cmsHelper.composeTemplate(ctx, galleryTpl, { images: gallery.images, title: gallery.title });
    }
    return tpl;
  }
}

module.exports = new GalleryHelper();
