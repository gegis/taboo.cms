const { config, apiHelper } = require('@taboo/cms-core');
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

  parseRequestParams(
    ctx,
    { defaultFilter = null, defaultSort = null, defaultFields = null, searchFields = null } = {}
  ) {
    const { query = {} } = ctx;
    const params = {};
    let { filter, fields, limit, skip, sort } = apiHelper.parseRequestParams(query, [
      'filter',
      'fields',
      'limit',
      'skip',
      'sort',
    ]);

    if (defaultFilter) {
      filter = Object.assign({}, defaultFilter, filter);
    }

    if (query.search && searchFields) {
      this.applySearchToFilter(query.search, searchFields, filter);
    }

    if (sort === null && defaultSort) {
      sort = defaultSort;
    }

    if (fields === null && defaultFields) {
      fields = defaultFields;
    }

    params.filter = filter;
    params.fields = fields;
    params.options = {
      limit: limit,
      skip: skip,
      sort: sort,
    };

    return params;
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
    // If searchValue contains ' = ' then assume left part is column name and right part is value
    if (searchValue && searchValue.indexOf(' = ') !== -1) {
      searchPhrases = searchValue.split(' = ');
      filterObj[searchPhrases[0]] = searchPhrases[1];
    } else if (searchValue && searchValue.indexOf(' > ') !== -1) {
      searchPhrases = searchValue.split(' > ');
      filterObj[searchPhrases[0]] = { $gt: searchPhrases[1] };
    } else if (searchValue && searchValue.indexOf(' < ') !== -1) {
      searchPhrases = searchValue.split(' < ');
      filterObj[searchPhrases[0]] = { $lt: searchPhrases[1] };
    } else if (searchValue && searchFields) {
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
              if (phraseCopy) {
                fieldSearch[field] = phraseCopy;
                searchOr.push(fieldSearch);
              }
            } else if (options.dateStringFields && options.dateStringFields.indexOf(field) !== -1) {
              phraseCopy = this.convertDateSearchPhrase(phraseCopy, true);
              if (phraseCopy) {
                fieldSearch[field] = phraseCopy;
                searchOr.push(fieldSearch);
              }
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

  // TODO make this more generic and not country specific
  parseCountriesSortFromParams(params = {}, countriesFilterKey = 'countries') {
    const { filter = {}, options: { sort = null } = {} } = params;
    let $inCountries = [];
    if (filter[countriesFilterKey] && filter[countriesFilterKey].$in) {
      $inCountries = filter[countriesFilterKey].$in;
    }
    const [countryId = null] = $inCountries;
    let newSort = {};
    if (countryId) {
      newSort[`countrySort.${countryId}`] = 'asc';
      if (sort) {
        Object.keys(sort).map(key => {
          newSort[key] = sort[key];
        });
      }
      if (!params.options) {
        params.options = {};
      }
      params.options.sort = newSort;
    }

    return params;
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

  convertDateSearchPhrase(phrase, dateAsString = false) {
    const {
      client: { dateFormat = 'DD/MM/YYYY' },
    } = config;
    let filter = null;
    if (phrase && phrase.indexOf('/') !== -1 && phrase.length === 10) {
      filter = {
        $gte: `${moment(phrase, dateFormat).format('YYYY-MM-DD')}T00:00:00Z`,
        $lte: `${moment(phrase, dateFormat).format('YYYY-MM-DD')}T23:59:59Z`,
      };
      if (!dateAsString) {
        filter = {
          $gte: new Date(filter.$gte),
          $lte: new Date(filter.$lte),
        };
      }
    }
    return filter;
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

  parseSlug(text = '') {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
}
module.exports = new CoreHelper();
