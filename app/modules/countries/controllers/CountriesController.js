const CountriesService = require('modules/countries/services/CountriesService');

class CountriesController {
  async getAll(ctx) {
    ctx.body = await CountriesService.getAllArray();
  }

  async getAllSystem(ctx) {
    ctx.body = await CountriesService.getAllSystemEnabled();
  }

  async setUserCountry(ctx) {
    await CountriesService.setUserCountry(ctx, { countryId: ctx.params.countryId });
    ctx.body = {
      success: true,
    };
  }
}

module.exports = new CountriesController();
