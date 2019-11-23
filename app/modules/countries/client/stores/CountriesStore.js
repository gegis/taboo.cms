import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'app/modules/core/client/helpers/ResponseHelper';
import ArrayHelper from 'app/modules/core/client/helpers/ArrayHelper';

class CountriesStore {
  constructor() {
    this.countries = {};
    this.countriesSelect = [];
  }

  loadAll() {
    return new Promise(resolve => {
      axios
        .get('/api/countries')
        .then(response => {
          runInAction(() => {
            const { data = [] } = response;
            this.countries = data;
            this.countriesSelect = this.parseCountriesForSelect(data);
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  parseCountriesForSelect(countries) {
    const countriesSelect = [];
    if (countries) {
      Object.keys(countries).forEach(key => {
        countriesSelect.push({
          label: countries[key],
          value: key,
        });
      });
    }
    return ArrayHelper.sortByProperty(countriesSelect, 'label');
  }
}

decorate(CountriesStore, {
  countries: observable,
  countriesSelect: observable,
  loadAll: action,
});

export default new CountriesStore();
