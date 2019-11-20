const countries = require('../data/countries');

class CountriesController {
  async getAll(ctx) {
    ctx.body = countries;
  }
}

module.exports = new CountriesController();
