const NavigationService = require('modules/navigation/services/NavigationService');

class NavigationController {
  async findOneByName(ctx) {
    const { routeParams: { language = 'en' } = {} } = ctx;
    ctx.body = await NavigationService.getEnabledByName(ctx.params.name, language);
  }
}

module.exports = new NavigationController();
