const { config } = require('@taboo/cms-core');

const CountryModel = require('modules/countries/models/CountryModel');
// const UsersService = require('modules/users/services/UsersService');
const ArrayHelper = require('modules/core/helpers/ArrayHelper');
const countries = require('../data/countries');
const {
  api: { countries: { defaultSort = { sort: 'asc' } } = {} } = {},
  countries: { defaultCountryIso = 'GB' } = {},
} = config;

class CountriesService {
  async getAllSystemEnabled(filter = {}, { options = { sort: defaultSort }, fields = null, populate = null } = {}) {
    const findFilter = Object.assign({ enabled: true }, filter);
    const query = CountryModel.find(findFilter, fields, options);
    if (populate) {
      query.populate(populate);
    }
    return query.exec();
  }

  async getOneSystemEnabled(filter = {}) {
    const findFilter = Object.assign({ enabled: true }, filter);
    return CountryModel.findOne(findFilter);
  }

  getAll() {
    return countries;
  }

  getAllArray() {
    const options = [];
    for (let code in countries) {
      options.push({
        value: code,
        label: countries[code],
      });
    }
    return ArrayHelper.sortByProperty(options, 'label');
  }

  async setUserCountry(ctx, { country = null, countryId = null, countryIso = null }) {
    const { session } = ctx;
    let filter = {};
    if (!country) {
      if (countryId) {
        filter = { _id: countryId };
      } else if (countryIso) {
        filter = { iso: countryIso };
      }
      country = await this.getOneSystemEnabled(filter);
    }
    if (country && session) {
      session.userCountry = country;
    }
    return country;
  }

  async getVisitorCountry(ctx, setUserCountry = false) {
    const { session } = ctx;
    // const ip = UsersService.getUserIp(ctx);
    let country = null;

    if (session && session.userCountry) {
      country = session.userCountry;
    } else {
      // TODO implement your country by ip lookup in here.

      // IP can be from country that does not exist in system, so use default country
      if (!country) {
        country = await this.getDefaultCountry();
      }

      if (setUserCountry && country) {
        await this.setUserCountry(ctx, { country });
      }
    }

    return country;
  }

  async getDefaultCountry() {
    return await this.getOneSystemEnabled({ iso: defaultCountryIso });
  }
}

module.exports = new CountriesService();
