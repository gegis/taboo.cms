const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const uniqueValidator = require('mongoose-unique-validator');
const SchemaTypes = MongoDbAdapter.getSchemaTypes();

const FormEntryModel = MongoDbAdapter.setupModel('FormEntry', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    data: {
      type: Object,
    },
    form: {
      type: SchemaTypes.ObjectId,
      ref: 'Rating',
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'has to be unique.' });
  },
  // afterModelCreate(model, schema) {}, // Implement logic after model create in here
});

module.exports = FormEntryModel;
