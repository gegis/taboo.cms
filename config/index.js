const server = require('./server');
const i18n = require('./i18n');
const api = require('./api');
const db = require('./db');
const mailer = require('./mailer');
const logger = require('./logger');
const verificationStatuses = ['new', 'pending', 'failed', 'approved'];
const userDocumentTypes = ['documentPassport1', 'documentPassport2', 'documentIncorporation'];
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
  users: {
    verificationStatuses: verificationStatuses,
    documentTypes: userDocumentTypes,
  },
  sockets: {
    enabled: true,
    path: socketsPath,
    rooms: ['users'],
  },
  client: {
    admin: {
      language: 'en',
      locale: 'en-gb',
    },
    language: 'en',
    locale: 'en-gb',
    dateFormat: 'DD/MM/YYYY',
    dateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
    sockets: {
      path: socketsPath,
    },
    userACLRefreshThreshold: 1000 * 60 * 5,
    userInfoUpdateInterval: 1000 * 60,
    userVerificationStatuses: verificationStatuses,
    userDocumentTypes: userDocumentTypes,
  },
  server: server,
  i18n: i18n,
  api: api,
  db: db,
  mailer: mailer,
  logger: logger,
};
