const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const uniqueValidator = require('mongoose-unique-validator');

const TemplateModel = MongoDbAdapter.setupModel('Template', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    preview: {
      type: String,
    },
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
    languageSettings: {
      type: Object,
    },
    style: {
      type: String,
      default: '',
    },
    default: {
      type: Boolean,
      default: false,
    },
    navigationPreload: {
      type: Array,
      default: [],
    },
    userNavigationPreload: {
      type: Array,
      default: [],
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'has to be unique.' });
    schema.index({ default: 1 }, { unique: true, partialFilterExpression: { default: true } });
  },
});

module.exports = TemplateModel;
