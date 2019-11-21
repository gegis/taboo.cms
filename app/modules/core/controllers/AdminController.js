const { Model, Helper, apiHelper, logger } = require('@taboo/cms-core');

class AdminController {
  /**
   * Available props:
   * @param props:
   *  model - string
   *  searchFields - array
   *  defaultSort - object
   *  populate - string|array
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
        Helper('core.Core').applySearchToFilter(requestParams.search, searchFields, filter, searchOptions);
      }
      if (sort === null) {
        sort = defaultSort;
      }
      options = { limit, skip, sort };
      data = { filter, fields, options };
      data = await this.beforeFindAll(ctx, data);
      query = Model(model).find(data.filter, data.fields, data.options);
      this.applyPopulateToQuery('findAll', query);
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
      query = Model(model).findById(ctx.params.id, data.fields);
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
      itemResult = await Model(model).create(data);
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
      apiHelper.cleanTimestamps(data);
      data = await this.beforeUpdate(ctx, ctx.params.id, data);
      query = Model(model).findByIdAndUpdate(
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
      query = Model(model).findByIdAndDelete(ctx.params.id);
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
      count = await Model(model).estimatedDocumentCount();
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    ctx.body = {
      count,
    };
  }

  applyPopulateToQuery(method, query) {
    if (method && query && this.props.populate && this.props.populate[method]) {
      query.populate(this.props.populate[method]);
    }
  }
}

module.exports = AdminController;
