const { config } = require('@taboo/cms-core');
const ValidationHelper = require('modules/core/helpers/ValidationHelper');

const { users: { passwordMinLength = 6 } = {} } = config;

class UserValidationHelper {
  validateUserRegisterFields(data) {
    const rules = Object.assign({}, this.getUserFieldsBasicRules(), {
      agreeToTerms: [
        {
          test: 'isTrue',
          message: 'You must agree with Terms & Conditions',
        },
      ],
    });
    const validationErrors = ValidationHelper.validateData(rules, data);
    let response = null;

    if (validationErrors && validationErrors.length > 0) {
      response = {
        validationMessage: 'Invalid Data',
        validationErrors: validationErrors,
      };
    }

    return response;
  }

  validateUserAccountFields(data) {
    const addPasswordRule = !!(data && data.newPassword);
    const rules = Object.assign({}, this.getUserFieldsBasicRules(addPasswordRule, 'newPassword'));
    const validationErrors = ValidationHelper.validateData(rules, data);
    let response = null;

    if (validationErrors && validationErrors.length > 0) {
      response = {
        validationMessage: 'Invalid Data',
        validationErrors: validationErrors,
      };
    }

    return response;
  }

  validateUserPassword(password) {
    const rules = {
      password: this.getUserPasswordRules(),
    };
    const validationErrors = ValidationHelper.validateData(rules, { password: password });
    let response = null;
    if (validationErrors && validationErrors.length > 0) {
      response = {
        validationMessage: 'Invalid Password',
        validationErrors: validationErrors,
      };
    }

    return response;
  }

  getUserFieldsBasicRules(addPasswordRule = true, passwordFieldName = 'password') {
    const rules = {
      firstName: [
        {
          test: 'isRequired',
          message: 'First Name is required',
        },
      ],
      lastName: [
        {
          test: 'isRequired',
          message: 'Last Name is required',
        },
      ],
      email: [
        {
          test: 'isRequired',
          message: 'Email is required',
        },
        {
          test: 'isEmail',
          message: 'Email is not valid',
        },
      ],
      country: [
        {
          test: 'isRequired',
          message: 'Country is required',
        },
      ],
      // username: this.getUsernameRules(),
    };

    if (addPasswordRule) {
      rules[passwordFieldName] = this.getUserPasswordRules();
    }

    return rules;
  }

  getUserPasswordRules() {
    return [
      {
        test: 'isLength',
        options: { min: passwordMinLength },
        message: `Password must be at least ${passwordMinLength} characters long`,
      },
      {
        test: 'testRegexp',
        regexp: RegExp(/[A-Z]+/),
        message: 'Should contain at least one upper case letter',
      },
      {
        test: 'testRegexp',
        regexp: RegExp(/[a-z]+/),
        message: 'Should contain at least one lower case letter',
      },
      {
        test: 'testRegexp',
        regexp: RegExp(/\d+/),
        message: 'Should contain at least one digit',
      },
    ];
  }

  getUsernameRules() {
    return [
      {
        test: 'isRequired',
        message: 'Username is required',
      },
      {
        test: 'isLength',
        options: { min: 3 },
        message: 'Username must be minimum 3 characters',
      },
      {
        test: 'isLength',
        options: { max: 20 },
        message: 'Username must be maximum 20 characters',
      },
      {
        test: 'notIndexOf',
        options: {
          caseSensitive: false,
          values: ['admin', 'administrator'],
        },
        message: 'Username is already taken!',
      },
      {
        test: 'testRegexp',
        regexp: RegExp(/^[\w]+$/),
        message: "Only alphanumeric symbols a-z, A-Z, 0-9 and '_'",
      },
    ];
  }
}

module.exports = new UserValidationHelper();
