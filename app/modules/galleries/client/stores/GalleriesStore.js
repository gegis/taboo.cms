import { decorate, action } from 'mobx';
import EntityAdminStore from 'modules/core/client/stores/EntityAdminStore';

const newItem = {
  id: null,
  title: '',
  images: [],
  meta: {},
  published: false,
};

class GalleriesStore extends EntityAdminStore {
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

decorate(GalleriesStore, {
  addImage: action,
  removeImageById: action,
  removeImageByPosition: action,
  reorderImages: action,
});

export default GalleriesStore;
