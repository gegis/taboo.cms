const { config } = require('@taboo/cms-core');
const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const { server: { session: { options: { maxAge = 86400000 } = {} } = {} } = {} } = config;

const SessionModel = MongoDbAdapter.setupModel('Session', {
  schema: {
    key: String,
    value: Object,
    expiresAt: {
      default: new Date(Date.now() + maxAge),
      expires: 0,
      type: Date,
    },
  },
});

module.exports = SessionModel;
