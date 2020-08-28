const uniqueValidator = require('mongoose-unique-validator');
const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const SchemaTypes = MongoDbAdapter.getSchemaTypes();

const UserTokenModel = MongoDbAdapter.setupModel('UserToken', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
    uid: {
      type: String,
    },
    type: {
      type: String,
      enum: ['jwtAuth', 'jwtRefresh', 'apiKey'],
    },
    token: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    expiresAt: {
      expires: 0,
      type: Date,
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'already exists' });
  },
});

module.exports = UserTokenModel;
