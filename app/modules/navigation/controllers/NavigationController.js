const { Service } = require('@taboo/cms-core');

class NavigationController {
  async getAllByType(ctx) {
    const { taboo: { language = 'en' } = {}, params: { type } = {} } = ctx;
    ctx.body = await Service('navigation.Navigation').getEnabledByType(type, language);
  }
}

module.exports = new NavigationController();