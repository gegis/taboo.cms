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
    blocks: [
      {
        name: {
          type: String,
          required: [true, 'is required'],
        },
        props: Object,
        template: Object,
      },
    ],
    template: {
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
    published: {
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

module.exports = PageModel;
