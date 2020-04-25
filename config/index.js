const server = require('./server');
const i18n = require('./i18n');
const api = require('./api');
const db = require('./db');
const mailer = require('./mailer');
const logger = require('./logger');
const gulp = require('./gulp');
const templates = require('./templates');
const sockets = require('./sockets');
const verificationStatuses = ['new', 'pending', 'failed', 'approved'];
const userDocumentTypes = ['documentPersonal1', 'documentPersonal2', 'documentIncorporation'];
const settingsTypes = ['string', 'integer', 'float', 'json', 'boolean'];

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  debug: false,
  auth: {
    maxLoginAttempts: 3,
    passwordResetExpiryTime: 1000 * 60 * 60 * 24,
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
    signInEnabled: true,
    signUpEnabled: true,
    verificationStatuses: verificationStatuses,
    documentTypes: userDocumentTypes,
  },
  sockets: sockets,
  client: {
    metaTitle: 'Taboo CMS',
    admin: {
      language: 'en',
      locale: 'en-gb',
    },
    language: 'en',
    locale: 'en-gb',
    languages: i18n.languages,
    dateFormat: 'DD/MM/YYYY',
    dateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
    userACLRefreshThreshold: 1000 * 60 * 5,
    userInfoUpdateInterval: 1000 * 60,
    userVerificationStatuses: verificationStatuses,
    userDocumentTypes: userDocumentTypes,
    templates: {
      defaultTemplate: templates.defaultTemplate,
      previewRoute: templates.previewRoute,
      socketsEvents: {
        templatePreviewEmit: templates.socketsEvents.templatePreviewEmit,
        templatePreviewReceive: templates.socketsEvents.templatePreviewReceive,
      },
    },
    settings: {
      types: settingsTypes,
    },
  },
  settings: {
    types: settingsTypes,
  },
  templates: templates,
  server: server,
  i18n: i18n,
  api: api,
  db: db,
  mailer: mailer,
  logger: logger,
  gulp: gulp,
};
