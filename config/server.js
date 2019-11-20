const SessionCustomStore = require('../app/db/adapters/SessionCustomStore');

module.exports = {
  port: process.env.PORT || 3000,
  secretKeys: ['REPLACE-ME-123456', '654321-REPLACE-ME'],
  globalPolicies: ['acl'],
  views: {
    defaultPageTitle: 'Taboo Solutions',
    extension: 'html',
    defaultLayout: 'default',
    defaultErrorLayout: 'error',
    defaultErrorView: 'index',
  },
  session: {
    store: SessionCustomStore, // default is 'cookie' or can be custom class that implements destroy, set, get methods
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
  },
  silentErrors: ['UnauthorizedError', 'BadRequestError', 'ForbiddenError', 'ValidationError', 'NotFoundError'],
  uploads: {
    serveStaticDir: '../user-uploads',
    uploadsDir: '../user-uploads/user-files',
    urlPath: '/user-files',
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
    secureUploadsDir: '../user-uploads-secure',
    secureUrlPath: '/secure-files',
    secureAllowedTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf'],
    secureAllowedImageTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
    maxFileSize: 500 * 1024 * 1024,
    appendTimestamp: true,
  },
};
