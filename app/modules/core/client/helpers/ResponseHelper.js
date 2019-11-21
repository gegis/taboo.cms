import { stores as coreStores } from 'app/modules/core/client/stores';
import { stores as aclStores } from 'app/modules/acl/client/stores';
import { stores as userStores } from 'app/modules/users/client/stores';

class ResponseHelper {
  constructor() {
    this.handleError = this.handleError.bind(this);
    this.handleValidationErrors = this.handleValidationErrors.bind(this);
    this.handleModelErrors = this.handleModelErrors.bind(this);
  }

  handleError(err) {
    const {
      response: { data: { error: { validationMessage = null, validationErrors = [], errors = {} } = {} } = {} } = {},
    } = err;
    const { response: { status: errResponseStatus = null } = {} } = err;
    let message = '';
    coreStores.settingsStore.setLoading(false);
    if (validationMessage && validationErrors) {
      this.handleValidationErrors(validationMessage, validationErrors);
    } else if (Object.keys(errors).length > 0) {
      this.handleModelErrors(errors);
    } else if (err && err.response && err.response.data) {
      if (err.response.data.message) {
        message = err.response.data.message;
      } else if (err.response.data.error) {
        message = err.response.data.error.message;
      } else {
        message = err.response.data;
      }
    } else if (err && err.message) {
      message = err.message;
    }
    if (err && err.response && errResponseStatus === 403) {
      aclStores.aclStore.refreshACL(true);
    }
    if (message === 'Not Verified' && errResponseStatus === 403) {
      this.handleNotVerified(err, message, errResponseStatus);
    } else if (message === 'Not Authorized' && errResponseStatus === 401) {
      this.handleNotAuthorized(err, message, errResponseStatus);
    } else if (message) {
      coreStores.notificationsStore.push({ message, type: 'error', duration: 10000 });
    }
  }

  handleValidationErrors(validationMessage, validationErrors) {
    validationErrors.map(validationError => {
      coreStores.notificationsStore.push({
        title: validationMessage,
        message: validationError.message,
        type: 'error',
        duration: 10000,
        translate: true,
      });
    });
  }

  handleModelErrors(errors) {
    Object.keys(errors).forEach(field => {
      coreStores.notificationsStore.push({
        title: 'Invalid Data',
        html: `<b>${errors[field].path}</b> ${errors[field].message}`,
        type: 'error',
        duration: 10000,
        translate: true,
      });
    });
  }

  handleNotVerified(err, message, errResponseStatus) {
    userStores.authStore.setVerified(false);
    coreStores.notificationsStore.push({
      title: errResponseStatus,
      message: message,
      type: 'error',
      duration: 10000,
      translate: true,
    });
  }

  handleNotAuthorized(err, message, errResponseStatus) {
    userStores.authStore.loadUserAuth();
    coreStores.notificationsStore.push({
      title: errResponseStatus,
      message: message,
      type: 'error',
      duration: 10000,
      translate: true,
    });
  }
}
export default new ResponseHelper();
