const { config, apiHelper } = require('@taboo/cms-core');
const CoreHelper = require('modules/core/helpers/CoreHelper');

const { api: { defaultPageSize = 20 } = {} } = config;

class AbstractController {
  constructor(props) {
    const {
      model,
      defaultFields = null,
      defaultSort = null,
      defaultFilter = {},
      defaultPopulate = {
        getAll: [],
        getRandom: [],
        getOne: [],
      },
      searchFields = null,
      filterRequestParams = {
        getAll: [],
        getRandom: [],
        getOne: [],
      },
    } = props;
    this.model = model;
    this.defaultFields = defaultFields;
    this.searchFields = searchFields;
    this.defaultSort = defaultSort;
    this.defaultFilter = defaultFilter;
    this.defaultPopulate = defaultPopulate;
    this.filterRequestParams = filterRequestParams;
    this.getAll = this.getAll.bind(this);
    this.parseGetAllItemsResult = this.parseGetAllItemsResult.bind(this);
    this.getAllItems = this.getAllItems.bind(this);
    this.getRandom = this.getRandom.bind(this);
    this.getRandomItems = this.getRandomItems.bind(this);
    this.getOne = this.getOne.bind(this);
    this.getOneItem = this.getOneItem.bind(this);
    this.parseGetAllQuery = this.parseGetAllQuery.bind(this);
    this.parseGetOneQuery = this.parseGetOneQuery.bind(this);
    this.getPopulate = this.getPopulate.bind(this);
  }

  async beforeGetAll(ctx, params) {
    return params;
  }

  async getAll(ctx) {
    const result = await this.getAllItems(ctx);
    ctx.body = await this.parseGetAllItemsResult(result);
  }

  async parseGetAllItemsResult(result) {
    const { items = [], params: { filter = null, options: { limit = 1, skip = 0, sort = null } = {} } = {} } = result;
    const total = await this.model.countDocuments(filter);
    const response = {
      items: items,
      page: parseInt(skip) / parseInt(limit) + 1,
      limit: limit,
      sort: sort,
      filter: filter,
      total: total,
    };

    return response;
  }

  async getAllItems(ctx) {
    let params = this.parseGetAllQuery(ctx);
    const populate = this.getPopulate(ctx, 'getAll');
    let items = [];
    params = await this.beforeGetAll(ctx, params);
    const query = this.model.find(params.filter, params.fields, params.options);
    if (populate && populate.length > 0) {
      query.populate(populate);
    }
    items = await query.exec();

    return {
      items: items,
      params: params,
    };
  }

  async getRandom(ctx) {
    ctx.body = await this.getRandomItems(ctx);
  }

  async getRandomItems(ctx) {
    const params = this.parseGetAllQuery(ctx);
    const populate = this.getPopulate(ctx, 'getRandom');
    const aggregation = [];
    const { options: { limit = defaultPageSize } = {} } = params;
    if (params.filter) {
      aggregation.push({ $match: params.filter });
    }
    aggregation.push({ $sample: { size: limit } });
    const query = this.model.aggregate(aggregation);
    if (populate && populate.length > 0) {
      query.populate(populate);
    }
    return query.exec();
  }

  async getOne(ctx) {
    const item = await this.getOneItem(ctx);
    if (!item) {
      ctx.throw(404, 'Not Found');
    }
    ctx.body = item;
  }

  async getOneItem(ctx) {
    const params = this.parseGetOneQuery(ctx);
    const populate = this.getPopulate(ctx, 'getOne');
    const query = this.model.find(params.filter, params.fields);
    let item;
    if (populate && populate.length > 0) {
      query.populate(populate);
    }
    item = this.model.findOne(params.filter, params.fields).populate(populate);
    if (!item) {
      return ctx.throw(404, 'Not Found');
    }
    return item;
  }

  parseGetAllQuery(ctx) {
    const { query = {} } = ctx;
    const params = {};
    let { filter, fields, limit, skip, sort } = apiHelper.parseRequestParams(query, [
      'filter',
      'fields',
      'limit',
      'skip',
      'sort',
    ]);

    if (this.defaultFilter) {
      filter = Object.assign({}, this.defaultFilter, filter);
    }

    this.applyRequestParamsToFilter(ctx.params, filter, 'getAll');

    if (query.search && this.searchFields) {
      CoreHelper.applySearchToFilter(query.search, this.searchFields, filter);
    }

    fields = this.getAllFields(fields);

    if (sort === null && this.defaultSort) {
      sort = this.defaultSort;
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

  parseGetOneQuery(ctx) {
    const { query = {} } = ctx;
    const params = {};
    let { filter, fields } = apiHelper.parseRequestParams(query, ['filter', 'fields']);

    if (this.defaultFilter) {
      filter = Object.assign({}, this.defaultFilter, filter);
    }

    this.applyRequestParamsToFilter(ctx.params, filter, 'getOne');

    if (query.search && this.searchFields) {
      CoreHelper.applySearchToFilter(query.search, this.searchFields, filter);
    }

    fields = this.getAllFields(fields);

    params.filter = filter;
    params.fields = fields;

    return params;
  }

  getAllFields(fields) {
    if (this.defaultFields) {
      if (fields) {
        return `${fields} ${this.defaultFields}`;
      } else {
        return this.defaultFields;
      }
    }
    return null;
  }

  applyRequestParamsToFilter(requestParams = {}, filter, action) {
    if (this.filterRequestParams && this.filterRequestParams[action]) {
      this.filterRequestParams[action].map(param => {
        if (requestParams[param]) {
          filter[param] = requestParams[param];
        }
      });
    }
  }

  getPopulate(ctx, action) {
    const { query = {} } = ctx;
    let populate = [];
    if (query.populate) {
      populate = query.populate.split(',');
    }
    if (this.defaultPopulate && this.defaultPopulate[action]) {
      this.defaultPopulate[action].map(item => {
        if (populate.indexOf(item) === -1) {
          populate.push(item);
        }
      });
    }
    return populate;
  }
}

module.exports = AbstractController;
