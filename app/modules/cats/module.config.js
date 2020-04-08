const CatsAdminController = require('./controllers/CatsAdminController');
const CatsController = require('./controllers/CatsController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [''],
  npmDependencies: [''],
  acl: {
    resources: ['admin.cats.view', 'admin.cats.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/cats',
      action: CatsController.index,
      policies: ['loadNavigation'],
    },
    {
      method: 'GET',
      path: '/api/cats',
      action: CatsController.getAll,
      policies: ['isUser'],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/admin/cats',
      action: CatsAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.cats.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/cats/count',
      action: CatsAdminController.count,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.cats.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/cats/:id',
      action: CatsAdminController.findById,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.cats.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/cats',
      action: CatsAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.cats.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/cats/:id',
      action: CatsAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.cats.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/cats/:id',
      action: CatsAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.cats.manage',
      },
    },
  ],
};
