const { config, filesHelper } = require('@taboo/cms-core');
const path = require('path');
const fs = require('fs');
const TemplatesService = require('modules/templates/services/TemplatesService');
const TemplateModel = require('modules/templates/models/TemplateModel');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');

const { api: { templates: { defaultSort = { name: 'asc' } } = {} } = {}, templates: { themesPath } = {} } = config;

class TemplatesAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: TemplateModel,
      searchFields: ['_id', 'name', 'title', 'description'],
      populate: {},
      defaultSort,
    });
  }

  async afterFindById(ctx, itemResult) {
    let item = itemResult._doc;
    let fsItem = TemplatesService.getFsTemplate(item.name);
    item.styleTemplate = fsItem.styleTemplate;
    return item;
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
        dbItem = await TemplatesService.createDbTemplate(item);
        item = Object.assign(item, dbItem._doc);
      }
      items.push(item);
    }
    return items;
  }

  async update(ctx) {
    const { params: { id = null } = {}, request: { body = {} } = {} } = ctx;
    let defaultTemplate = await TemplateModel.findOne({ default: true });
    if (body && body.default === true) {
      if (defaultTemplate && defaultTemplate._id.toString() !== id) {
        defaultTemplate.default = false;
        await defaultTemplate.save();
      }
    } else {
      if (defaultTemplate && defaultTemplate._id.toString() === id) {
        return ctx.throw(400, new Error('One template must always be default'));
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

  async afterUpdate(ctx, itemResult) {
    // Clear settings cache on update
    TemplatesService.deleteTemplatesCache();
    return itemResult;
  }

  async afterDelete(ctx, itemResult) {
    // Clear settings cache on delete
    TemplatesService.deleteTemplatesCache();
    return itemResult;
  }

  async imagePreview(ctx) {
    const { params: { template = 'standard' } = {} } = ctx;
    let filePath = path.resolve(themesPath, template, 'preview.png');
    if (!filesHelper.fileExists(filePath)) {
      return ctx.throw(404, 'Not Found');
    }
    ctx.set('Content-Type', 'image/png');
    ctx.body = fs.createReadStream(filePath);
  }
}

module.exports = new TemplatesAdminController();
