const NavigationService = require('modules/navigation/services/NavigationService');

class NavigationController {
  async findOneBySlug(ctx) {
    const { taboo: { language = 'en' } = {} } = ctx;
    ctx.body = await NavigationService.getEnabledBySlug(ctx.params.slug, language);
  }
}

module.exports = new NavigationController();
