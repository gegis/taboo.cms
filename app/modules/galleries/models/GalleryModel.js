const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const SchemaTypes = MongoDbAdapter.getSchemaTypes();

const GalleryModel = MongoDbAdapter.setupModel('Gallery', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    title: {
      type: String,
      required: [true, 'is required'],
    },
    images: [{ type: SchemaTypes.ObjectId, ref: 'Upload' }],
    meta: {
      type: Object,
    },
    published: {
      type: Boolean,
      default: false,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
});

module.exports = GalleryModel;
