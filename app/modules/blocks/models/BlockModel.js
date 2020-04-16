const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const SchemaTypes = MongoDbAdapter.getSchemaTypes();
const uniqueValidator = require('mongoose-unique-validator');

const BlockModel = MongoDbAdapter.setupModel('Block', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    name: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    body: {
      type: String,
      required: [true, 'is required'],
    },
    type: {
      type: String,
    },
    layout: {
      type: String,
    },
    language: {
      type: String,
    },
    variables: {
      type: Object,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
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

module.exports = BlockModel;
