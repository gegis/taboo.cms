const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const { config } = require('@taboo/cms-core');
const MongoDbAdapter = require('modules/db/adapters/MongoDbAdapter');
const SchemaTypes = MongoDbAdapter.getSchemaTypes();

const UserModel = MongoDbAdapter.setupModel('User', {
  schemaOptions: {
    timestamps: true,
  },
  schema: {
    firstName: {
      type: String,
      required: [true, 'is required'],
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'is required'],
      unique: true,
      uniqueCaseInsensitive: true,
      validate: [validator.isEmail, 'Invalid Email'],
      lowercase: true,
    },
    companyName: {
      type: String,
    },
    businessAccount: {
      type: Boolean,
      default: false,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    postCode: {
      type: String,
    },
    password: {
      type: String,
    },
    passwordReset: {
      type: String,
    },
    passwordResetRequested: {
      type: Date,
    },
    phone: {
      type: String,
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    profilePicture: {
      type: SchemaTypes.ObjectId,
      ref: 'Upload',
    },
    documentPersonal1: {
      type: SchemaTypes.ObjectId,
      ref: 'Upload',
    },
    documentPersonal2: {
      type: SchemaTypes.ObjectId,
      ref: 'Upload',
    },
    documentIncorporation: {
      type: SchemaTypes.ObjectId,
      ref: 'Upload',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: config.users.verificationStatuses,
      default: 'new',
    },
    verificationNote: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: false,
    },
    roles: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'Role',
      },
    ],
    lastLogin: {
      type: Date,
    },
    apiKey: {
      type: String,
      default: '',
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'is already taken' });
  },
  // afterModelCreate(model, schema) {}, // Implement logic after model create in here
});

module.exports = UserModel;
