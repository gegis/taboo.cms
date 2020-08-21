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
    isUserFile: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isDocument: {
      type: Boolean,
      default: false,
    },
    documentName: {
      type: String,
      default: '',
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
