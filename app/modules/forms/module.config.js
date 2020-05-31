const FormsAdminController = require('./controllers/FormsAdminController');
const FormsController = require('./controllers/FormsController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [''],
  npmDependencies: [''],
  acl: {
    resources: ['admin.forms.view', 'admin.forms.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/api/forms/:_id',
      action: FormsController.getOne,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'POST',
      path: '/api/forms/:formId',
      action: FormsController.submit,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/admin/forms',
      action: FormsAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.forms.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/forms/entries/:formId',
      action: FormsAdminController.getEntries,
      policies: ['isAdmin'],
      order: 99,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.forms.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/forms/count',
      action: FormsAdminController.count,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.forms.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/forms/:id',
      action: FormsAdminController.findById,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.forms.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/forms',
      action: FormsAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.forms.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/forms/:id',
      action: FormsAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.forms.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/forms/:id',
      action: FormsAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.forms.manage',
      },
    },
  ],
};
