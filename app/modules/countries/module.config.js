const CountriesController = require('./controllers/CountriesController');

module.exports = {
  enabled: true,
  installed: true,
  moduleDependencies: [],
  npmDependencies: ['axios', 'mobx'],
  routes: [
    {
      method: 'GET',
      path: '/api/countries',
      action: CountriesController.getAll,
      policies: [],
      options: {
        errorResponseAsJson: true,
      },
    },
  ],
};
