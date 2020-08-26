const UsersController = require('./controllers/UsersController');
const UsersAdminController = require('./controllers/UsersAdminController');

const AdminHelper = require('modules/core/ui/helpers/AdminHelper');

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
      path: '/sign-up',
      action: UsersController.signUp,
      policies: [],
    },
    {
      method: 'GET',
      path: '/verify-email/:userId/:token',
      action: UsersController.verifyEmail,
      policies: [],
    },
    {
      method: 'GET',
      path: '/sign-in',
      action: UsersController.signIn,
      policies: [],
    },
    {
      method: 'GET',
      path: '/account-settings',
      action: UsersController.accountSettings,
      policies: ['isUser'],
    },
    {
      method: 'GET',
      path: '/verify-docs',
      action: UsersController.verifyDocs,
      policies: ['isUser'],
    },
    {
      method: 'GET',
      path: '/reset-password',
      action: UsersController.resetPassword,
      policies: [],
    },
    {
      method: 'GET',
      path: '/change-password/:userId/:token',
      action: UsersController.changePassword,
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
      path: '/api/login/jwt',
      action: UsersController.loginJwt,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/logout/jwt',
      action: UsersController.logoutJwt,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'POST',
      path: '/api/reset-password',
      action: UsersController.resetPasswordApi,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'POST',
      path: '/api/change-password',
      action: UsersController.changePasswordApi,
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
      method: 'PUT',
      path: '/api/users/deactivate',
      action: UsersController.deactivateCurrent,
      policies: ['isUser'],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'PUT',
      path: '/api/users/resend-verification',
      action: UsersController.resendVerification,
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
      method: 'PUT',
      path: '/admin/users/set-field-value-for-ids',
      action: UsersAdminController.updateUsersField,
      policies: [],
    },
    {
      method: 'GET',
      path: `/${AdminHelper.getAdminAccessUrlPrefix()}/login`,
      action: UsersAdminController.admin,
      policies: [],
      // policies: ['adminAllowedIp'],
    },
    {
      method: 'GET',
      path: `/${AdminHelper.getAdminAccessUrlPrefix()}/reset-password`,
      action: UsersAdminController.admin,
      policies: [],
      // policies: ['adminAllowedIp'],
    },
    {
      method: 'GET',
      path: `/${AdminHelper.getAdminAccessUrlPrefix()}/change-password/:userId/:token`,
      action: UsersAdminController.admin,
      policies: [],
      // policies: ['adminAllowedIp'],
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
      action: UsersAdminController.countFiltered,
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
      method: 'GET',
      path: '/api/admin/user/:id/resend-verify-email',
      action: UsersAdminController.resendVerifyEmail,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.users.manage',
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
    {
      method: 'get',
      path: '/api/admin/users/export',
      action: UsersAdminController.exportUsers,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.users.view',
      },
    },
  ],
};
