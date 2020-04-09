module.exports = {
  port: process.env.PORT || 3000,
  secretKeys: ['REPLACE-ME-123456', '654321-REPLACE-ME'],
  globalPolicies: ['acl'],
  views: {
    extension: 'html',
    defaultLayout: 'default',
    defaultErrorLayout: 'error',
    defaultErrorView: 'index',
  },
  session: {
    store: 'modules/db/adapters/SessionCustomStore', // 'cookie' or can be a relative path 'modules/db/adapters/CustomStore' to custom class that implements destroy, set, get methods
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
  cache: {
    enabled: true,
    cachePath: './data/app-cache',
    cacheIds: {
      pages: 'pages.json',
      navigation: 'navigation.json',
    },
  },
};
