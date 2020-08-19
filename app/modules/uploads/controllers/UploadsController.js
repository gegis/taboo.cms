const { logger, config, filesHelper } = require('@taboo/cms-core');
const fs = require('fs');
const path = require('path');
const CoreHelper = require('modules/core/helpers/CoreHelper');
const UploadsService = require('modules/uploads/services/UploadsService');
const UploadsHelper = require('modules/uploads/helpers/UploadsHelper');
const UploadModel = require('modules/uploads/models/UploadModel');

class UploadsController {
  async uploadUserFile(ctx) {
    const {
      uploads: { appendTimestamp, userAllowedDocumentTypes, userAllowedImageTypes, userUploadsPath, userUrlPath } = {},
    } = config.server;
    const {
      users: { documentNames = ['documentPersonal1', 'documentPersonal2', 'documentIncorporation'] },
    } = config;
    let {
      files: { file = null } = {},
      header: { 'document-name': documentName = '', 'is-private': isPrivate = false },
    } = ctx.request;
    const data = {};
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    // if one of documentNames, we assume it is user document and not image
    const isDocument = documentNames.indexOf(documentName) !== -1;
    const isProfilePicture = documentName === 'profilePicture';
    let resizeResult, tmpPath, fileName, url, filePath, fileSize, prettyFileName, dbItem;

    if (isDocument) {
      isPrivate = true;
    }

    try {
      if (!file) {
        throw new Error('File was no uploaded');
      }
      if (!userUploadsPath) {
        throw new Error('Uploads dir not specified');
      }
      UploadsService.validateFileSize(file);
      if (isDocument) {
        if (userAllowedDocumentTypes.indexOf(file.type) === -1) {
          throw new Error(`File type ${file.type} is not allowed`);
        }
      } else {
        if (userAllowedImageTypes.indexOf(file.type) === -1) {
          throw new Error(`File type ${file.type} is not allowed`);
        }
      }

      tmpPath = file.path;
      prettyFileName = file.name;
      fileName = UploadsHelper.getFileName(file.name, appendTimestamp);
      url = path.join(userUrlPath, file.type, fileName);
      filePath = UploadsService.getUserFilePath(userId, file.type, fileName);
      await filesHelper.moveFile(tmpPath, filePath);

      if (!isDocument && file.type !== 'image/gif') {
        if (isProfilePicture) {
          resizeResult = await UploadsService.processUserImage(filePath, { width: 300 }, true);
        } else {
          resizeResult = await UploadsService.processUserImage(filePath);
        }
        if (resizeResult && resizeResult.newPath) {
          await filesHelper.unlinkFile(resizeResult.oldPath);
          filePath = resizeResult.newPath;
          fileSize = parseInt(filesHelper.getFileSize(filePath));
        }
      }

      data.size = fileSize || parseInt(file.size);
      data.name = prettyFileName;
      data.type = file.type;
      data.url = url;
      data.path = filePath;
      data.user = userId;
      data.isUserFile = true;
      data.isPrivate = isPrivate;
      data.isDocument = isDocument;
      data.documentName = documentName;

      dbItem = await UploadModel.create(data);
      dbItem.url = path.join(userUrlPath, dbItem._id.toString());
      await dbItem.save();
      await UploadsService.updateUserFiles(ctx, userId, dbItem);
    } catch (e) {
      logger.error(e);
      if (filePath && filesHelper.fileExists(filePath)) {
        filesHelper.unlinkFile(filePath);
      }
      ctx.throw(400, e);
    }
    ctx.body = dbItem;
  }

  async serveUserFiles(ctx) {
    const { session: { user: { id: userId, admin } = {} } = {} } = ctx;
    const file = await UploadModel.findById(ctx.params.id);
    const params = Object.assign({}, ctx.request.query);
    let filePath;
    if (!file) {
      return ctx.throw(404, 'Not Found');
    }
    if (file.isPrivate && file.isUserFile && !admin && file.user.toString() !== userId) {
      return ctx.throw(401, 'Not Authorized');
    }
    filePath = file.path;
    if (params.size) {
      filePath = UploadsHelper.getFilePathWithSuffix(filePath, params.size);
    }
    if (!filesHelper.fileExists(filePath)) {
      return ctx.throw(404, 'Not Found');
    }
    ctx.set('Content-Type', file.type);
    ctx.body = fs.createReadStream(filePath);
  }

  async apiGetUserUploads(ctx) {
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    const defaultFilter = { user: userId, isUserFile: true };
    const defaultSort = { createdAt: 'desc' };
    const searchFields = ['name', 'url'];
    const params = CoreHelper.parseRequestParams(ctx, { defaultFilter, searchFields, defaultSort });
    let uploads = [];
    if (userId) {
      uploads = await UploadModel.find(params.filter, params.fields, params.options);
    }
    ctx.body = uploads;
  }
}

module.exports = new UploadsController();
