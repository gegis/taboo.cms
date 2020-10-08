const { config, filesHelper } = require('@taboo/cms-core');
const path = require('path');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const UploadsService = require('modules/uploads/services/UploadsService');
const UploadModel = require('modules/uploads/models/UploadModel');
const UsersService = require('modules/users/services/UsersService');

const {
  api: {
    uploads: { defaultSort = null },
  },
} = config;

class UploadsAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: UploadModel,
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
      uploads: { uploadsPath, allowedTypes, urlPath, appendTimestamp },
    } = config.server;
    const { files: { file = null } = {} } = ctx.request;
    const user = await UsersService.getCurrentUser(ctx);
    const data = {};
    let tmpPath, fileName, url, filePath, prettyFileName;
    try {
      if (!file) {
        throw new Error('File was no uploaded');
      }
      if (!uploadsPath) {
        throw new Error('Uploads dir not specified');
      }
      if (allowedTypes.indexOf(file.type) === -1) {
        throw new Error(`File type ${file.type} is not allowed`);
      }

      tmpPath = file.path;
      prettyFileName = file.name;
      fileName = UploadsService.getUploadFileName(file.name, appendTimestamp);
      url = path.join(urlPath, file.type, fileName);
      filePath = path.resolve(uploadsPath, file.type, fileName);
      await filesHelper.moveFile(tmpPath, filePath);

      data.size = parseInt(file.size);
      data.name = prettyFileName;
      data.type = file.type;
      data.url = url;
      data.path = filePath;
      data.user = user.id;
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
