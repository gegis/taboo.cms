const CatsService = require('modules/cats/services/CatsService');
const CatsHelper = require('modules/cats/helpers/CatsHelper');

class CatsController {
  async index(ctx) {
    if (!ctx.view) {
      ctx.view = {};
    }
    ctx.view.module = CatsHelper.getModule();
    ctx.view.items = await CatsService.getAllEnabled();
  }

  async getAll(ctx) {
    ctx.body = await CatsService.getAllEnabled();
  }
}

module.exports = new CatsController();
