const uniqueValidator = require('mongoose-unique-validator');
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
    url: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    body: {
      type: String,
      required: [true, 'is required'],
    },
    layout: {
      type: String,
    },
    background: {
      type: String,
    },
    meta: {
      type: Object,
    },
    language: {
      type: String,
    },
    variables: {
      type: Object,
    },
    published: {
      type: Boolean,
      default: false,
    },
    pages: [{ type: Schema.Types.ObjectId, ref: 'Page' }],
    galleries: [{ type: Schema.Types.ObjectId, ref: 'Gallery' }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'has to be unique.' });
  },
};

module.exports = MongoDbAdapter.setupModel('Page', modelConfig);
