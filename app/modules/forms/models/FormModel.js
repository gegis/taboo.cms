const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const uniqueValidator = require('mongoose-unique-validator');

const FormModel = MongoDbAdapter.setupModel('Form', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    title: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    header: {
      type: String,
    },
    footer: {
      type: String,
    },
    template: {
      type: String,
    },
    recipients: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'has to be unique.' });
  },
  // afterModelCreate(model, schema) {}, // Implement logic after model create in here
});

module.exports = FormModel;
