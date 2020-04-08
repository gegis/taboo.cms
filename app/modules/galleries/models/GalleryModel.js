const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');

const modelConfig = {
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
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
};

module.exports = MongoDbAdapter.setupModel('Gallery', modelConfig);
