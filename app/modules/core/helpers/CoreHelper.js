const { config } = require('@taboo/cms-core');
const moment = require('moment');
const mongoose = require('mongoose');

const defaultSearchOptions = {
  separator: ' ',
  regExpFlags: 'i',
  idFields: ['_id'],
  numberFields: [],
  dateFields: ['createdAt', 'updatedAt'],
};

class CoreHelper {
  getUnixTimestamp(ms = true) {
    let format = 'X';
    if (ms) {
      format = 'x';
    }
    return moment().format(format);
  }

  /**
   * It constructs mongoose ready filter object combining $or and $and depending on how many search phrases
   * @param searchValue
   * @param searchFields
   * @param filterObj
   * @param options
   */
  applySearchToFilter(searchValue, searchFields, filterObj = {}, options = {}) {
    let fieldSearch = {};
    let searchPhrases = [];
    let searchOr = [];
    let searchAnd = [];
    let phraseCopy;
    options = Object.assign({}, defaultSearchOptions, options);
    if (searchValue && searchFields) {
      // TODO also add whole phrase as single search regexp!!!
      searchPhrases = searchValue.split(options.separator);
      searchPhrases.map(phrase => {
        if (phrase) {
          searchFields.map(field => {
            phraseCopy = phrase;
            fieldSearch = {};
            if (options.idFields && options.idFields.indexOf(field) !== -1) {
              if (mongoose.Types.ObjectId.isValid(phraseCopy)) {
                fieldSearch[field] = phraseCopy;
                searchOr.push(fieldSearch);
              }
            } else if (options.numberFields && options.numberFields.indexOf(field) !== -1) {
              if (!isNaN(phraseCopy)) {
                fieldSearch[field] = phraseCopy;
                searchOr.push(fieldSearch);
              }
            } else if (options.dateFields && options.dateFields.indexOf(field) !== -1) {
              phraseCopy = this.convertDateSearchPhrase(phraseCopy);
              fieldSearch[field] = phraseCopy;
              searchOr.push(fieldSearch);
            } else {
              phraseCopy = this.escapePhrase(phraseCopy);
              fieldSearch[field] = new RegExp(phraseCopy, options.regExpFlags);
              searchOr.push(fieldSearch);
            }
          });
          if (searchPhrases.length > 1) {
            searchAnd.push({ $or: searchOr });
            searchOr = [];
          }
        }
      });
      if (searchAnd.length > 0) {
        filterObj.$and = searchAnd;
      } else if (searchOr.length > 0) {
        filterObj.$or = searchOr;
      }
    }
  }

  escapePhrase(phrase) {
    phrase = phrase.replace(/\+/i, '\\+');
    phrase = phrase.replace(/\?/i, '\\?');
    phrase = phrase.replace(/\*/i, '\\*');
    phrase = phrase.replace(/\./i, '\\.');
    return phrase;
  }

  escapeFormValue(value) {
    // TODO find a good way to make safe escape, atm escape does replace ' ' with '%20' which is not ideal!!!
    // value = escape(value);
    return value;
  }

  convertDateSearchPhrase(phrase) {
    const {
      client: { dateFormat = 'DD/MM/YYYY' },
    } = config;
    if (phrase && phrase.indexOf('/') !== -1 && phrase.length === 10) {
      phrase = moment(phrase, dateFormat).format('YYYY-MM-DD');
    }
    return phrase;
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
module.exports = new CoreHelper();
