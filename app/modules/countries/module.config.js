const CountriesController = require('./controllers/CountriesController');

module.exports = {
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
