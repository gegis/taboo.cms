const { Service } = require('@taboo/cms-core');

module.exports = async (ctx, next) => {
  const { taboo: { clientConfig = {}, language = 'en' } = {} } = ctx;
  clientConfig.navigation = await Service('navigation.Navigation').getEnabledByType('website', language);
  clientConfig.userNavigation = [];
  if (ctx.session && ctx.session.user && ctx.session.user.id) {
    clientConfig.userNavigation = await Service('navigation.Navigation').getEnabledByType('user', language);
  }
  return next();
};
