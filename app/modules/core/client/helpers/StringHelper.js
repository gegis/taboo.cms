class StringHelper extends Array {
  capitalizeFirstLetter(string = '') {
    if (string && string.length > 0) {
      string = string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
  }
}

export default new StringHelper();
