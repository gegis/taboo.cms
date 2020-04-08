const uniqueValidator = require('mongoose-unique-validator');
const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const SchemaTypes = MongoDbAdapter.getSchemaTypes();

const PageModel = MongoDbAdapter.setupModel('Page', {
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
    pages: [{ type: SchemaTypes.ObjectId, ref: 'Page' }],
    galleries: [{ type: SchemaTypes.ObjectId, ref: 'Gallery' }],
    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'has to be unique.' });
  },
});

module.exports = PageModel;
