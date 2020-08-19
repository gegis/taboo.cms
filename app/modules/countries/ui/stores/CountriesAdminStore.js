import { action, observable, decorate, runInAction } from 'mobx';
import axios from 'axios';
import AbstractAdminStore from 'modules/core/ui/stores/AbstractAdminStore';
import ResponseHelper from 'modules/core/ui/helpers/ResponseHelper';

const newItem = {
  id: '',
  name: '',
  iso: '',
  imageUrl: '',
  allowUserSelect: false,
  enabled: false,
};

class CountriesAdminStore extends AbstractAdminStore {
  constructor() {
    super({
      newItem: newItem,
      endpoints: {
        loadAll: {
          method: 'get',
          path: '/api/admin/countries',
        },
        loadById: {
          method: 'get',
          path: '/api/admin/countries/:id',
        },
        create: {
          method: 'post',
          path: '/api/admin/countries',
        },
        update: {
          method: 'put',
          path: '/api/admin/countries/:id',
        },
        deleteById: {
          method: 'delete',
          path: '/api/admin/countries/:id',
        },
      },
    });
    this.countryOptions = [];
    this.allCountriesOptions = [];
    this.items = [];
    this.setItems = this.setItems.bind(this);
  }

  setItems(items) {
    this.items = items;
    this.countryOptions = [];
    this.items.map(item => {
      this.countryOptions.push({
        label: item.name,
        value: item._id,
      });
    });
  }

  loadAllCountriesOptions() {
    return new Promise(resolve => {
      axios
        .get('/api/countries/all')
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            this.allCountriesOptions = data;
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }
}

decorate(CountriesAdminStore, {
  allCountriesOptions: observable,
  items: observable,
  countryOptions: observable,
  setItems: action,
  loadAllCountriesOptions: action,
});

export default new CountriesAdminStore();
