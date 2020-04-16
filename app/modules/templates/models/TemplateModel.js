const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const uniqueValidator = require('mongoose-unique-validator');

const TemplateModel = MongoDbAdapter.setupModel('Template', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    name: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    settings: {
      type: Object,
    },
    layout: {
      type: String,
    },
    variables: {
      type: Object,
    },
    default: {
      type: Boolean,
      default: true,
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'has to be unique.' });
    schema.index({ default: 1 }, { unique: true, partialFilterExpression: { default: true } });
  },
});

module.exports = TemplateModel;
