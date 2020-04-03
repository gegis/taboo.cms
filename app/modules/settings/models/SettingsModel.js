const { config } = require('@taboo/cms-core');
const uniqueValidator = require('mongoose-unique-validator');

module.exports = {
  connection: 'mongodb',
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    key: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'is required'],
      default: 'generic',
    },
    type: {
      type: String,
      required: [true, 'is required'],
      enum: config.settings.types,
      default: 'string',
    },
    value: {
      type: String,
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'must be unique' });
  },
};
