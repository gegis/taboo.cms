const {config} = require('@taboo/cms-core');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {
  connection: 'mongodb',
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    title: {
      type: String,
      required: [true, 'is required'],
    },
    type: {
      type: String,
      enum: config.navigation.types,
      default: 'website',
    },
    url: {
      type: String,
    },
    pageLink: {
      type: Schema.Types.ObjectId,
      ref: 'Page',
    },
    language: {
      type: String,
    },
    sort: {
      type: Number,
      default: -1,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  // afterSchemaCreate(schema) {}, // Implement logic after schema create in here
  // afterModelCreate(model, schema) {}, // Implement logic after model create in here
};
