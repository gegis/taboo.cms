const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const SchemaTypes = MongoDbAdapter.getSchemaTypes();
const uniqueValidator = require('mongoose-unique-validator');

const ModelNameModel = MongoDbAdapter.setupModel('ModelName', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    name: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    user: {
      type: SchemaTypes,
      ref: 'User',
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'has to be unique.' });
  },
  // afterModelCreate(model, schema) {}, // Implement logic after model create in here
});

module.exports = ModelNameModel;
