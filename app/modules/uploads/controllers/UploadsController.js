const { Model, logger, config, filesHelper, Helper, Service } = require('@taboo/cms-core');
const fs = require('fs');
const path = require('path');

class UploadsController {
  async uploadUserFile(ctx) {
    const {
      uploads: { appendTimestamp, secureAllowedTypes, secureAllowedImageTypes, secureUploadsDir, secureUrlPath },
    } = config.server;
    const {
      users: { documentTypes = ['documentPassport1', 'documentPassport2', 'documentIncorporation'] },
    } = config;
    const {
      files: { file = null } = {},
      header: { 'user-document-type': userDocType = '' },
    } = ctx.request;
    const data = {};
    const { session: { user: { id: userId } = {} } = {} } = ctx;
    const isUserDocument = documentTypes.indexOf(userDocType) !== -1; // if not one of documentTypes, we assume it is image
    const isProfilePicture = userDocType === 'profilePicture'; // if not one of documentTypes, we assume it is image
    let resizeResult, tmpPath, fileName, url, filePath, fileSize, prettyFileName, dbItem;

    try {
      if (!file) {
        throw new Error('File was no uploaded');
      }
      if (!secureUploadsDir) {
        throw new Error('Uploads dir not specified');
      }
      if (isUserDocument) {
        if (secureAllowedTypes.indexOf(file.type) === -1) {
          throw new Error(`File type ${file.type} is not allowed`);
        }
      } else {
        if (secureAllowedImageTypes.indexOf(file.type) === -1) {
          throw new Error(`File type ${file.type} is not allowed`);
        }
      }

      tmpPath = file.path;
      prettyFileName = file.name;
      fileName = Helper('uploads.Uploads').getFileName(file.name, appendTimestamp);
      url = path.join(secureUrlPath, file.type, fileName);
      filePath = path.resolve(secureUploadsDir, file.type, fileName);
      await filesHelper.moveFile(tmpPath, filePath);

      if (!isUserDocument) {
        resizeResult = await Service('uploads.Uploads').processUserImage(filePath, isProfilePicture);
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
      data.isUserDocument = isUserDocument;
      data.documentType = userDocType;

      dbItem = await Model('uploads.Upload').create(data);
      if (secureUrlPath) {
        dbItem.url = path.join(secureUrlPath, dbItem._id.toString());
        await dbItem.save();
      }
      await Service('uploads.Uploads').updateUserFiles(ctx, userId, dbItem);
    } catch (e) {
      logger.error(e);
      if (filePath && filesHelper.fileExists(filePath)) {
        filesHelper.unlinkFile(filePath);
      }
      ctx.throw(e);
    }
    ctx.body = dbItem;
  }

  async serveSecureUserFiles(ctx) {
    const { session: { user: { id: userId, admin } = {} } = {} } = ctx;
    const file = await Model('uploads.Upload').findById(ctx.params.id);
    const params = Object.assign({}, ctx.request.query);
    let filePath;
    if (!file) {
      return ctx.throw(404, 'Not Found');
    }
    if (file.isUserDocument && !admin && file.user.toString() !== userId) {
      return ctx.throw(401, 'Not Authorized');
    }
    filePath = file.path;
    if (params.size) {
      filePath = Helper('uploads.Uploads').getFilePathWithSuffix(filePath, params.size);
    }
    if (!filesHelper.fileExists(filePath)) {
      return ctx.throw(404, 'Not Found');
    }
    ctx.set('Content-Type', file.type);
    ctx.body = fs.createReadStream(filePath);
  }
}

module.exports = new UploadsController();
