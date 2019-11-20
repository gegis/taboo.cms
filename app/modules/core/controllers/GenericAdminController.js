const { Model, Helper, apiHelper, logger } = require('@taboo/cms-core');

class GenericAdminController {
  /**
   * Available props:
   * @param props:
   *  model - string
   *  searchFields - array
   *  defaultSort - object
   *  beforeFindAll - async function
   *  afterFindAll - async function
   *  beforeFindById - async function
   *  afterFindById - async function
   *  beforeCreate - async function
   *  afterCreate - async function
   *  beforeUpdate - async function
   *  afterUpdate - async function
   *  beforeDelete - async function
   *  afterDelete - async function
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
  }

  async findAll(ctx) {
    const {
      model,
      searchFields,
      beforeFindAll = (ctx, data) => {
        return data;
      },
      afterFindAll = () => {},
    } = this.props;
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
    let items = [];
    let options = {};
    let data = {};
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
      data = await beforeFindAll(ctx, data);
      query = Model(model).find(data.filter, data.fields, data.options);
      this.applyPopulateToQuery('findAll', query);
      items = await query.exec();
      await afterFindAll(ctx, items, data);
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    ctx.body = items;
  }

  async findById(ctx) {
    const {
      model,
      beforeFindById = (ctx, id, data) => {
        return data;
      },
      afterFindById = () => {},
    } = this.props;
    let { fields } = apiHelper.parseRequestParams(ctx.request.query, ['fields']);
    let item = {};
    let data = { fields };
    let query;
    try {
      data = await beforeFindById(ctx, ctx.params.id, data);
      query = Model(model).findById(ctx.params.id, data.fields);
      this.applyPopulateToQuery('findById', query);
      item = await query.exec();
      await afterFindById(ctx, item, data);
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    ctx.body = item;
  }

  async create(ctx) {
    const {
      model,
      beforeCreate = (ctx, data) => {
        return data;
      },
      afterCreate = () => {},
    } = this.props;
    let data = ctx.request.body;
    let item = {};
    try {
      data = await beforeCreate(ctx, data);
      item = await Model(model).create(data);
      await afterCreate(ctx, item, data);
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    ctx.body = item;
  }

  async update(ctx) {
    const {
      model,
      beforeUpdate = (ctx, id, data) => {
        return data;
      },
      afterUpdate = () => {},
    } = this.props;
    let data = ctx.request.body;
    let item = {};
    let query;
    try {
      apiHelper.cleanTimestamps(data);
      data = await beforeUpdate(ctx, ctx.params.id, data);
      query = Model(model).findByIdAndUpdate(
        ctx.params.id,
        { $set: data },
        { new: true, runValidators: true, context: 'query' }
      );
      this.applyPopulateToQuery('update', query);
      item = await query.exec();
      await afterUpdate(ctx, item, data);
    } catch (err) {
      logger.error(err);
      return ctx.throw(400, err);
    }
    ctx.body = item;
  }

  async delete(ctx) {
    const { model, beforeDelete = () => {}, afterDelete = () => {} } = this.props;
    let item = {};
    let query;
    try {
      await beforeDelete(ctx, ctx.params.id);
      query = Model(model).findByIdAndDelete(ctx.params.id);
      this.applyPopulateToQuery('delete', query);
      item = await query.exec();
      await afterDelete(ctx, item);
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
    ctx.body = count;
  }

  applyPopulateToQuery(method, query) {
    if (method && query && this.props.populate && this.props.populate[method]) {
      this.props.populate[method].forEach(entity => {
        query.populate(entity);
      });
    }
  }
}

module.exports = GenericAdminController;
