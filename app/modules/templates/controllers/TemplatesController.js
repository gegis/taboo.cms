const TemplatesService = require('../services/TemplatesService');

class TemplatesController {
  async preview() {}

  async findByName(ctx) {
    const tpl = await TemplatesService.getByName(ctx.params.name);
    if (!tpl) {
      ctx.throw(404, 'Not Found');
    }
    ctx.body = tpl;
  }
}

module.exports = new TemplatesController();
