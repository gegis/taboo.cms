const { Service } = require('@taboo/cms-core');

class CountriesController {
  async getAll(ctx) {
    ctx.body = Service('countries.Countries').getAll();
  }
}

module.exports = new CountriesController();
