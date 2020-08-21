const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const uniqueValidator = require('mongoose-unique-validator');

const EmailModel = MongoDbAdapter.setupModel('Email', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    action: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    language: {
      type: String,
    },
    from: {
      type: String,
      required: [true, 'is required'],
    },
    subject: {
      type: String,
      required: [true, 'is required'],
    },
    body: {
      type: String,
      required: [true, 'is required'],
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'already exists.' });
  },
  // afterModelCreate(model, schema) {}, // Implement logic after model create in here
});

module.exports = EmailModel;
