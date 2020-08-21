const CountriesAdminController = require('./controllers/CountriesAdminController');
const CountriesController = require('./controllers/CountriesController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [''],
  npmDependencies: [''],
  acl: {
    resources: ['admin.countries.view', 'admin.countries.manage'],
  },
  routes: [
    {
      method: 'GET',
      path: '/api/countries/system',
      action: CountriesController.getAllSystem,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/countries/all',
      action: CountriesController.getAll,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'PUT',
      path: '/api/countries/user/:countryId',
      action: CountriesController.setUserCountry,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
    {
      method: 'GET',
      path: '/api/admin/countries',
      action: CountriesAdminController.findAll,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.countries.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/countries/count',
      action: CountriesAdminController.count,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.countries.view',
      },
    },
    {
      method: 'GET',
      path: '/api/admin/countries/:id',
      action: CountriesAdminController.findById,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.countries.view',
      },
    },
    {
      method: 'POST',
      path: '/api/admin/countries',
      action: CountriesAdminController.create,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.countries.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/countries/reorder',
      action: CountriesAdminController.reorder,
      policies: ['isAdmin'],
      order: 100,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.countries.manage',
      },
    },
    {
      method: 'PUT',
      path: '/api/admin/countries/:id',
      action: CountriesAdminController.update,
      policies: ['isAdmin'],
      order: 101,
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.countries.manage',
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/countries/:id',
      action: CountriesAdminController.delete,
      policies: ['isAdmin'],
      options: {
        errorResponseAsJson: true,
        aclResource: 'admin.countries.manage',
      },
    },
  ],
};
