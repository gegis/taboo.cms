import Cookies from 'modules/core/client/scripts/Cookies';

class CookiesAlert {
  init() {
    const $cookiesAlert = $('.cookies-alert');
    const $acceptCookies = $('.accept-cookies');

    if (!$cookiesAlert) {
      return;
    }

    $cookiesAlert.offsetHeight; // Force browser to trigger reflow (https://stackoverflow.com/a/39451131)

    // Show the alert if we can't find the "$acceptCookies" cookie
    if (!Cookies.get('cookiesAccepted')) {
      $cookiesAlert.addClass('show');
    }

    // When clicking on the agree button, create a 1 year
    // cookie to remember user's choice and close the banner
    $acceptCookies.on('click', function() {
      Cookies.set('cookiesAccepted', true, 365);
      $cookiesAlert.removeClass('show');
    });
  }
}

export default new CookiesAlert();
