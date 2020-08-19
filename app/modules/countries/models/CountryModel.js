const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');

const CountryModel = MongoDbAdapter.setupModel('Country', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    name: {
      type: String,
      required: [true, 'is required'],
    },
    iso: {
      type: String,
      required: [true, 'is required'],
    },
    imageUrl: {
      type: String,
    },
    allowUserSelect: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    sort: {
      type: Number,
      default: -1,
    },
  },
});

module.exports = CountryModel;
