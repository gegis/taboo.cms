const { Service } = require('@taboo/cms-core');

class NavigationController {
  async getAll(ctx) {
    ctx.body = await Service('navigation.Navigation').getAllEnabled();
  }
}

module.exports = new NavigationController();
