const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    enabled: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  // afterSchemaCreate(schema) {}, // Implement logic after schema create in here
  // afterModelCreate(model, schema) {}, // Implement logic after model create in here
};
