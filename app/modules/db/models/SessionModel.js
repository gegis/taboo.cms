const { config } = require('@taboo/cms-core');
const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');

// maxAge is in milliseconds but we will need seconds;
const { server: { session: { options: { maxAge = 86400000 } = {} } = {} } = {} } = config;

const modelConfig = {
  schema: {
    key: String,
    value: Object,
    updatedAt: {
      default: new Date(),
      expires: maxAge / 1000,
      type: Date,
    },
  },
};

module.exports = MongoDbAdapter.setupModel('Session', modelConfig);
