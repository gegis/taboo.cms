const server = require('./server');
const i18n = require('./i18n');
const api = require('./api');
const db = require('./db');
const mailer = require('./mailer');
const logger = require('./logger');
const navigation = require('./navigation');
const gulp = require('./gulp');
const verificationStatuses = ['new', 'pending', 'failed', 'approved'];
const userDocumentTypes = ['documentPersonal1', 'documentPersonal2', 'documentIncorporation'];
const languages = [
  { code: 'en', title: 'English' },
  { code: 'it', title: 'Italian' },
];
const socketsPath = '/socket.io';

module.exports = {
  environment: 'development',
  debug: false,
  auth: {
    maxLoginAttempts: 3,
    passwordResetExpiryTime: 1000 * 60 * 60 * 24,
  },
  admin: {
    title: 'Taboo Solutions Admin',
    initialUser: {
      firstName: 'Admin',
      lastName: 'Taboo',
      email: 'admin@taboo.solutions',
      pass: 'admin',
    },
  },
  navigation: navigation,
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
    navigationTypes: navigation.types,
  },
  server: server,
  i18n: i18n,
  api: api,
  db: db,
  mailer: mailer,
  logger: logger,
  gulp: gulp,
};
