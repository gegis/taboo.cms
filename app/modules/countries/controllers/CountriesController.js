const CountriesService = require('modules/countries/services/CountriesService');

class CountriesController {
  async getAll(ctx) {
    ctx.body = CountriesService.getAll();
  }
}

module.exports = new CountriesController();
