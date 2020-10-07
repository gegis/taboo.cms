const RolesAdminController = require('./controllers/RolesAdminController');
const ResourcesController = require('./controllers/ResourcesController');
const ACLService = require('./services/ACLService');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: ['core'],
  npmDependencies: [
    'mongoose-unique-validator',
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
    isAllowedImplementation: ACLService.isAllowed,
    resources: ['admin.acl.view', 'admin.acl.manage'],
  },
  afterModulesSetup: ACLService.afterModulesSetup,
  routes: [
    {
      method: 'GET',
      path: '/api/acl/resources',
      action: ResourcesController.getAll,
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/acl/resources/user',
      action: ResourcesController.getUserACL,
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/admin/acl/roles',
      action: RolesAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.acl.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/acl/roles/:id',
      action: RolesAdminController.findById,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.acl.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/acl/roles',
      action: RolesAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.acl.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/acl/roles/:id',
      action: RolesAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.acl.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/acl/roles/:id',
      action: RolesAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.acl.manage',
      },
    },
  ],
};
