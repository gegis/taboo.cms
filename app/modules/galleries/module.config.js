const GalleriesAdminController = require('./controllers/GalleriesAdminController');
const GalleriesController = require('./controllers/GalleriesController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: ['core'],
  npmDependencies: [
    'mongoose',
    'axios',
    'react',
    'react-router-dom',
    'prop-types',
    'recompose',
    'mobx',
    'mobx-react',
    'rsuite',
  ],
  acl: {
    resources: ['admin.galleries.view', 'admin.galleries.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/api/galleries/:id',
      action: GalleriesController.getOneById,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
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
      action: GalleriesAdminController.countFiltered,
      policies: ['isAdmin'],
      order: 100,
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
      order: 101,
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
