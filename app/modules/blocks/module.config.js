const BlocksAdminController = require('./controllers/BlocksAdminController');
const BlocksController = require('./controllers/BlocksController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [''],
  npmDependencies: [''],
  acl: {
    resources: ['admin.blocks.view', 'admin.blocks.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/blocks',
      action: BlocksController.index,
      policies: ['loadNavigation', 'isUser'],
    },
    {
      method: 'GET',
      path: '/api/blocks',
      action: BlocksController.getAll,
      policies: ['isUser'],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/admin/blocks',
      action: BlocksAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.blocks.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/blocks/count',
      action: BlocksAdminController.count,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.blocks.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/blocks/:id',
      action: BlocksAdminController.findById,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.blocks.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/blocks',
      action: BlocksAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.blocks.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/blocks/:id',
      action: BlocksAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.blocks.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/blocks/:id',
      action: BlocksAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.blocks.manage',
      },
    },
  ],
};
