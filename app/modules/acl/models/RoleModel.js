const uniqueValidator = require('mongoose-unique-validator');
const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const UserModel = require('modules/users/models/UserModel');

const RoleModel = MongoDbAdapter.setupModel('Role', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    name: {
      type: String,
      required: [true, 'is required'],
      unique: true,
    },
    resources: {
      type: Array,
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'has to be unique.' });
    schema.post('remove', async doc => {
      await UserModel.updateMany({ roles: doc._id }, { $pull: { roles: doc._id } });
    });
  },
});

module.exports = RoleModel;
