const server = require('./server');
const i18n = require('./i18n');
const api = require('./api');
const db = require('./db');
const mailer = require('./mailer');
const logger = require('./logger');
const gulp = require('./gulp');
const sockets = require('./sockets');
const client = require('./client');
const shared = require('./shared');

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  debug: false,
  auth: {
    maxLoginAttempts: 3,
    passwordResetExpiryTime: 1000 * 60 * 60 * 24,
    jwt: {
      secret: 'REPLACE-ME-123456789',
      expiresIn: 60 * 60, // time in seconds
    },
  },
  admin: {
    cms: {
      title: 'Taboo CMS Admin',
      adminRoleName: 'Administrator',
      userRoleName: 'User',
      userAclResources: ['api.uploads.userFiles'],
      initialUser: {
        firstName: 'Admin',
        lastName: 'Taboo',
        email: 'admin@taboo.solutions',
        pass: 'admin',
      },
    },
  },
  users: {
    signInEnabled: shared.usersSignInEnabled,
    signUpEnabled: shared.usersSignUpEnabled,
    verificationStatuses: shared.verificationStatuses,
    documentNames: shared.userDocumentNames,
    passwordMinLength: shared.userPasswordMinLength,
  },
  sockets: sockets,
  client: client,
  settings: {
    types: shared.settingsTypes,
  },
  templates: shared.templates,
  server: server,
  i18n: i18n,
  api: api,
  db: db,
  mailer: mailer,
  logger: logger,
  gulp: gulp,
  countries: {
    defaultCountryIso: 'GB',
  },
};
