const PagesAdminController = require('./controllers/PagesAdminController');
const PagesController = require('./controllers/PagesController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: ['core'],
  npmDependencies: [
    'mongoose-unique-validator',
    'mongoose',
    'axios',
    'react',
    'react-router-dom',
    'prop-types',
    'recompose',
    'mobx',
    'mobx-react',
    'js-beautify',
    'rsuite',
  ],
  acl: {
    resources: ['admin.pages.view', 'admin.pages.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/api/admin/pages',
      action: PagesAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.pages.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/pages/count',
      action: PagesAdminController.count,
      policies: ['isAdmin'],
      order: 1000,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.pages.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/pages/previous/:id',
      action: PagesAdminController.getPrevious,
      policies: ['isAdmin'],
      order: 1000,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.pages.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/pages/:id',
      action: PagesAdminController.findById,
      policies: ['isAdmin'],
      order: 1001,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.pages.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/pages',
      action: PagesAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.pages.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/pages/:id',
      action: PagesAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.pages.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/pages/:id',
      action: PagesAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.pages.manage',
      },
    },
    {
      method: 'GET',
      path: '/api/pages',
      action: PagesController.getPageJson,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
  ],
};
