const { config, filesHelper } = require('@taboo/cms-core');
const path = require('path');
const fs = require('fs');
const TemplatesService = require('modules/templates/services/TemplatesService');
const TemplateModel = require('modules/templates/models/TemplateModel');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');

const { api: { templates: { defaultSort = { name: 'asc' } } = {} } = {}, templates: { tplPath } = {} } = config;

class TemplatesAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: TemplateModel,
      searchFields: ['_id', 'name', 'title', 'description'],
      populate: {},
      defaultSort,
    });
  }

  async afterFindAll(ctx, itemsResult = []) {
    const items = [];
    const fsItems = await TemplatesService.getFsTemplates();
    let item, dbItem;
    for (let i = 0; i < fsItems.length; i++) {
      item = fsItems[i];
      dbItem = null;
      for (let j = 0; j < itemsResult.length; j++) {
        dbItem = itemsResult[j];
        if (item.name === dbItem.name) {
          item = Object.assign(item, dbItem._doc);
          break;
        }
      }
      if (!item._id) {
        dbItem = await TemplateModel.create(item);
        item = Object.assign(item, dbItem._doc);
      }
      items.push(item);
    }
    return items;
  }

  async update(ctx) {
    const { params: { id = null } = {}, request: { body = {} } = {} } = ctx;
    let defaultTemplate = null;
    if (body && body.default === true) {
      defaultTemplate = await TemplateModel.findOne({ default: true });
      if (defaultTemplate._id.toString() !== id) {
        defaultTemplate.default = false;
        await defaultTemplate.save();
      }
    }
    try {
      return await super.update(ctx);
    } catch (err) {
      if (defaultTemplate) {
        defaultTemplate.default = true;
        await defaultTemplate.save();
      }
      return ctx.throw(400, err);
    }
  }

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

module.exports = new TemplatesAdminController();
