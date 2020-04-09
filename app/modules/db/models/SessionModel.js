const { config } = require('@taboo/cms-core');
const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const { server: { session: { options: { maxAge = 86400000 } = {} } = {} } = {} } = config;

const SessionModel = MongoDbAdapter.setupModel('Session', {
  schema: {
    key: String,
    value: Object,
    updatedAt: {
      default: new Date(),
      expires: maxAge / 1000, // maxAge is in milliseconds but we need seconds.
      type: Date,
    },
  },
});

module.exports = SessionModel;
