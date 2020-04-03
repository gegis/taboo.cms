const CoreController = require('./controllers/CoreController');
const CoreAdminController = require('./controllers/CoreAdminController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [],
  npmDependencies: [
    'validator',
    'mongoose',
    'moment',
    'axios',
    'react',
    'react-dom',
    'react-intl',
    'react-router-dom',
    'prop-types',
    'recompose',
    'history',
    'mobx',
    'mobx-react',
    'rsuite',
    'ckeditor4-react',
  ],
  acl: {
    resources: ['admin.dashboard'],
  },
  routes: [
    {
      method: 'GET',
      path: '/',
      action: CoreController.index,
      policies: ['i18n', 'loadNavigation'],
    },
    {
      method: 'GET',
      path: '/:language?/example',
      action: CoreController.example,
      policies: ['i18n', 'loadNavigation'],
      options: {
        disableGlobalPolicies: true,
      },
    },
    {
      method: 'GET',
      path: '/health',
      action: CoreController.health,
      policies: [],
    },
    {
      method: 'GET',
      path: '/admin*', // This path is match any admin path if authorised, so it loads react app
      action: CoreAdminController.admin,
      policies: ['isAdmin', 'i18nAdmin'],
      order: 10000,
    },
  ],
};
