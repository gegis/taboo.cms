const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const SchemaTypes = MongoDbAdapter.getSchemaTypes();

const CatModel = MongoDbAdapter.setupModel('Cat', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    name: {
      type: String,
      required: [true, 'is required'],
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
  // afterSchemaCreate(schema) {}, // Implement logic after schema create in here
  // afterModelCreate(model, schema) {}, // Implement logic after model create in here
});

module.exports = CatModel;
