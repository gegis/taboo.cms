const { config, Service, isAllowed } = require('@taboo/cms-core');
const AbstractAdminController = require('../../core/controllers/AbstractAdminController');
const {
  api: { settings: { defaultSort = { key: 'asc' } } = {} },
} = config;

class SettingsAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: 'settings.Settings',
      searchFields: ['_id', 'key'],
      populate: {},
      defaultSort,
    });
  }

  async afterFindById(ctx, itemResult) {
    let itemData = null;
    if (itemResult) {
      itemData = itemResult._doc;
      itemData = Service('settings.Settings').parseValue(itemData);
    }
    return itemData;
  }

  async beforeCreate(ctx, data) {
    return Service('settings.Settings').stringifyValue(data);
  }

  async beforeUpdate(ctx, id, data) {
    return Service('settings.Settings').stringifyValue(data);
  }

  async getByKey(ctx) {
    const allowed = isAllowed(ctx, `admin.settings.${ctx.params.key}.view`);
    if (allowed === false) {
      return ctx.throw(403, 'Forbidden');
    } else {
      ctx.body = await Service('settings.Settings').get(ctx.params.key);
    }
  }

  async setByKey(ctx) {
    const allowed = isAllowed(ctx, `admin.settings.${ctx.params.key}.manage`);
    if (allowed === false) {
      return ctx.throw(403, 'Forbidden');
    } else {
      ctx.body = await Service('settings.Settings').set(ctx.params.key, ctx.request.body);
    }
  }
}

module.exports = new SettingsAdminController();
