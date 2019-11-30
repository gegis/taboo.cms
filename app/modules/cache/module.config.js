const CacheAdminController = require('./controllers/CacheAdminController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [],
  npmDependencies: ['flat-cache'],
  acl: {
    resources: ['admin.cache.clear'],
  },
  routes: [
    {
      method: 'GET',
      path: '/api/cache/clear',
      action: CacheAdminController.clearAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.cache.clear',
      },
    },
  ],
};
