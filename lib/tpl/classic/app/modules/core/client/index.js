import ConfigHelper from './helpers/ConfigHelper';

const appModules = ConfigHelper.getModules();
const { pagesPage, navigationNavigation, countriesCountries } = appModules;

console.log('Loaded app/modules/core/client/index.js');

console.log('App Modules:');
console.log(appModules);

pagesPage.get('/contact', (err, data) => {
  console.log('Get /contact page:');
  console.log(data);
});

navigationNavigation.get('website', (err, data) => {
  console.log('Get website navigation:');
  console.log(data);
});

countriesCountries.get((err, data) => {
  console.log('Get countries:');
  console.log(data);
});
