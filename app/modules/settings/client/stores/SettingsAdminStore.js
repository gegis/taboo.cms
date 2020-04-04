import AbstractAdminStore from 'modules/core/client/stores/AbstractAdminStore';
import { runInAction, action, observable, decorate } from 'mobx';
import ResponseHelper from 'modules/core/client/helpers/ResponseHelper';

const { settings: { types = [] } = {} } = window.app.config;

const newItem = {
  id: null,
  key: '',
  public: false,
  category: 'generic',
  type: 'string',
  value: '',
  originalValue: '',
  booleanValue: false,
};

class SettingsAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/settings',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/settings/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/settings',
        },
        update: {
          method: 'put',
          path: '/api/admin/settings/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/settings/:id',
        },
      },
    });
    this.types = [];
    types.map(item => {
      this.types.push({ label: item, value: item });
    });
  }

  setFilter(filter) {
    if (filter && filter.category) {
      this.options.newItem.category = filter.category;
    }
    this.filter = filter;
  }

  loadById(id) {
    return new Promise(resolve => {
      super.loadById(id).then(data => {
        runInAction(() => {
          if (data && data.type === 'boolean') {
            this.item.booleanValue = data.value;
          }
          resolve(data);
        });
      });
    });
  }

  create(data) {
    return new Promise(resolve => {
      super.create(this.setItemValues(data)).then(newData => {
        resolve(newData);
      });
    });
  }

  update(data) {
    return new Promise(resolve => {
      super.update(this.setItemValues(data)).then(newData => {
        resolve(newData);
      });
    });
  }

  setItemValues(data) {
    if (data.type === 'object') {
      try {
        data.value = JSON.parse(data.originalValue);
      } catch (e) {
        ResponseHelper.handleError(e);
      }
    } else if (data.type === 'boolean') {
      data.value = data.booleanValue;
    }
    return data;
  }
}

decorate(SettingsAdminStore, {
  filter: observable,
  options: observable,
  item: observable,
  types: observable,
  setFilter: action,
  loadById: action,
  create: action,
  update: action,
});

export default new SettingsAdminStore();
