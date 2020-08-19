class StringHelper extends Array {
  firstUpper(string = '') {
    if (string && string.length > 0) {
      string = string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
  }

  firstLower(string = '') {
    if (string && string.length > 0) {
      string = string.charAt(0).toLowerCase() + string.slice(1);
    }
    return string;
  }
}

// To make it reusable for backend
module.exports = new StringHelper();
