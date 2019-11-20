const UploadsAdminController = require('./controllers/UploadsAdminController');
const UploadsController = require('./controllers/UploadsController');

module.exports = {
  acl: {
    resources: ['admin.uploads.view', 'admin.uploads.manage', 'api.uploads.userFiles'],
  },
  routes: [
    {
      method: 'GET',
      path: '/secure-files/:id',
      action: UploadsController.serveSecureUserFiles,
      policies: ['isUser'],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'POST',
      path: '/api/uploads/files',
      action: UploadsController.uploadUserFile,
      policies: ['isUser'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'api.uploads.userFiles',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/uploads',
      action: UploadsAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.uploads.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/uploads/count',
      action: UploadsAdminController.count,
      policies: ['isAdmin'],
      order: 1000,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.uploads.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/uploads/:id',
      action: UploadsAdminController.findById,
      policies: ['isAdmin'],
      order: 1001,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.uploads.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/uploads',
      action: UploadsAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.uploads.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/uploads/:id',
      action: UploadsAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.uploads.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/uploads/:id',
      action: UploadsAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.uploads.manage',
      },
    },
  ],
};
