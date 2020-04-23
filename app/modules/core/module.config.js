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
    // ATM it is served as dynamic page.
    // {
    //   method: 'GET',
    //   path: '/',
    //   action: CoreController.index,
    //   policies: [],
    // },
    {
      method: 'GET',
      path: '/dashboard',
      action: CoreController.dashboard,
      policies: ['isUser'],
    },
    {
      method: 'GET',
      path: '/:language?/example',
      action: CoreController.example,
      policies: [],
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
      method: 'PUT',
      path: '/api/language/:language',
      action: CoreController.setLanguage,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/admin*', // This path is match any admin path if authorised, so it loads react app
      action: CoreAdminController.admin,
      policies: ['isAdmin'],
      order: 10000,
    },
  ],
};
