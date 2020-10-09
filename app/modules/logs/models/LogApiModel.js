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
    authType: {
      type: String,
    },
    token: {
      type: String,
    },
    code: {
      type: String,
    },
    message: {
      type: String,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
});

module.exports = LogApiModel;
