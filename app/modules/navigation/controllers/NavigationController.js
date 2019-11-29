const { Service } = require('@taboo/cms-core');

class NavigationController {
  async getOneType(ctx) {
    const { type } = ctx.params;
    ctx.body = await Service('navigation.Navigation').getOneTypeEnabled(type);
  }

  async getAll(ctx) {
    ctx.body = await Service('navigation.Navigation').getAllEnabled();
  }
}

module.exports = new NavigationController();
