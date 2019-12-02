const { Service } = require('@taboo/cms-core');

class NavigationController {
  async getWebsiteNavigation(ctx) {
    const { taboo: { language = 'en' } = {} } = ctx;
    ctx.body = await Service('navigation.Navigation').getEnabledByType('website', language);
  }

  async geUserNavigation(ctx) {
    const { taboo: { language = 'en' } = {} } = ctx;
    ctx.body = await Service('navigation.Navigation').getEnabledByType('user', language);
  }
}

module.exports = new NavigationController();
