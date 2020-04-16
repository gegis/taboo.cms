const path = require('path');
const fs = require('fs');
const { filesHelper, config } = require('@taboo/cms-core');
const { templates: { tplPath } = {} } = config;

class TemplatesController {
  async preview() {}
  async imagePreview(ctx) {
    const { params: { template = 'standard' } = {} } = ctx;
    let filePath = path.resolve(tplPath, template, 'preview.png');
    if (!filesHelper.fileExists(filePath)) {
      return ctx.throw(404, 'Not Found');
    }
    ctx.set('Content-Type', 'image/png');
    ctx.body = fs.createReadStream(filePath);
  }
}

module.exports = new TemplatesController();
