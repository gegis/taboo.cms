const CountriesService = require('modules/countries/services/CountriesService');

class CountriesController {
  async index(ctx) {
    ctx.viewParams.module = 'Countries';
    ctx.viewParams.items = await CountriesService.getAllSystemEnabled();
  }

  async getAllSystem(ctx) {
    ctx.body = await CountriesService.getAllSystemEnabled();
  }

  async getAll(ctx) {
    ctx.body = await CountriesService.getAllArray();
  }

  async setUserCountry(ctx) {
    await CountriesService.setUserCountry(ctx, { countryId: ctx.params.countryId });
    ctx.body = {
      success: true,
    };
  }
}

module.exports = new CountriesController();
