class UnitsHelper {
  getPercentageOutOfTotal(count, total, decimalPlaces) {
    let percentage = 0;
    if (total > 0) {
      percentage = (count * 100) / total;
    }
    if (decimalPlaces && decimalPlaces > 0) {
      return percentage.toFixed(decimalPlaces);
    } else {
      return Math.round(percentage).toString();
    }
  }

  parseAsPercentage(value) {
    if (value) {
      return value + '%';
    }
    return null;
  }

  parseSizeAuto(value) {
    if (value) {
      if (parseInt(value) > 1000000) {
        return this.parseSizeAsMB(value);
      } else {
        return this.parseSizeAsKB(value);
      }
    }
    return null;
  }

  parseSizeAsMB(value, decimalPlaces = 1) {
    if (value) {
      return parseFloat(parseInt(value) / 1048576).toFixed(decimalPlaces) + ' MB';
    }
    return null;
  }

  parseSizeAsKB(value, decimalPlaces = 1) {
    if (value) {
      return parseFloat(parseInt(value) / 1024).toFixed(decimalPlaces) + ' KB';
    }
    return null;
  }

  parseLengthAsTime(value) {
    if (value) {
      let date = new Date(value);
      let hh = date.getUTCHours();
      let mm = date.getUTCMinutes();
      let ss = date.getUTCSeconds();

      if (hh < 10) {
        hh = '0' + hh;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      if (ss < 10) {
        ss = '0' + ss;
      }
      return hh + ':' + mm + ':' + ss;
    }
    return null;
  }
}

export default new UnitsHelper();
