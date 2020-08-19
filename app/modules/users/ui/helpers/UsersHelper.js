import { Schema } from 'rsuite';

const { StringType } = Schema.Types;
const { userPasswordMinLength = 6 } = window.app.config;

class UsersHelper {
  getUserEventName(action, authStore) {
    let eventName = null;
    if (authStore.user && authStore.user.id) {
      eventName = `user-${authStore.user.id}-user-${action}`;
    }
    return eventName;
  }

  getSignUpFormValidation() {
    return this.getFormValidationModel();
  }

  getUserFormValidation() {
    return this.getFormValidationModel('newPassword', false);
  }

  getFormValidationModel(passwordFieldName = 'password', passwordRequired = true) {
    const rules = {
      username: StringType()
        .isRequired('Username is required.')
        .minLength(3, 'Minimum 3 characters')
        .maxLength(20, 'Maximum 20 characters')
        .pattern(/^[\w]+$/, "Only alphanumeric symbols a-z, A-Z, 0-9 and '_'"),
      email: StringType()
        .isEmail('Please enter a valid email address.')
        .isRequired('Email address is required.'),
      country: StringType().isRequired('Country is required.'),
    };

    rules[passwordFieldName] = StringType();
    if (passwordRequired) {
      rules[passwordFieldName].isRequired('Password is required.');
    }

    rules[passwordFieldName]
      .minLength(userPasswordMinLength, `Password must be at least ${userPasswordMinLength} characters long`)
      .pattern(/[A-Z]+/, 'Should contain at least one upper case letter')
      .pattern(/[a-z]+/, 'Should contain at least one lower case letter')
      .pattern(/\d+/, 'Should contain at least one digit');

    const validationModel = Schema.Model(rules);

    return validationModel;
  }
}

export default new UsersHelper();
