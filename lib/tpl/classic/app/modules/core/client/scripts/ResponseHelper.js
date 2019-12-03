import Loader from './Loader';
import Notifications from './Notifications';

class ResponseHelper {
  handleError(err) {
    const { responseJSON: { error: { validationMessage = null, validationErrors = [], errors = {} } = {} } = {} } = err;
    const { responseJSON: { statusText: errResponseStatus = null } = {} } = err;
    let message = '';
    Loader.hide();
    if (validationMessage && validationErrors) {
      this.handleValidationErrors(validationMessage, validationErrors);
    } else if (Object.keys(errors).length > 0) {
      this.handleModelErrors(errors);
    } else if (err && err.responseJSON) {
      if (err.responseJSON.message) {
        message = err.responseJSON.message;
      } else if (err.responseJSON.error) {
        if (err.responseJSON.error.message) {
          message = err.responseJSON.error.message;
        } else {
          message = err.responseJSON.error;
        }
      }
    } else if (err && err.responseText) {
      message = err.responseText;
    }
    if (message === 'Not Verified' && errResponseStatus === 403) {
      this.handleNotVerified(err, message, errResponseStatus);
    } else if (message === 'Not Authorized' && errResponseStatus === 401) {
      this.handleNotAuthorized(err, message, errResponseStatus);
    } else if (message) {
      Notifications.show(message, 'error', 10000);
    }
  }

  handleValidationErrors(validationMessage, validationErrors) {
    validationErrors.map(validationError => {
      Notifications.show(validationError.message, 'error', 10000);
    });
  }

  handleModelErrors(errors) {
    Object.keys(errors).forEach(field => {
      Notifications.show(`<b>${errors[field].path}</b> ${errors[field].message}`, 'error', 10000);
    });
  }

  handleNotVerified(err, message) {
    Notifications.show(message, 'error', 10000);
  }

  handleNotAuthorized(err, message) {
    Notifications.show(message, 'error', 10000);
  }
}
export default new ResponseHelper();
