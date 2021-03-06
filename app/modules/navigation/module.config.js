const NavigationAdminController = require('./controllers/NavigationAdminController');
const NavigationController = require('./controllers/NavigationController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [''],
  npmDependencies: [''],
  acl: {
    resources: ['admin.navigation.view', 'admin.navigation.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/api/navigation/:name',
      action: NavigationController.findOneByName,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/admin/navigation',
      action: NavigationAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.navigation.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/navigation/count',
      action: NavigationAdminController.count,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.navigation.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/navigation/:id',
      action: NavigationAdminController.findById,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.navigation.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/navigation/name/:name',
      action: NavigationAdminController.findOneByName,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.navigation.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/navigation',
      action: NavigationAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.navigation.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/navigation/reorder',
      action: NavigationAdminController.reorder,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.navigation.view',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/navigation/:id',
      action: NavigationAdminController.update,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.navigation.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/navigation/:id',
      action: NavigationAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.navigation.manage',
      },
    },
  ],
};
