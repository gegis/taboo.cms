import { decorate, action, observable } from 'mobx';
import AbstractAdminStore from 'modules/core/ui/stores/AbstractAdminStore';

const newItem = {
  id: null,
  title: '',
  images: [],
  meta: {},
  published: false,
};

class GalleriesAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/galleries',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/galleries/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/galleries',
        },
        update: {
          method: 'put',
          path: '/api/admin/galleries/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/galleries/:id',
        },
      },
    });
    this.galleryOptions = [];
    this.galleryImages = {};
  }

  setItems(items = []) {
    this.galleryOptions = [];
    items.map(item => {
      this.galleryOptions.push({
        label: `${item.title} (${item.images.length})`,
        value: item._id,
      });
    });
    super.setItems(items);
  }

  setItem(item) {
    if (item && item.images) {
      this.galleryImages[item._id] = item.images;
    }
    super.setItem(item);
  }

  addImage(image) {
    this.item.images.push(image);
  }

  removeImageById(id) {
    let position = null;
    this.item.images.find((item, i) => {
      position = i;
      return item._id === id;
    });
    if (position !== null) {
      this.removeImageByPosition(position);
    }
  }

  removeImageByPosition(index) {
    this.item.images.splice(index, 1);
  }

  reorderImages(startIndex, endIndex) {
    const [removed] = this.item.images.splice(startIndex, 1);
    this.item.images.splice(endIndex, 0, removed);
  }
}

decorate(GalleriesAdminStore, {
  galleryOptions: observable,
  galleryImages: observable,
  setItems: action,
  setItem: action,
  addImage: action,
  removeImageById: action,
  removeImageByPosition: action,
  reorderImages: action,
});

export default new GalleriesAdminStore();
