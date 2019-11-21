const { config, filesHelper, Service } = require('@taboo/cms-core');
const path = require('path');

const AdminController = require('../../core/controllers/AdminController');
const {
  api: {
    uploads: { defaultSort = null },
  },
} = config;

class UploadsAdminController extends AdminController {
  constructor() {
    super({
      model: 'uploads.Upload',
      searchFields: ['_id', 'name', 'url', 'user'],
      searchOptions: {
        idFields: ['_id', 'user'],
      },
      defaultSort,
      populate: {
        findAll: ['user'],
        findById: ['user'],
        create: ['user'],
        update: ['user'],
      },
    });
  }

  async beforeCreate(ctx) {
    const {
      uploads: { uploadsDir, allowedTypes, urlPath, appendTimestamp },
    } = config.server;
    const { files: { file = null } = {} } = ctx.request;
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    const data = {};
    let tmpPath, fileName, url, filePath, prettyFileName;
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
      fileName = Service('uploads.Uploads').getUploadFileName(file.name, appendTimestamp);
      url = path.join(urlPath, file.type, fileName);
      filePath = path.resolve(uploadsDir, file.type, fileName);
      await filesHelper.moveFile(tmpPath, filePath);

      data.size = parseInt(file.size);
      data.name = prettyFileName;
      data.type = file.type;
      data.url = url;
      data.path = filePath;
      data.user = userId;
    } catch (e) {
      if (filePath && filesHelper.fileExists(filePath)) {
        filesHelper.unlinkFile(filePath);
      }
      return ctx.throw(e);
    }
    return data;
  }

  async afterDelete(ctx, dbItem) {
    if (dbItem && dbItem.path && filesHelper.fileExists(dbItem.path)) {
      filesHelper.unlinkFile(dbItem.path);
    }
    return dbItem;
  }
}

module.exports = new UploadsAdminController();
