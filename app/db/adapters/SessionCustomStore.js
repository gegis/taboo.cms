const mongoose = require('mongoose');
const defaultExpire = 86400; //seconds

const sessionSchema = {
  key: String,
  value: Object,
  updatedAt: {
    default: new Date(),
    expires: defaultExpire,
    type: Date,
  },
};

class SessionCustomStore {
  constructor(config) {
    let expires = defaultExpire;
    if (config.maxAge) {
      expires = parseInt(config.maxAge / 1000);
    }
    sessionSchema.updatedAt.expires = expires;
    this.schema = new mongoose.Schema(sessionSchema);
    this.model = mongoose.model('Session', this.schema);
  }

  async destroy(key) {
    return this.model.deleteOne({ key });
  }

  async get(key) {
    const item = await this.model.findOne({ key });
    if (item) {
      return item.value;
    }
    return null;
  }

  async set(key, value, maxAge, options) {
    const item = { value };
    if (options.rolling) {
      item.updatedAt = new Date();
    }
    const result = await this.model.findOneAndUpdate({ key }, item, { new: true, upsert: true, safe: true });
    return result ? result.value : null;
  }
}

module.exports = SessionCustomStore;
