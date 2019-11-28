const UsersController = require('./controllers/UsersController');
const UsersAdminController = require('./controllers/UsersAdminController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: ['core'],
  npmDependencies: [
    'mongoose',
    'validator',
    'mongoose-unique-validator',
    'moment',
    'uuid',
    'bcrypt',
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
    resources: ['admin.users.view', 'admin.users.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/my-profile',
      action: UsersController.userLandingPage,
      policies: ['isUser'],
    },
    {
      method: 'GET',
      path: '/account-verify',
      action: UsersController.userLandingPage,
      policies: ['isUser'],
    },
    {
      method: 'GET',
      path: '/reset-password',
      action: UsersController.userLandingPage,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/change-password/:userId/:token',
      action: UsersController.userLandingPage,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'POST',
      path: '/api/login',
      action: UsersController.login,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/logout',
      action: UsersController.logout,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'POST',
      path: '/api/reset-password',
      action: UsersController.resetPassword,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'POST',
      path: '/api/change-password',
      action: UsersController.changePassword,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'POST',
      path: '/api/users/register',
      action: UsersController.register,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/users/current',
      action: UsersController.getCurrent,
      policies: ['isUser'],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'PUT',
      path: '/api/users/current',
      action: UsersController.updateCurrent,
      policies: ['isUser'],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'POST',
      path: '/api/users/search',
      action: UsersController.searchUser,
      policies: ['isUser'],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/auth',
      action: UsersController.getAuth,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/admin/login',
      action: UsersAdminController.admin,
      policies: ['i18nAdmin'],
    },
    {
      method: 'GET',
      path: '/admin/reset-password',
      action: UsersAdminController.admin,
      policies: ['i18nAdmin'],
    },
    {
      method: 'GET',
      path: '/admin/change-password/:userId/:token',
      action: UsersAdminController.admin,
      policies: ['i18nAdmin'],
    },
    {
      method: 'GET',
      path: '/api/admin/users',
      action: UsersAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.users.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/users/count',
      action: UsersAdminController.count,
      policies: ['isAdmin'],
      order: 1000,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.users.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/users/:id',
      action: UsersAdminController.findById,
      policies: ['isAdmin'],
      order: 1001,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.users.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/users',
      action: UsersAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.users.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/users/:id',
      action: UsersAdminController.update,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.users.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/users/:id',
      action: UsersAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.users.manage',
      },
    },
  ],
};
