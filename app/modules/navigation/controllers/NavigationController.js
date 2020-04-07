const { Service } = require('@taboo/cms-core');

class NavigationController {
  async findOneBySlug(ctx) {
    const { taboo: { language = 'en' } = {} } = ctx;
    ctx.body = await Service('navigation.Navigation').getEnabledBySlug(ctx.params.slug, language);
  }
}

module.exports = new NavigationController();
