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
      required: [true, 'is required'],
    },
    email: {
      type: String,
      required: [true, 'is required'],
      unique: true,
      uniqueCaseInsensitive: true,
      validate: [validator.isEmail, 'Invalid Email'],
      lowercase: true,
    },
    // username: {
    //   type: String,
    //   required: [true, 'is required'],
    //   unique: true,
    //   uniqueCaseInsensitive: true,
    //   validate: [/^[\w]+$/, "Only alphanumeric symbols a-z, A-Z, 0-9 and '_'"],
    // },
    country: {
      type: String,
      required: [true, 'is required'],
    },
    password: {
      type: String,
    },
    agreeToTerms: {
      type: Boolean,
      default: false,
    },
    exported: {
      type: Boolean,
      default: false,
    },
    passwordReset: {
      type: String,
    },
    passwordResetRequested: {
      type: Date,
    },
    accountVerificationCode: {
      type: String,
    },
    accountVerificationCodeRequested: {
      type: Date,
    },
    profilePicture: {
      type: SchemaTypes.ObjectId,
      ref: 'Upload',
    },
    emailVerified: {
      type: Boolean,
      default: false,
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
    documentPersonal1: {
      type: SchemaTypes.ObjectId,
      ref: 'Upload',
    },
    documentPersonal2: {
      type: SchemaTypes.ObjectId,
      ref: 'Upload',
    },
  },
  afterSchemaCreate(schema) {
    schema.plugin(uniqueValidator, { message: 'is already taken' });
  },
  // afterModelCreate(model, schema) {}, // Implement logic after model create in here
});

module.exports = UserModel;
