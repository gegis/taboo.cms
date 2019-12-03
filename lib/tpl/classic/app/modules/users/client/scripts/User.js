import Loader from 'modules/core/client/scripts/Loader';
import Notifications from 'modules/core/client/scripts/Notifications';
import ResponseHelper from 'modules/core/client/scripts/ResponseHelper';
import Countries from 'modules/countries/client/scripts/Countries';
import ArrayHelper from 'modules/core/client/helpers/ArrayHelper';
import UserActions from './UserActions';

class User {
  init() {
    this.bindSignInSubmit();
    this.bindSignUpSubmit();
    this.bindMyProfileSubmit();
    this.bindResetPasswordSubmit();
    this.bindChangePasswordSubmit();
    this.bindLogout();
    this.setCountriesOptions();
  }

  setCountriesOptions() {
    const countriesSelect = $('#sign-up-form #country');
    let options = [];
    if (countriesSelect.get(0)) {
      Countries.get((err, data) => {
        if (err) {
          ResponseHelper.handleError(err);
        } else if (data) {
          for (let code in data) {
            options.push({
              key: code,
              value: data[code],
            });
          }
          options = ArrayHelper.sortByProperty(options, 'value');
          options.map(option => {
            countriesSelect.append($(`<option value="${option.key}">${option.value}</option>`));
          });
        }
      });
    }
  }

  bindSignInSubmit() {
    $('#sign-in-form').submit(event => {
      event.preventDefault();
      const email = $('#email').val();
      const pass = $('#password').val();
      UserActions.login(email, pass, (err, data) => {
        if (err) {
          ResponseHelper.handleError(err);
        } else if (data && data.id) {
          window.location = '/dashboard';
        }
      });
    });
  }

  bindSignUpSubmit() {
    $('#sign-up-form').submit(event => {
      event.preventDefault();
      const data = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        passwordRepeat: $('#passwordRepeat').val(),
        street: $('#street').val(),
        city: $('#city').val(),
        state: $('#state').val(),
        country: $('#country').val(),
        postCode: $('#postCode').val(),
        userAgreement: $('#userAgreement').prop('checked'),
      };
      if (data.password !== data.passwordRepeat) {
        Notifications.show("Passwords don't match", 'error', 10000);
      } else if (!data.userAgreement) {
        Notifications.show('You have to agree with terms and conditions', 'error', 10000);
      } else {
        Loader.show();
        UserActions.register(data, (err, user) => {
          Loader.hide();
          if (err) {
            ResponseHelper.handleError(err);
          } else if (user && user._id) {
            UserActions.login(data.email, data.password, (err, loginData) => {
              if (err) {
                ResponseHelper.handleError(err);
              } else if (loginData && loginData.id) {
                window.location = '/dashboard';
              }
            });
          } else {
            Notifications.show('Sign Up has failed', 'error', 10000);
          }
        });
      }
    });
  }

  bindMyProfileSubmit() {
    $('#my-profile-form').submit(event => {
      event.preventDefault();
      const data = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        street: $('#street').val(),
        city: $('#city').val(),
        state: $('#state').val(),
        country: $('#country').val(),
        postCode: $('#postCode').val(),
      };
      Loader.show();
      UserActions.updateMyProfile(data, (err, user) => {
        Loader.hide();
        if (err) {
          ResponseHelper.handleError(err);
        } else if (user && user._id) {
          Notifications.show('Data has been successfully updated');
        } else {
          Notifications.show('Data update has failed', 'error', 10000);
        }
      });
    });
  }

  bindResetPasswordSubmit() {
    $('#reset-password-form').submit(event => {
      event.preventDefault();
      const email = $('#email').val();
      Loader.show();
      UserActions.resetPassword(email, (err, data) => {
        Loader.hide();
        if (err) {
          ResponseHelper.handleError(err);
        } else if (data && data.success) {
          Notifications.show(
            'Information has been sent to your inbox. Please check it and follow the instructions.',
            'info',
            10000
          );
        } else {
          Notifications.show('Password reset has failed', 'error', 10000);
        }
      });
    });
  }

  bindChangePasswordSubmit() {
    $('#change-password-form').submit(event => {
      event.preventDefault();
      const newPass = $('#new-pass').val();
      const newPassRepeat = $('#new-pass-repeat').val();
      const urlParts = window.location.pathname.split('/');
      const data = {
        newPass,
        newPassRepeat,
        userId: urlParts[2],
        token: urlParts[3],
      };
      if (newPass !== newPassRepeat) {
        Notifications.show("Passwords don't match", 'error', 10000);
      } else {
        Loader.show();
        UserActions.changePassword(data, (err, data) => {
          Loader.hide();
          if (err) {
            ResponseHelper.handleError(err);
          } else if (data && data.success) {
            Notifications.show('Password has been successfully changed.');
          } else {
            Notifications.show('Password change has failed', 'error', 10000);
          }
        });
      }
    });
  }

  bindLogout() {
    $('.user-logout').click(event => {
      event.preventDefault();
      UserActions.logOut((err, data) => {
        if (err) {
          ResponseHelper.handleError(err);
        } else if (data) {
          window.location = '/';
        }
      });
    });
  }
}

export default new User();
