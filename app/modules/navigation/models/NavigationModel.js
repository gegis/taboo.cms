const uniqueValidator = require('mongoose-unique-validator');
const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');

const NavigationModel = MongoDbAdapter.setupModel('Navigation', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    name: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'is required'],
    },
    items: {
      type: Array,
    },
    language: {
      type: String,
      required: [true, 'is required'],
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'must be unique' });
  },
  // afterModelCreate(model, schema) {}, // Implement logic after model create in here
});

module.exports = NavigationModel;
