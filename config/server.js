const shared = require('./shared');

module.exports = {
  port: process.env.PORT || shared.port,
  secretKeys: ['REPLACE-ME-123456', '654321-REPLACE-ME'],
  globalPolicies: ['acl', 'i18n'],
  templates: {
    themesPath: 'app/themes',
    extension: 'ejs',
    templatesDir: 'templates',
    emailsDir: 'emails',
    adminTheme: 'admin',
    defaultTheme: 'standard',
    layoutFile: 'layout',
    errorsDir: 'error',
    defaultErrorView: 'index',
  },
  session: {
    // 'cookie' or can be a root dir relative path 'app/modules/db/adapters/SessionCustomStore'
    // to custom class that implements destroy, set and get methods
    store: 'app/modules/db/adapters/SessionCustomStore',
    options: {
      key: 'taboo.sid',
      maxAge: 1000 * 60 * 60 * 4, //4h
      autoCommit: true,
      overwrite: false,
      httpOnly: true,
      signed: true,
      rolling: true,
      renew: false,
      secure: false,
      encrypt: true,
    },
    rememberMeMaxAge: 1000 * 60 * 60 * 24 * 14, // 2 weeks
  },
  silentErrors: ['UnauthorizedError', 'BadRequestError', 'ForbiddenError', 'ValidationError', 'NotFoundError'],
  uploads: {
    serveStaticPath: '../cms-uploads',
    uploadsPath: '../cms-uploads/files',
    urlPath: '/files',
    allowedTypes: [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/gif',
      'video/webm',
      'video/mp4',
      'video/x-matroska',
      'application/pdf',
    ],
    maxFileSize: shared.maxFileSize,
    appendTimestamp: true,
    userUploadsPath: '../cms-uploads/user-files',
    userUrlPath: '/user-files',
    userAllowedDocumentTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf'],
    userAllowedImageTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
    userMaxFileSize: shared.userMaxFileSize,
    userMaxGifFileSize: shared.userMaxGifFileSize,
    imageSizes: {
      defaultSize: {
        width: 685,
      },
      xlSize: {
        width: 120,
        height: 120,
      },
      lgSize: {
        width: 80,
        height: 80,
      },
      mdSize: {
        width: 60,
        height: 60,
      },
      smSize: {
        width: 40,
        height: 40,
      },
      xsSize: {
        width: 32,
        height: 32,
      },
    },
  },
  cache: {
    enabled: true,
    cachePath: './data/app-cache',
    cacheIds: {
      settings: 'settings.json',
      pages: 'pages.json',
      navigation: 'navigation.json',
      templates: 'templates.json',
    },
  },
};
