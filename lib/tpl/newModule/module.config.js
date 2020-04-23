const ModuleNameAdminController = require('./controllers/ModuleNameAdminController');
const ModuleNameController = require('./controllers/ModuleNameController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [''],
  npmDependencies: [''],
  acl: {
    resources: ['admin.moduleName.view', 'admin.moduleName.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/moduleName',
      action: ModuleNameController.index,
      policies: ['isUser'],
    },
    {
      method: 'GET',
      path: '/api/moduleName',
      action: ModuleNameController.getAll,
      policies: ['isUser'],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/admin/moduleName',
      action: ModuleNameAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.moduleName.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/moduleName/count',
      action: ModuleNameAdminController.count,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.moduleName.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/moduleName/:id',
      action: ModuleNameAdminController.findById,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.moduleName.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/moduleName',
      action: ModuleNameAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.moduleName.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/moduleName/:id',
      action: ModuleNameAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.moduleName.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/moduleName/:id',
      action: ModuleNameAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.moduleName.manage',
      },
    },
  ],
};
