const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');

const modelConfig = {
  connection: 'mongodb',
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    key: {
      type: String,
    },
    value: {
      type: Object,
    },
  },
};

module.exports = MongoDbAdapter.setupModel('Revision', modelConfig);
