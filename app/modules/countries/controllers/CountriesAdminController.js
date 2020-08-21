const { config } = require('@taboo/cms-core');
const CoreHelper = require('modules/core/helpers/CoreHelper');
const CountryModel = require('modules/countries/models/CountryModel');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const { api: { countries: { defaultSort = { sort: 'asc' } } = {} } = {} } = config;

class CountriesAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: CountryModel,
      searchFields: ['_id', 'name', 'imageUrl'],
      populate: {},
      defaultSort,
      sortable: true,
    });
  }

  async beforeCreate(ctx, data) {
    if (!data.slug) {
      data.slug = CoreHelper.parseSlug(data.name);
    }
    return data;
  }

  async beforeUpdate(ctx, id, data) {
    if (!data.slug) {
      data.slug = CoreHelper.parseSlug(data.name);
    }
    return data;
  }
}

module.exports = new CountriesAdminController();
