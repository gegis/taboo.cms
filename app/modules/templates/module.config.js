const TemplatesAdminController = require('./controllers/TemplatesAdminController');
const TemplatesController = require('./controllers/TemplatesController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [''],
  npmDependencies: [''],
  acl: {
    resources: ['admin.templates.view', 'admin.templates.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/:language?/templates/preview/:template',
      action: TemplatesController.preview,
      policies: ['loadNavigation', 'isAdmin'],
    },
    {
      method: 'GET',
      path: '/api/admin/templates',
      action: TemplatesAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.templates.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/templates/count',
      action: TemplatesAdminController.count,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.templates.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/templates/:id',
      action: TemplatesAdminController.findById,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.templates.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/templates',
      action: TemplatesAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.templates.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/templates/:id',
      action: TemplatesAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.templates.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/templates/:id',
      action: TemplatesAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.templates.manage',
      },
    },
  ],
};
