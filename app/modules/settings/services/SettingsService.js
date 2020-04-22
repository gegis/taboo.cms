const { apiHelper, isAllowed, logger, _ } = require('@taboo/cms-core');
const CacheService = require('modules/cache/services/CacheService');
const SettingsModel = require('modules/settings/models/SettingsModel');

class SettingsService {
  constructor() {
    this.cacheId = 'settings';
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  async beforeTemplateRender(ctx) {
    const { routeParams: { clientConfig = {} } = {} } = ctx;
    const settingsClientConfig = await this.getPublic('clientConfig');
    if (settingsClientConfig && typeof settingsClientConfig === 'object') {
      _.merge(clientConfig, settingsClientConfig);
    }
  }

  async getPublic(key) {
    const cacheKey = key;
    let dbItem = null;
    let itemData = CacheService.get(this.cacheId, cacheKey);

    if (!itemData) {
      dbItem = await SettingsModel.findOne({ key, public: true }, ['value', 'type']);
      if (dbItem) {
        itemData = dbItem._doc;
        CacheService.set(this.cacheId, cacheKey, itemData);
      }
    }

    if (itemData && itemData.value) {
      itemData = this.parseValue(itemData);
      return itemData.value;
    }
    return null;
  }

  async get(key) {
    let itemData = null;
    const item = await SettingsModel.findOne({ key }, ['key', 'value', 'public', 'type', 'category']);
    if (item) {
      itemData = item._doc;
      itemData = this.parseValue(itemData);
    }
    return itemData;
  }

  async setPublic(key, value, type = 'string') {
    let item = { key, value, type, public: true };
    return await this.set(key, item);
  }

  async set(key, data) {
    let item;
    apiHelper.cleanTimestamps(data);
    data = this.stringifyValue(data);
    item = await SettingsModel.findOneAndUpdate({ key }, data, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    if (item === null) {
      if (!Object.prototype.hasOwnProperty.call(data, 'key')) {
        data.key = key;
      }
      item = await SettingsModel.create(data);
    }
    return item;
  }

  async getValue(key) {
    let value = null;
    let item = await this.get(key);
    if (item) {
      value = item.value;
    }
    return value;
  }

  async setValue(key, value, type = 'string') {
    return await this.set(key, { value, type });
  }

  parseValue(item) {
    item.originalValue = '';
    if (item && item.type && typeof item.value !== 'object') {
      item.originalValue = item.value;
      switch (item.type) {
        case 'json':
          try {
            item.value = JSON.parse(item.originalValue);
          } catch (err) {
            logger.error(err);
          }
          break;
        case 'boolean':
          item.value = item.originalValue === 'true';
          break;
        case 'integer':
          item.value = parseInt(item.originalValue);
          break;
        case 'float':
          item.value = parseFloat(item.originalValue);
          break;
      }
    }

    return item;
  }

  stringifyValue(data) {
    data.originalValue = '';
    if (data && data.type) {
      data.originalValue = data.value;
      switch (data.type) {
        case 'json':
          try {
            data.value = JSON.stringify(data.originalValue, null, 2);
          } catch (err) {
            logger.error(err);
          }
          break;
        case 'boolean':
          data.value = 'false';
          if (data.originalValue === true) {
            data.value = 'true';
          }
          break;
        case 'integer':
          data.value = parseInt(data.originalValue).toString();
          break;
        case 'float':
          data.value = parseFloat(data.originalValue).toString();
          break;
      }
    }
    return data;
  }

  deleteSettingsCache() {
    CacheService.clearCacheId(this.cacheId);
  }

  getACLEnabled() {
    return isAllowed() !== undefined;
  }
}

module.exports = new SettingsService();
