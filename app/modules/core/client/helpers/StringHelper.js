class StringHelper extends Array {
  //TODO remove this
  capitalizeFirstLetter(string = '') {
    if (string && string.length > 0) {
      string = string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
  }

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

export default new StringHelper();
