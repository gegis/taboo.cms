const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const SchemaTypes = MongoDbAdapter.getSchemaTypes();

const LogApiModel = MongoDbAdapter.setupModel('LogApi', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    action: {
      type: String,
    },
    token: {
      type: String,
    },
    code: {
      type: String,
    },
    error: {
      type: String,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
});

module.exports = LogApiModel;
