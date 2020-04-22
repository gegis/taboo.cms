const NavigationService = require('modules/navigation/services/NavigationService');

class NavigationController {
  async findOneByName(ctx) {
    ctx.body = await NavigationService.getEnabledByName(ctx.params.name);
  }
}

module.exports = new NavigationController();
