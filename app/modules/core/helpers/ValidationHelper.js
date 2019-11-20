const validator = require('validator');

class ValidationHelper {
  validateData(rules, data) {
    const validationErrors = [];

    try {
      if (rules && data) {
        Object.keys(rules).forEach(field => {
          if (rules[field]) {
            rules[field].forEach(rule => {
              let passes;
              if (rule.test === 'isRequired') {
                if (Object.prototype.hasOwnProperty.call(data, field) && !validator.isEmpty(data[field])) {
                  passes = true;
                } else {
                  passes = false;
                }
              } else {
                passes = validator[rule.test](data[field], rule.options);
              }
              if (!passes) {
                validationErrors.push({
                  field: field,
                  message: rule.message,
                });
              }
            });
          }
        });
      }
    } catch (err) {
      validationErrors.push({
        field: null,
        message: err.message,
      });
    }
    return validationErrors;
  }
}
module.exports = new ValidationHelper();
