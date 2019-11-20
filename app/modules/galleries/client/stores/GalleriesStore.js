import { decorate, observable, action, computed, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';
import ArrayHelper from 'app/modules/core/client/helpers/ArrayHelper';

const newGallery = {
  id: null,
  title: '',
  images: [],
  meta: {},
  published: false,
};

class GalleriesStore {
  constructor() {
    this.page = 1;
    this.limit = 50;
    this.hasMoreResults = false;
    this.search = '';
    this.galleries = [];
    this.sortBy = 'title';
    this.sortDirection = 'asc';
    this.gallery = Object.assign({}, newGallery);
    this.setGallery = this.setGallery.bind(this);
  }

  loadAll(options = {}) {
    return new Promise(resolve => {
      const opts = {
        params: {
          limit: this.limit,
        },
      };
      this.page = 1;
      this.hasMoreResults = false;
      this.search = '';
      if (options.search) {
        this.search = options.search;
        opts.params.search = options.search;
      }
      axios
        .get('/api/admin/galleries', opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.galleries = data;
            this.hasMoreResults = data.length === this.limit;
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadNextPage() {
    return new Promise(resolve => {
      this.page++;
      const opts = {
        params: {
          page: this.page,
          limit: this.limit,
        },
      };
      if (this.search) {
        opts.params.search = this.search;
      }
      axios
        .get('/api/admin/galleries', opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.hasMoreResults = data.length === this.limit;
            this.galleries = this.galleries.concat(data);
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadOne(id) {
    axios
      .get('/api/admin/galleries/' + id)
      .then(response => {
        runInAction(() => {
          const { data = {} } = response;
          if (!data.id && data._id) {
            data.id = data._id;
          }
          if (data.published) {
            data.publishedGroup = ['published'];
          }
          this.gallery = data;
        });
      })
      .catch(ResponseHelper.handleError);
  }

  resetGallery() {
    this.gallery = Object.assign({}, newGallery);
  }

  setGallery(gallery) {
    // A workaround for published checkbox as FormControl needs CheckboxGroup, which comes as a array
    if (gallery.publishedGroup) {
      if (gallery.publishedGroup.indexOf('published') > -1) {
        gallery.published = true;
      } else {
        gallery.published = false;
      }
    }
    this.gallery = Object.assign(this.gallery, gallery);
  }

  sortGalleries(field, direction) {
    this.sortBy = field;
    this.sortDirection = direction;
    this.galleries = ArrayHelper.sortByProperty([...this.galleries], this.sortBy, this.sortDirection);
  }

  addImage(image) {
    this.gallery.images.push(image);
  }

  removeImageById(id) {
    let position = null;
    this.gallery.images.find((item, i) => {
      position = i;
      return item._id === id;
    });
    if (position !== null) {
      this.removeImageByPosition(position);
    }
  }

  removeImageByPosition(index) {
    this.gallery.images.splice(index, 1);
  }

  reorderImages(startIndex, endIndex) {
    const [removed] = this.gallery.images.splice(startIndex, 1);
    this.gallery.images.splice(endIndex, 0, removed);
  }

  getItemIndexById(id) {
    let index = null;
    this.galleries.find((item, i) => {
      if (item._id === id) {
        index = i;
      }
    });
    return index;
  }

  updateGallery(data) {
    return new Promise(resolve => {
      axios
        .put('/api/admin/galleries/' + data.id, data)
        .then(response => {
          runInAction(() => {
            let index;
            if (response && response.data) {
              this.resetGallery();
              index = this.getItemIndexById(response.data._id);
              if (index !== null) {
                this.galleries[index] = response.data;
              }
              resolve(response.data);
            }
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  deleteById(id) {
    return new Promise(resolve => {
      axios
        .delete(`/api/admin/galleries/${id}`)
        .then(response => {
          runInAction(() => {
            let index;
            if (response && response.data) {
              index = this.getItemIndexById(id);
              if (index !== null) {
                this.galleries.splice(index, 1);
              }
              resolve(response.data);
            }
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  get total() {
    return this.galleries.length;
  }
}

decorate(GalleriesStore, {
  page: observable,
  hasMoreResults: observable,
  search: observable,
  limit: observable,
  galleries: observable,
  gallery: observable,
  loadAll: action,
  loadOne: action,
  setGallery: action,
  resetGallery: action,
  sortGalleries: action,
  addImage: action,
  removeImageById: action,
  removeImageByPosition: action,
  reorderImages: action,
  loadNextPage: action,
  updateGallery: action,
  deleteById: action,
  total: computed,
});

export default GalleriesStore;
