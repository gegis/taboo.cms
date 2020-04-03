const SettingsAdminController = require('./controllers/SettingsAdminController');
const SettingsController = require('./controllers/SettingsController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [''],
  npmDependencies: [''],
  acl: {
    resources: ['admin.settings.view', 'admin.settings.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/api/settings/:key',
      action: SettingsController.getSettings,
      order: 5000,
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/acl/enabled',
      action: SettingsController.getACLEnabled,
      order: 5000,
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/admin/settings/:key',
      action: SettingsAdminController.getSettings,
      policies: ['isAdmin'],
      order: 5000,
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/settings/:key',
      action: SettingsAdminController.setSettings,
      policies: ['isAdmin'],
      order: 5000,
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/admin/settings',
      action: SettingsAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.settings.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/settings/count',
      action: SettingsAdminController.count,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.settings.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/settings/:id',
      action: SettingsAdminController.findById,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.settings.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/settings',
      action: SettingsAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.settings.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/settings/:id',
      action: SettingsAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.settings.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/settings/:id',
      action: SettingsAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.settings.manage',
      },
    },
  ],
};
