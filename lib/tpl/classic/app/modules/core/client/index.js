import User from 'modules/users/client/scripts/User';
import CookiesAlert from 'modules/core/client/scripts/CookiesAlert';

console.log('Loaded app/modules/core/client/index.js'); // eslint-disable-line no-console

$(document).ready(function() {
  CookiesAlert.init();
  User.init();
});
