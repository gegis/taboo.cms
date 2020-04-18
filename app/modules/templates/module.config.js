const { config } = require('@taboo/cms-core');
const TemplatesAdminController = require('./controllers/TemplatesAdminController');
const TemplatesController = require('./controllers/TemplatesController');
const TemplatesService = require('./services/TemplatesService');
const { templates: { previewRoute = '/:language?/templates/preview/:template' } = {} } = config;

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [''],
  npmDependencies: [''],
  acl: {
    resources: ['admin.templates.view', 'admin.templates.manage'],
  },
  afterModulesSetup: TemplatesService.afterModulesSetup,
  routes: [
    {
      method: 'GET',
      path: previewRoute,
      action: TemplatesController.preview,
      policies: ['i18n', 'loadNavigation', 'isAdmin'],
    },
    {
      method: 'GET',
      path: '/api/templates/default',
      action: TemplatesController.getDefault,
      policies: [],
      order: 100,
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/templates/:name',
      action: TemplatesController.findByName,
      policies: [],
      order: 101,
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/admin/templates/image-preview/:template',
      action: TemplatesAdminController.imagePreview,
      policies: ['isAdmin'],
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
