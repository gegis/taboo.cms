const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');

const RevisionModel = MongoDbAdapter.setupModel('Revision', {
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
});

module.exports = RevisionModel;
