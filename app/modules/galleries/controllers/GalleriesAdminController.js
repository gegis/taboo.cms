const { Model, Helper, apiHelper, config } = require('@taboo/cms-core');

class GalleriesAdminController {
  async findAll(ctx) {
    const requestParams = ctx.request.query;
    const {
      api: {
        galleries: { defaultSort = null },
      },
    } = config;
    let { filter = {}, fields, limit, skip, sort } = apiHelper.parseRequestParams(ctx.request.query, [
      'filter',
      'fields',
      'limit',
      'skip',
      'sort',
    ]);
    let searchFields = ['title'];
    if (sort === null) {
      sort = defaultSort;
    }
    if (requestParams && requestParams.search) {
      Helper('core.Core').applySearchToFilter(requestParams.search, searchFields, filter);
    }
    ctx.body = await Model('galleries.Gallery').find(filter, fields, { limit, skip, sort });
  }

  async findById(ctx) {
    const { fields } = apiHelper.parseRequestParams(ctx.request.query, ['fields']);
    const item = await Model('galleries.Gallery')
      .findById(ctx.params.id, fields)
      .populate('images');
    ctx.body = item;
  }

  async create(ctx) {
    const data = ctx.request.body;
    ctx.body = await Model('galleries.Gallery').create(data);
  }

  async update(ctx) {
    const data = ctx.request.body;
    apiHelper.cleanTimestamps(data);
    ctx.body = await Model('galleries.Gallery').findByIdAndUpdate(ctx.params.id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(ctx) {
    ctx.body = await Model('galleries.Gallery').findByIdAndDelete(ctx.params.id);
  }

  async count(ctx) {
    ctx.body = await Model('galleries.Gallery').estimatedDocumentCount();
  }
}

module.exports = new GalleriesAdminController();
