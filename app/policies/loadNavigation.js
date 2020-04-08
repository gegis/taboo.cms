const NavigationService = require('modules/navigation/services/NavigationService');

module.exports = async (ctx, next) => {
  const { taboo: { clientConfig = {}, language = 'en' } = {} } = ctx;
  clientConfig.navigation = await NavigationService.getEnabledBySlug('website', language);
  clientConfig.userNavigation = [];
  if (ctx.session && ctx.session.user && ctx.session.user.id) {
    clientConfig.userNavigation = await NavigationService.getEnabledBySlug('user', language);
  }
  return next();
};
