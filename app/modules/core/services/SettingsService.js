const { Model, apiHelper, isAllowed } = require('@taboo/cms-core');

class SettingsService {
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
    apiHelper.cleanTimestamps(data);
    let item = await Model('core.Settings').findOneAndUpdate({ key }, data, {
      new: true,
      runValidators: true,
    });
    if (item === null) {
      item = await Model('core.Settings').create(data);
    }
    return item;
  }

  getACLEnabled() {
    return isAllowed() !== undefined;
  }
}
module.exports = new SettingsService();
