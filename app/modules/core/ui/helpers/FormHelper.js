class FormHelper {
  parseCheckboxGroup(data, field, fieldGroup) {
    if (data[fieldGroup]) {
      if (data[fieldGroup].indexOf(field) > -1) {
        data[field] = true;
      } else {
        data[field] = false;
      }
    }
  }
}
module.exports = new FormHelper();
