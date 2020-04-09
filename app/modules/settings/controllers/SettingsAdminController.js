const { config, isAllowed } = require('@taboo/cms-core');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const SettingsService = require('modules/settings/services/SettingsService');
const SettingsModel = require('modules/settings/models/SettingsModel');

const {
  api: { settings: { defaultSort = { key: 'asc' } } = {} },
} = config;

class SettingsAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: SettingsModel,
      searchFields: ['_id', 'key', 'value'],
      populate: {},
      defaultSort,
    });
  }

  async afterFindById(ctx, itemResult) {
    let itemData = null;
    if (itemResult) {
      itemData = itemResult._doc;
      itemData = SettingsService.parseValue(itemData);
    }
    return itemData;
  }

  async beforeCreate(ctx, data) {
    return SettingsService.stringifyValue(data);
  }

  async beforeUpdate(ctx, id, data) {
    return SettingsService.stringifyValue(data);
  }

  async getByKey(ctx) {
    const allowed = isAllowed(ctx, `admin.settings.${ctx.params.key}.view`);
    if (allowed === false) {
      return ctx.throw(403, 'Forbidden');
    } else {
      ctx.body = await SettingsService.get(ctx.params.key);
    }
  }

  async setByKey(ctx) {
    const allowed = isAllowed(ctx, `admin.settings.${ctx.params.key}.manage`);
    if (allowed === false) {
      return ctx.throw(403, 'Forbidden');
    } else {
      ctx.body = await SettingsService.set(ctx.params.key, ctx.request.body);
    }
  }
}

module.exports = new SettingsAdminController();
