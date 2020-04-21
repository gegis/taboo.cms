// const NavigationService = require('modules/navigation/services/NavigationService');

module.exports = async (ctx, next) => {
  // TODO (templates) this one is no longer needed, unless load it from db for classic!!!
  // const { taboo: { clientConfig = {}, language = 'en' } = {} } = ctx;
  // clientConfig.navigation = await NavigationService.getEnabledByName('website', language);
  // clientConfig.userNavigation = [];
  // if (ctx.session && ctx.session.user && ctx.session.user.id) {
  //   clientConfig.userNavigation = await NavigationService.getEnabledByName('user', language);
  // }
  return next();
};
