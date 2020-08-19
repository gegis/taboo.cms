const SessionModel = require('modules/db/models/SessionModel');

class SessionCustomStore {
  constructor() {
    this.model = SessionModel;
  }

  getModel() {
    return this.model;
  }

  async destroy(key) {
    return SessionModel.deleteOne({ key });
  }

  async get(key) {
    const item = await SessionModel.findOne({ key });
    if (item) {
      return item.value;
    }
    return null;
  }

  async set(key, value, maxAge, options) {
    const item = { value };
    if (options.rolling) {
      item.expiresAt = new Date(Date.now() + maxAge);
    }
    const result = await SessionModel.findOneAndUpdate({ key }, item, { new: true, upsert: true, safe: true });
    return result ? result.value : null;
  }
}

module.exports = new SessionCustomStore();
