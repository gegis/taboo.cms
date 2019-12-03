import User from 'modules/users/client/scripts/User';

console.log('Loaded app/modules/core/client/index.js'); // eslint-disable-line no-console

$(document).ready(function() {
  User.init();
});
