const BlocksService = require('modules/blocks/services/BlocksService');

class BlocksController {
  async index(ctx) {
    if (!ctx.view) {
      ctx.view = {};
    }
    ctx.view.module = 'Blocks';
    ctx.view.items = await BlocksService.getAllEnabled();
  }

  async getAll(ctx) {
    ctx.body = await BlocksService.getAllEnabled();
  }
}

module.exports = new BlocksController();
