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
    images: [{ type: Schema.Types.ObjectId, ref: 'Upload' }],
    meta: {
      type: Object,
    },
    published: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
    },
  },
};
