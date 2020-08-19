const EmailsAdminController = require('./controllers/EmailsAdminController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [''],
  npmDependencies: [''],
  acl: {
    resources: ['admin.emails.view', 'admin.emails.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/api/admin/emails',
      action: EmailsAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.emails.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/emails/count',
      action: EmailsAdminController.count,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.emails.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/emails/:id',
      action: EmailsAdminController.findById,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.emails.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/emails',
      action: EmailsAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.emails.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/emails/:id',
      action: EmailsAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.emails.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/emails/:id',
      action: EmailsAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.emails.manage',
      },
    },
  ],
};
