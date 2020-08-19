const CountriesService = require('modules/countries/services/CountriesService');
// TODO think of removing from globalPolicies, and apply to only the ones is needed
module.exports = async (ctx, next) => {
  const country = await CountriesService.getUserCountry(ctx);
  if (country) {
    ctx.routeParams.clientConfig.userCountry = country;
  }
  return next();
};
