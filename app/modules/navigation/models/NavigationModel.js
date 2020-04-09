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
    },
    slug: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    items: {
      type: Array,
    },
    language: {
      type: String,
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
