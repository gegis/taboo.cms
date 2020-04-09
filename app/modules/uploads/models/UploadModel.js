const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const SchemaTypes = MongoDbAdapter.getSchemaTypes();

const UploadModel = MongoDbAdapter.setupModel('Upload', {
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
      default: '',
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
      default: '',
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
});

module.exports = UploadModel;
