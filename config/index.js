const server = require('./server');
const i18n = require('./i18n');
const api = require('./api');
const db = require('./db');
const mailer = require('./mailer');
const logger = require('./logger');
const gulp = require('./gulp');
const verificationStatuses = ['new', 'pending', 'failed', 'approved'];
const userDocumentTypes = ['documentPersonal1', 'documentPersonal2', 'documentIncorporation'];
const settingsTypes = ['string', 'integer', 'float', 'object', 'boolean'];
const languages = [
  { code: 'en', title: 'English' },
  { code: 'it', title: 'Italian' },
];
const socketsPath = '/socket.io';

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  debug: false,
  auth: {
    maxLoginAttempts: 3,
    passwordResetExpiryTime: 1000 * 60 * 60 * 24,
  },
  admin: {
    cms: {
      title: 'Taboo Solutions Admin',
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
    signInEnabled: true,
    signUpEnabled: true,
    verificationStatuses: verificationStatuses,
    documentTypes: userDocumentTypes,
  },
  sockets: {
    enabled: true,
    port: null, // set value only if port is different from server port
    path: socketsPath,
    rooms: ['users'],
  },
  client: {
    metaTitle: 'Taboo CMS',
    admin: {
      language: 'en',
      locale: 'en-gb',
    },
    language: 'en',
    locale: 'en-gb',
    languages: languages,
    dateFormat: 'DD/MM/YYYY',
    dateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
    userACLRefreshThreshold: 1000 * 60 * 5,
    userInfoUpdateInterval: 1000 * 60,
    userVerificationStatuses: verificationStatuses,
    userDocumentTypes: userDocumentTypes,
    settings: {
      types: settingsTypes,
    },
  },
  settings: {
    types: settingsTypes,
  },
  server: server,
  i18n: i18n,
  api: api,
  db: db,
  mailer: mailer,
  logger: logger,
  gulp: gulp,
};
