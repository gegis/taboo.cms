const { apiHelper, logger } = require('@taboo/cms-core');
const CoreHelper = require('modules/core/helpers/CoreHelper');

class AbstractAdminController {
  /**
   * Available props:
   * @param props:
   *  model - Model object
   *  searchFields - array
   *  defaultSort - object
   *  populate - object {method: [property]}
   */
  constructor(props) {
    this.props = props;
    if (!this.props) {
      throw new Error('no props specified');
    }
    if (!this.props.model) {
      throw new Error('model has to be specified');
    }
    if (!this.props.searchFields) {
      throw new Error('searchFields have to be specified');
    }
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.count = this.count.bind(this);
    this.applyPopulateToQuery = this.applyPopulateToQuery.bind(this);
    this.reorder = this.reorder.bind(this);
  }

  async beforeFindAll(ctx, data) {
    return data;
  }
  async afterFindAll(ctx, itemsResult) {
    return itemsResult;
  }
  async findAll(ctx) {
    const { model, searchFields } = this.props;
    const requestParams = ctx.request.query;
    const defaultSort = this.props.defaultSort || null;
    const searchOptions = this.props.searchOptions || {};
    let { filter, fields, limit, skip, sort } = apiHelper.parseRequestParams(ctx.request.query, [
      'filter',
      'fields',
      'limit',
      'skip',
      'sort',
    ]);
    let options = {};
    let data = {};
    let items = [];
    let itemsResult;
    let query;
    try {
      if (requestParams && requestParams.search) {
        CoreHelper.applySearchToFilter(requestParams.search, searchFields, filter, searchOptions);
      }
      if (sort === null) {
        sort = defaultSort;
      }
      options = { limit, skip, sort };
      data = { filter, fields, options };
      data = await this.beforeFindAll(ctx, data);
      query = model.find(data.filter, data.fields, data.options);
      this.applyPopulateToQuery('findAll', query, this.parseQueryParamsPopulate(requestParams));
      itemsResult = await query.exec();
      items = await this.afterFindAll(ctx, itemsResult, data);
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    ctx.body = items;
  }

  async beforeFindById(ctx, id, data) {
    return data;
  }
  async afterFindById(ctx, itemResult) {
    return itemResult;
  }
  async findById(ctx) {
    const { model } = this.props;
    let { fields } = apiHelper.parseRequestParams(ctx.request.query, ['fields']);
    let item = {};
    let data = { fields };
    let itemResult;
    let query;
    try {
      data = await this.beforeFindById(ctx, ctx.params.id, data);
      query = model.findById(ctx.params.id, data.fields);
      this.applyPopulateToQuery('findById', query);
      itemResult = await query.exec();
      item = await this.afterFindById(ctx, itemResult, data);
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    ctx.body = item;
  }

  async beforeCreate(ctx, data) {
    return data;
  }
  async afterCreate(ctx, itemResult) {
    return itemResult;
  }
  async create(ctx) {
    const { model } = this.props;
    let data = ctx.request.body;
    let item = {};
    let itemResult;
    try {
      data = await this.beforeCreate(ctx, data);
      itemResult = await model.create(data);
      item = await this.afterCreate(ctx, itemResult, data);
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    ctx.body = item;
  }

  async beforeUpdate(ctx, id, data) {
    return data;
  }
  async afterUpdate(ctx, itemResult) {
    return itemResult;
  }
  async update(ctx) {
    const { model } = this.props;
    let data = ctx.request.body;
    let item = {};
    let itemResult;
    let query;
    try {
      data = await this.beforeUpdate(ctx, ctx.params.id, data);
      apiHelper.cleanTimestamps(data);
      query = model.findByIdAndUpdate(
        ctx.params.id,
        { $set: data },
        { new: true, runValidators: true, context: 'query' }
      );
      this.applyPopulateToQuery('update', query);
      itemResult = await query.exec();
      item = await this.afterUpdate(ctx, itemResult, data);
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    ctx.body = item;
  }

  async beforeDelete() {}
  async afterDelete(ctx, itemResult) {
    return itemResult;
  }
  async delete(ctx) {
    const { model } = this.props;
    let item = {};
    let itemResult;
    let query;
    try {
      await this.beforeDelete(ctx, ctx.params.id);
      query = model.findByIdAndDelete(ctx.params.id);
      this.applyPopulateToQuery('delete', query);
      itemResult = await query.exec();
      item = await this.afterDelete(ctx, itemResult);
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    ctx.body = item;
  }

  async count(ctx) {
    const { model } = this.props;
    let count = 0;
    try {
      count = await model.estimatedDocumentCount();
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    ctx.body = {
      count,
    };
  }

  applyPopulateToQuery(method, query, populate = []) {
    let allPopulate = [];
    if (method && query) {
      if (this.props.populate && this.props.populate[method]) {
        allPopulate = allPopulate.concat(this.props.populate[method]);
      }
      if (populate) {
        allPopulate = allPopulate.concat(populate);
      }
      query.populate(allPopulate);
    }
  }

  async reorder(ctx) {
    const { model } = this.props;
    const { request: { body: items = {} } = {} } = ctx;
    let sort = -1;
    let promises = [];

    try {
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          sort++;
          promises.push(model.updateOne({ _id: items[i]._id }, { sort }));
        }
      }
      await Promise.all(promises);
    } catch (e) {
      logger.error(e);
      return ctx.throw(e);
    }

    ctx.body = {
      success: true,
    };
  }

  parseQueryParamsPopulate(requestParams = {}) {
    let populate = [];
    if (requestParams.populate) {
      populate = requestParams.populate.split(',');
    }
    return populate;
  }
}

module.exports = AbstractAdminController;
