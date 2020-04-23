const BlocksService = require('modules/blocks/services/BlocksService');

class BlocksController {
  async index(ctx) {
    if (!ctx.viewParams) {
      ctx.viewParams = {};
    }
    ctx.viewParams.module = 'Blocks';
    ctx.viewParams.items = await BlocksService.getAllEnabled();
  }

  async getAll(ctx) {
    ctx.body = await BlocksService.getAllEnabled();
  }
}

module.exports = new BlocksController();
