module.exports = {
  connection: 'mongodb',
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    key: {
      type: String,
    },
    value: {
      type: Object,
    },
  },
};
