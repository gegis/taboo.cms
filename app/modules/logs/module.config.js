const LogsApiAdminController = require('./controllers/LogsApiAdminController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [''],
  npmDependencies: [''],
  acl: {
    resources: ['admin.logs.api.view', 'admin.logs.api.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/api/admin/logs/api',
      action: LogsApiAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.logs.api.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/logs/api/count',
      action: LogsApiAdminController.count,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.logs.api.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/logs/api/:id',
      action: LogsApiAdminController.findById,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.logs.api.view',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/logs/api/:id',
      action: LogsApiAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.logs.api.manage',
      },
    },
  ],
};
