import { runInAction, action, observable, decorate } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';
import ArrayHelper from 'app/modules/core/client/helpers/ArrayHelper';

class GenericEntityStore {
  constructor(options) {
    this.options = options;
    this.page = 1;
    this.limit = 50;
    this.hasMoreResults = false;
    this.search = '';
    this.items = [];
    this.sortBy = this.options.sortBy || 'name';
    this.sortDirection = this.options.sortDirection || 'asc';
    this.item = Object.assign({}, this.options.newItem);
    this.setItem = this.setItem.bind(this);
    this.resetItem = this.resetItem.bind(this);
    this.getFormData = this.getFormData.bind(this);
  }

  resetItem() {
    this.item = Object.assign({}, this.options.newItem);
  }

  setItem(item) {
    this.item = Object.assign(this.item, item);
  }

  loadAll(options = {}) {
    return new Promise(resolve => {
      const { loadAll } = this.options.endpoints;
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
      axios[loadAll.method](loadAll.path, opts)
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
      const { loadAll } = this.options.endpoints;
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
      axios[loadAll.method](loadAll.path, opts)
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

  loadById(id) {
    return new Promise(resolve => {
      const { loadById } = this.options.endpoints;
      axios[loadById.method](loadById.path.replace(':id', id))
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            if (!data.id && data._id) {
              data.id = data._id;
            }
            this.item = data;
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  create(data) {
    return new Promise(resolve => {
      const { create } = this.options.endpoints;
      axios[create.method](create.path, data)
        .then(response => {
          resolve(response.data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  updateById(data) {
    return new Promise(resolve => {
      const { updateById } = this.options.endpoints;
      axios[updateById.method](updateById.path.replace(':id', data.id), data)
        .then(response => {
          runInAction(() => {
            let index;
            if (response && response.data) {
              this.resetItem();
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

  deleteById(id) {
    return new Promise(resolve => {
      const { deleteById } = this.options.endpoints;
      axios[deleteById.method](deleteById.path.replace(':id', id))
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

  /**
   * It's a workaround for rsuite Forms to update data on change
   * @param storeProperty
   */
  getFormData(storeProperty) {
    const data = {};
    if (Object.prototype.hasOwnProperty.call(this, storeProperty) && typeof this[storeProperty] === 'object') {
      // for (let key in this[storeProperty]) {
      //   data[key] = this[storeProperty][key];
      // }
      Object.keys(this[storeProperty]).map(key => {
        data[key] = this[storeProperty][key];
      });
    }
    return data;
  }
}

decorate(GenericEntityStore, {
  page: observable,
  hasMoreResults: observable,
  search: observable,
  limit: observable,
  items: observable,
  item: observable,
  setItem: action,
  resetItem: action,
  loadAll: action,
  loadNextPage: action,
  loadById: action,
  updateById: action,
  deleteById: action,
  sortItems: action,
});

export default GenericEntityStore;
