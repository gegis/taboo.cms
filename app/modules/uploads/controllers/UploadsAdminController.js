const { Model, apiHelper, config, filesHelper, Helper } = require('@taboo/cms-core');
const path = require('path');

class UploadsAdminController {
  constructor() {
    this.create = this.create.bind(this);
  }
  async findAll(ctx) {
    const requestParams = ctx.request.query;
    const {
      api: {
        uploads: { defaultSort = null },
      },
    } = config;
    let { filter, fields, limit, skip, sort } = apiHelper.parseRequestParams(ctx.request.query, [
      'filter',
      'fields',
      'limit',
      'skip',
      'sort',
    ]);
    let searchFields = ['name', 'url', 'user'];
    if (requestParams && requestParams.search) {
      Helper('core.Core').applySearchToFilter(requestParams.search, searchFields, filter, { idFields: ['user'] });
    }
    if (sort === null) {
      sort = defaultSort;
    }
    ctx.body = await Model('uploads.Upload')
      .find(filter, fields, { limit, skip, sort })
      .populate('user');
  }

  async findById(ctx) {
    const { fields } = apiHelper.parseRequestParams(ctx.request.query, ['fields']);
    ctx.body = await Model('uploads.Upload').findById(ctx.params.id, fields);
  }

  async create(ctx) {
    const {
      uploads: { uploadsDir, allowedTypes, urlPath, appendTimestamp },
    } = config.server;
    const { files: { file = null } = {} } = ctx.request;
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    const data = {};
    let tmpPath, fileName, url, filePath, prettyFileName, dbItem;
    try {
      if (!file) {
        throw new Error('File was no uploaded');
      }
      if (!uploadsDir) {
        throw new Error('Uploads dir not specified');
      }
      if (allowedTypes.indexOf(file.type) === -1) {
        throw new Error(`File type ${file.type} is not allowed`);
      }

      tmpPath = file.path;
      prettyFileName = file.name;
      fileName = this.getFileName(file.name, appendTimestamp);
      url = path.join(urlPath, file.type, fileName);
      filePath = path.resolve(uploadsDir, file.type, fileName);
      await filesHelper.moveFile(tmpPath, filePath);

      data.size = parseInt(file.size);
      data.name = prettyFileName;
      data.type = file.type;
      data.url = url;
      data.path = filePath;
      data.user = userId;

      dbItem = await Model('uploads.Upload').create(data);
    } catch (e) {
      if (filePath && filesHelper.fileExists(filePath)) {
        filesHelper.unlinkFile(filePath);
      }
      ctx.throw(e);
    }
    ctx.body = dbItem;
  }

  async update(ctx) {
    const data = ctx.request.body;
    apiHelper.cleanTimestamps(data);
    ctx.body = await Model('uploads.Upload')
      .findByIdAndUpdate(ctx.params.id, data, { new: true, runValidators: true })
      .populate('user');
  }

  async delete(ctx) {
    const dbItem = await Model('uploads.Upload').findByIdAndDelete(ctx.params.id);
    if (dbItem && dbItem.path && filesHelper.fileExists(dbItem.path)) {
      filesHelper.unlinkFile(dbItem.path);
    }
    ctx.body = dbItem;
  }

  async count(ctx) {
    ctx.body = await Model('uploads.Upload').estimatedDocumentCount();
  }

  getFileName(fileName, appendTimestamp) {
    let fileNameParts;
    if (appendTimestamp) {
      fileNameParts = filesHelper.getFileNameParts(fileName);
      fileNameParts.name += '-' + Helper('core.Core').getUnixTimestamp();
      fileName = [fileNameParts.name, fileNameParts.extension].join('.');
    }
    return fileName;
  }
}

module.exports = new UploadsAdminController();
