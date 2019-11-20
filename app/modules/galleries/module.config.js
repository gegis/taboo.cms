const GalleriesAdminController = require('./controllers/GalleriesAdminController');

module.exports = {
  acl: {
    resources: ['admin.galleries.view', 'admin.galleries.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/api/admin/galleries',
      action: GalleriesAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.galleries.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/galleries/count',
      action: GalleriesAdminController.count,
      policies: ['isAdmin'],
      order: 1000,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.galleries.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/galleries/:id',
      action: GalleriesAdminController.findById,
      policies: ['isAdmin'],
      order: 1001,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.galleries.view',
      },
    },

    {
      method: 'POST',
      path: '/api/admin/galleries',
      action: GalleriesAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.galleries.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/galleries/:id',
      action: GalleriesAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.galleries.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/galleries/:id',
      action: GalleriesAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.galleries.manage',
      },
    },
  ],
};
