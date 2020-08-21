const CountriesService = require('modules/countries/services/CountriesService');

module.exports = async (ctx, next) => {
  const country = await CountriesService.getVisitorCountry(ctx);
  if (country) {
    ctx.routeParams.clientConfig.userCountry = country;
  }
  return next();
};
