class ParseHelper {
  parseAsBoolean(value) {
    if (value === 'true' || value === true || value === 1 || value === '1') {
      return true;
    }
    return false;
  }

  parseAsInteger(value) {
    if (typeof value === 'number') {
      return parseInt(value);
    } else if (typeof value === 'string') {
      return parseInt(value.replace(/[^\d]/g, ''), 10);
    }
    return NaN;
  }
}

export default new ParseHelper();
