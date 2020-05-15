import { runInAction, action, observable, decorate } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/ui/helpers/ResponseHelper';
import ArrayHelper from 'app/modules/core/ui/helpers/ArrayHelper';

class AbstractAdminStore {
  constructor(options) {
    this.options = options;
    this.page = 1;
    this.limit = 50;
    this.hasMoreResults = false;
    this.filter = null;
    this.search = '';
    this.items = [];
    this.sortBy = this.options.sortBy || 'name';
    this.sortDirection = this.options.sortDirection || 'asc';
    this.item = Object.assign({}, this.options.newItem);
    this.setItem = this.setItem.bind(this);
    this.setItems = this.setItems.bind(this);
    this.resetItem = this.resetItem.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.setCheckboxItemValue = this.setCheckboxItemValue.bind(this);
  }

  resetItem() {
    this.item = Object.assign({}, this.options.newItem);
  }

  setItem(item) {
    this.item = Object.assign(this.item, item);
  }

  setItems(items) {
    this.items = items;
  }

  setCheckboxItemValue(field, event, value) {
    this.item[field] = value;
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
      if (options.populate) {
        opts.params.populate = options.populate;
      }
      if (this.filter) {
        opts.params.filter = this.filter;
      }
      axios[loadAll.method](loadAll.path, opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.setItems(data);
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
      if (this.filter) {
        opts.params.filter = this.filter;
      }
      axios[loadAll.method](loadAll.path, opts)
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.hasMoreResults = data.length === this.limit;
            this.setItems(this.items.concat(data));
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
            // this.item = Object.assign(this.item, data);
            this.setItem(data);
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  create(data) {
    return new Promise(resolve => {
      const deleteProps = ['id', '_id'];
      const { create } = this.options.endpoints;
      deleteProps.map(prop => {
        if (Object.keys(data).indexOf(prop) !== -1) {
          delete data[prop];
        }
      });
      axios[create.method](create.path, data)
        .then(response => {
          resolve(response.data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  update(data, updateItems = true) {
    return new Promise(resolve => {
      const { update } = this.options.endpoints;
      axios[update.method](update.path.replace(':id', data.id), data)
        .then(response => {
          runInAction(() => {
            let index, items;
            if (response && response.data) {
              this.resetItem();
              if (updateItems === true) {
                index = this.getItemIndexById(response.data._id);
                if (index !== null) {
                  items = this.items.slice();
                  items[index] = response.data;
                  this.setItems(items);
                }
              }
              resolve(response.data);
            } else {
              resolve(data);
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
            let index, items;
            if (response && response.data) {
              index = this.getItemIndexById(id);
              if (index !== null) {
                items = this.items.slice();
                items.splice(index, 1);
                this.setItems(items);
              }
              resolve(response.data);
            }
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  setFilter(filter) {
    this.filter = filter;
  }

  setSearch(search) {
    this.search = search;
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
    this.setItems(ArrayHelper.sortByProperty([...this.items], this.sortBy, this.sortDirection));
  }

  reorderItems(startIndex, endIndex) {
    return new Promise(resolve => {
      const [removed] = this.items.splice(startIndex, 1);
      const { update, reorder } = this.options.endpoints;
      let endpoint = {
        method: update.method,
        path: update.path.replace(':id', 'reorder'),
      };
      if (reorder) {
        endpoint = reorder;
      }
      runInAction(() => {
        this.items.splice(endIndex, 0, removed);
      });
      axios[endpoint.method](endpoint.path, this.items)
        .then(response => {
          resolve(response.data);
        })
        .catch(ResponseHelper.handleError);
    });
  }

  /**
   * It's a workaround for rsuite Forms to update data on change
   * @param storeProperty
   */
  getFormData(storeProperty = 'item') {
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

decorate(AbstractAdminStore, {
  page: observable,
  hasMoreResults: observable,
  filter: observable,
  search: observable,
  limit: observable,
  items: observable,
  item: observable,
  setItem: action,
  setItems: action,
  resetItem: action,
  loadAll: action,
  loadNextPage: action,
  loadById: action,
  create: action,
  update: action,
  deleteById: action,
  setFilter: action,
  setSearch: action,
  reorderItems: action,
  sortItems: action,
  setCheckboxItemValue: action,
});

export default AbstractAdminStore;
