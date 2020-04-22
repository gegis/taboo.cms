import User from 'modules/users/ui/scripts/User';
import CookiesAlert from 'modules/core/ui/scripts/CookiesAlert';

console.log('Loaded app/modules/core/ui/index.js'); // eslint-disable-line no-console

$(document).ready(function() {
  CookiesAlert.init();
  User.init();
});
