import { decorate, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import ResponseHelper from 'modules/core/ui/helpers/ResponseHelper';

const { userCountry = null } = window.app.config;

class CountriesStore {
  constructor() {
    this.allCountriesOptions = [];
    this.items = [];
    this.countriesMapByIso = {};
    this.countriesMapById = {};
    this.country = {};
    this.countryId = null;
    this.countryIso = '';
    if (userCountry) {
      this.country = userCountry;
      this.countryId = userCountry._id;
      this.countryIso = userCountry.iso;
    }
  }

  setCountryId(countryId) {
    this.setCountry(countryId);
  }

  setCountryIdByIso(iso) {
    if (iso && this.countriesMapByIso[iso]) {
      this.setCountry(this.countriesMapByIso[iso]._id);
    }
  }

  setCountry(countryId) {
    if (this.countriesMapById[countryId]) {
      this.countryId = countryId;
      this.country = this.countriesMapById[countryId];
      this.countryIso = this.countriesMapById[countryId].iso;
      // TODO - if needed to save selected country to user session
      // axios.put(`/api/countries/user/${countryId}`);
    }
  }

  setCountriesMap(countries) {
    this.countriesMapByIso = {};
    this.countriesMapById = {};
    countries.map(country => {
      this.countriesMapByIso[country.iso] = country;
      this.countriesMapById[country._id] = country;
    });
    this.setCountry(this.countryId);
  }

  loadAllSystem() {
    return new Promise(resolve => {
      axios
        .get('/api/countries/system')
        .then(response => {
          runInAction(() => {
            const { data = {} } = response;
            this.items = data;
            this.setCountriesMap(data);
            resolve(data);
          });
        })
        .catch(ResponseHelper.handleError);
    });
  }

  loadAll() {
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

decorate(CountriesStore, {
  allCountriesOptions: observable,
  countriesMap: observable,
  selectedCountryId: observable,
  country: observable,
  countryId: observable,
  countryIso: observable,
  countriesMapByIso: observable,
  countriesMapById: observable,
  items: observable,
  setCountryId: action,
  setCountryIdByIso: action,
  setCountriesMap: action,
  setCountry: action,
  loadAll: action,
  loadAllSystem: action,
});

export default new CountriesStore();
