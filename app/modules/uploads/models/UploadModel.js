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
    url: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    size: {
      type: Number,
      required: [true, 'is required'],
    },
    path: {
      type: String,
      required: [true, 'is required'],
    },
    type: {
      type: String,
      required: [true, 'is required'],
    },
    documentType: {
      type: String,
    },
    isUserDocument: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
};
