const validator = require('validator');

class ValidationHelper {
  validateData(rules, data) {
    const validationErrors = [];
    let i;
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
              } else if (rule.test === 'isTrue') {
                passes = Object.prototype.hasOwnProperty.call(data, field) && data[field] === true;
              } else if (rule.test === 'testRegexp') {
                passes = Object.prototype.hasOwnProperty.call(data, field) && rule.regexp.test(data[field]);
              } else if (rule.test === 'indexOf') {
                passes = true;
                for (i = 0; i < rule.options.values.length; i++) {
                  if (rule.options.caseSensitive) {
                    passes = data[field].indexOf(rule.options.values[i]) !== -1;
                  } else {
                    passes = data[field].toLowerCase().indexOf(rule.options.values[i]) !== -1;
                  }
                  if (passes === false) {
                    break;
                  }
                }
              } else if (rule.test === 'notIndexOf') {
                passes = true;
                for (i = 0; i < rule.options.values.length; i++) {
                  if (rule.options.caseSensitive) {
                    passes = data[field].indexOf(rule.options.values[i]) === -1;
                  } else {
                    passes = data[field].toLowerCase().indexOf(rule.options.values[i]) === -1;
                  }
                  if (passes === false) {
                    break;
                  }
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
