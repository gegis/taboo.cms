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
    value: {
      type: Object,
    },
    public: {
      type: Boolean,
      default: false,
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'is already taken' });
  },
};
