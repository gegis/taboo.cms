const { Model } = require('@taboo/cms-core');
const uniqueValidator = require('mongoose-unique-validator');

module.exports = {
  connection: 'mongodb',
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
      await Model('users.User').updateMany({ roles: doc._id }, { $pull: { roles: doc._id } });
    });
  },
  // afterModelCreate(model, schema) {}, // Implement logic after model create in here
};
