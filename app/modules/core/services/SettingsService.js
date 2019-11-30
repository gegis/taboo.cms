const { Model, apiHelper, isAllowed } = require('@taboo/cms-core');

class SettingsService {
  constructor() {
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  async getPublic(key) {
    let item = await Model('core.Settings').findOne({ key, public: true }, ['value']);
    if (item && item.value) {
      return item.value;
    }
    return {};
  }

  async get(key) {
    let item = await Model('core.Settings').findOne({ key }, ['key', 'value', 'public']);
    if (!item) {
      item = {
        key,
        value: null,
        public: false,
      };
    }
    return item;
  }

  async set(key, data) {
    let item;
    apiHelper.cleanTimestamps(data);
    item = await Model('core.Settings').findOneAndUpdate({ key }, data, {
      new: true,
      runValidators: true,
    });
    if (item === null) {
      if (!Object.prototype.hasOwnProperty.call(data, 'key')) {
        data.key = key;
      }
      item = await Model('core.Settings').create(data);
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

  async setValue(key, value) {
    let item = await this.set(key, { value });
    if (!item) {
      item = {
        key,
        value: null,
        public: false,
      };
    }
    return item;
  }

  getACLEnabled() {
    return isAllowed() !== undefined;
  }
}
module.exports = new SettingsService();
