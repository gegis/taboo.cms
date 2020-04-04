import { action, decorate, observable } from 'mobx';
import axios from 'axios';
import AbstractAdminStore from 'modules/core/client/stores/AbstractAdminStore';
import ResponseHelper from 'modules/core/client/helpers/ResponseHelper';

const newItem = {
  id: null,
  title: '',
  url: '',
  language: 'en',
  enabled: false,
};

class NavigationAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/navigation',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/navigation/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/navigation',
        },
        update: {
          method: 'put',
          path: '/api/admin/navigation/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/navigation/:id',
        },
      },
    });
  }

  create(data) {
    if (this.filter && this.filter.type) {
      data.type = this.filter.type;
    }
    return new Promise(resolve => {
      const { create } = this.options.endpoints;
      axios[create.method](create.path, data)
        .then(response => {
          resolve(response.data);
        })
        .catch(ResponseHelper.handleError);
    });
  }
}

decorate(NavigationAdminStore, {
  languageOptions: observable,
  create: action,
});

export default new NavigationAdminStore();
