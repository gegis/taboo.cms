const { Model, apiHelper, isAllowed, logger } = require('@taboo/cms-core');

class SettingsService {
  constructor() {
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  async getPublic(key) {
    let itemData = null;
    let item = await Model('settings.Settings').findOne({ key, public: true }, ['value', 'type']);
    if (item && item.value) {
      itemData = item._doc;
      itemData = this.parseValue(itemData);
      return itemData.value;
    }
    return null;
  }

  async get(key) {
    let itemData = null;
    const item = await Model('settings.Settings').findOne({ key }, ['key', 'value', 'public', 'type', 'category']);
    if (item) {
      itemData = item._doc;
      itemData = this.parseValue(itemData);
    }
    return itemData;
  }

  async setPublic(key, value) {
    let item = { key, value, public: true };
    return await this.set(key, item);
  }

  async set(key, data) {
    let item;
    apiHelper.cleanTimestamps(data);
    data = this.stringifyValue(data);
    item = await Model('settings.Settings').findOneAndUpdate({ key }, data, {
      new: true,
      runValidators: true,
    });
    if (item === null) {
      if (!Object.prototype.hasOwnProperty.call(data, 'key')) {
        data.key = key;
      }
      item = await Model('settings.Settings').create(data);
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
    if (item && item.type) {
      item.originalValue = item.value;
      switch (item.type) {
        case 'object':
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
        case 'object':
          try {
            data.value = JSON.stringify(data.originalValue);
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

  getACLEnabled() {
    return isAllowed() !== undefined;
  }
}

module.exports = new SettingsService();
