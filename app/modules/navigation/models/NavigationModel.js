const uniqueValidator = require('mongoose-unique-validator');

module.exports = {
  connection: 'mongodb',
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
};
