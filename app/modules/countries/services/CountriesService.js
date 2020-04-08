const ArrayHelper = require('modules/core/helpers/ArrayHelper');
const countries = require('../data/countries');

class CountriesService {
  getAll() {
    return countries;
  }

  getKeyValueArray() {
    const options = [];
    for (let code in countries) {
      options.push({
        key: code,
        value: countries[code],
      });
    }
    return ArrayHelper.sortByProperty(options, 'value');
  }
}

module.exports = new CountriesService();
