import { decorate, observable, action, computed, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';
import ArrayHelper from 'app/modules/core/client/helpers/ArrayHelper';

const newItem = {
  id: null,
  name: '',
  url: '',
  path: '',
  size: '',
  type: '',
  documentType: '',
  isUserDocument: false,
  verified: false,
  note: '',
  user: '',
  createdAt: '',
  updatedAt: '',
};

class UploadsAdminStore {
  constructor() {
    this.page = 1;
    this.limit = 50;
    this.hasMoreResults = false;
    this.search = '';
    this.filter = {};
    this.items = [];
    this.itemsToUpload = [];
    this.sortBy = 'createdAt';
    this.sortDirection = 'desc';
    this.item = Object.assign({}, newItem);
    this.typeOptions = [{ label: 'Image', value: 'image' }, { label: 'Video', value: 'video' }];
    this.setItemData = this.setItemData.bind(this);
    this.toggleItemValue = this.toggleItemValue.bind(this);
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
      if (options.filter) {
        this.filter = options.filter;
        opts.params.filter = options.filter;
      }
      axios
        .get('/api/admin/uploads', opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.items = data;
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
      if (this.filter) {
        opts.params.filter = this.filter;
      }
      axios
        .get('/api/admin/uploads', opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.hasMoreResults = data.length === this.limit;
            this.items = this.items.concat(data);
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadItem(id) {
    return new Promise(resolve => {
      axios
        .get('/api/admin/uploads/' + id)
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            if (!data.id && data._id) {
              data.id = data._id;
            }
            this.item = Object.assign(this.item, data);
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  resetItemData() {
    this.item = Object.assign({}, newItem);
  }

  setItemData(item) {
    this.item = Object.assign(this.item, item);
  }

  toggleItemValue(field, event, value) {
    this.item[field] = value;
  }

  deleteItem(id) {
    return new Promise(resolve => {
      axios
        .delete(`/api/admin/uploads/${id}`)
        .then(response => {
          runInAction(() => {
            let index;
            if (response && response.data) {
              index = this.getItemIndexById(id);
              if (index !== null) {
                this.items.splice(index, 1);
              }
              resolve(response.data);
            }
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  saveItem() {
    const data = {
      name: this.item.name,
      verified: this.item.verified,
      note: this.item.note,
    };
    return new Promise(resolve => {
      axios
        .put('/api/admin/uploads/' + this.item.id, data)
        .then(response => {
          runInAction(() => {
            let index;
            if (response && response.data) {
              this.resetItemData();
              index = this.getItemIndexById(response.data._id);
              if (index !== null) {
                this.items[index] = response.data;
              }
              resolve(response.data);
            }
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  prependItemsToUpload(items) {
    const existing = this.itemsToUpload;
    if (items) {
      items.map(item => {
        item.status = 'toUpload';
      });
      this.itemsToUpload = items.concat(existing);
    }
  }

  resetItemsToUpload() {
    this.itemsToUpload = [];
  }

  uploadItems(next) {
    const items = this.itemsToUpload.slice();
    items.map(item => {
      let form = new window.FormData();
      if (item.status === 'toUpload') {
        item.status = 'uploading';
        this.itemsToUpload = items; // needed to force updates to view;
        form.append('file', item, item.name);
        axios
          .post('/api/admin/uploads', form, {
            headers: {
              'content-type': `multipart/form-data; boundary=${form._boundary}`,
            },
          })
          .then(data => {
            runInAction(() => {
              item.status = 'uploaded';
              this.itemsToUpload = items; // needed to force updates to view;
              if (next) {
                next(null, data.data);
              }
            });
          })
          .catch(e => {
            runInAction(() => {
              item.status = 'failed';
              this.itemsToUpload = items; // needed to force updates to view;
            });
            ResponseHelper.handleError(e);
          });
      }
    });
  }

  getItemIndexById(id) {
    let index = null;
    this.items.find((item, i) => {
      if (item._id === id) {
        index = i;
      }
    });
    return index;
  }

  sort(field, direction) {
    this.sortBy = field;
    this.sortDirection = direction;
    this.items = ArrayHelper.sortByProperty([...this.items], this.sortBy, this.sortDirection);
  }

  get total() {
    return this.items.length;
  }
}

decorate(UploadsAdminStore, {
  page: observable,
  hasMoreResults: observable,
  search: observable,
  filter: observable,
  limit: observable,
  items: observable,
  item: observable,
  itemsToUpload: observable,
  typeOptions: observable,
  loadAll: action,
  loadItem: action,
  resetItemData: action,
  setItemData: action,
  sort: action,
  prependItemsToUpload: action,
  resetItemsToUpload: action,
  uploadItems: action,
  loadNextPage: action,
  toggleItemValue: action,
  total: computed,
});

export default UploadsAdminStore;
