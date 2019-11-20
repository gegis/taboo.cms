class ParseHelper {
  parseAsBoolean(value) {
    if (value === 'true' || value === true || value === 1 || value === '1') {
      return true;
    }
    return false;
  }
}

export default new ParseHelper();
