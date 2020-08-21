const { config, filesHelper, events, logger } = require('@taboo/cms-core');
const fse = require('fs-extra');
const sharp = require('sharp');
const path = require('path');
const CoreHelper = require('modules/core/helpers/CoreHelper');
const UploadsHelper = require('modules/uploads/helpers/UploadsHelper');
const UploadModel = require('modules/uploads/models/UploadModel');
const UserModel = require('modules/users/models/UserModel');

const {
  uploads: { userUploadsPath, imageSizes = {}, userMaxFileSize = 0, userMaxGifFileSize = 0 } = {},
} = config.server;

class UploadsService {
  constructor() {
    events.on('onUserDelete', this.onUserDelete.bind(this));
  }

  getUploadFileName(fileName, appendTimestamp) {
    let fileNameParts;
    if (appendTimestamp) {
      fileNameParts = filesHelper.getFileNameParts(fileName);
      fileNameParts.name += '-' + CoreHelper.getUnixTimestamp();
      fileName = [fileNameParts.name, fileNameParts.extension].join('.');
    }
    return fileName;
  }

  getUserFilePath(userId, fileType, fileName) {
    return path.resolve(userUploadsPath, userId, fileType, fileName);
  }

  getUserFilesFolderPath(userId) {
    return path.resolve(userUploadsPath, userId);
  }

  async updateUserFiles(ctx, userId, document) {
    const {
      users: { documentNames = ['documentPersonal1', 'documentPersonal2', 'documentIncorporation'] } = {},
    } = config;
    const user = await UserModel.findById(userId);
    const documentName = document.documentName;
    const matchingTypes = [];

    user[documentName] = document._id.toString();

    if (user.verificationStatus === 'new' && documentNames.indexOf(documentName) !== -1) {
      documentNames.map(docType => {
        if (user[docType]) {
          matchingTypes.push(docType);
        }
      });
      if (
        user.businessAccount &&
        matchingTypes.indexOf('documentPersonal1') !== -1 &&
        matchingTypes.indexOf('documentPersonal2') !== -1 &&
        matchingTypes.indexOf('documentIncorporation') !== -1
      ) {
        user.verificationStatus = 'pending';
      } else if (
        !user.businessAccount &&
        matchingTypes.indexOf('documentPersonal1') !== -1 &&
        matchingTypes.indexOf('documentPersonal2') !== -1
      ) {
        user.verificationStatus = 'pending';
      }
    }

    if (documentName === 'profilePicture' && ctx.session.user) {
      ctx.session.user.profilePictureUrl = document.url;
    }

    await user.save();
    return user;
  }

  async processUserImage(filePath, defaultSize = null, resizeToAllSizes = false) {
    if (!defaultSize) {
      defaultSize = imageSizes.defaultSize;
    }
    const result = await this.resizeImage(
      filePath,
      UploadsHelper.getFilePathWithSuffix(filePath, 'resized'),
      defaultSize,
      { withoutEnlargement: true }
    );
    if (resizeToAllSizes) {
      await this.resizeToAllSizes(filePath, result);
    }

    return result;
  }

  async resizeToAllSizes(filePath, result) {
    await this.resizeImage(filePath, UploadsHelper.getFilePathWithSuffix(result.newPath, 'xl'), imageSizes.xlSize);
    await this.resizeImage(filePath, UploadsHelper.getFilePathWithSuffix(result.newPath, 'lg'), imageSizes.lgSize);
    await this.resizeImage(filePath, UploadsHelper.getFilePathWithSuffix(result.newPath, 'md'), imageSizes.mdSize);
    await this.resizeImage(filePath, UploadsHelper.getFilePathWithSuffix(result.newPath, 'sm'), imageSizes.smSize);
    await this.resizeImage(filePath, UploadsHelper.getFilePathWithSuffix(result.newPath, 'xs'), imageSizes.xsSize);
  }

  async resizeImage(filePath, newPath, sizeOptions = {}, options = {}) {
    const imageSizeOptions = Object.assign(
      {},
      {
        width: null,
        height: null,
      },
      sizeOptions
    );
    const result = {
      oldPath: filePath,
      newPath: newPath,
      result: null,
    };
    result.result = await sharp(filePath)
      .resize(imageSizeOptions.width, imageSizeOptions.height, options)
      // .sharpen()
      .toFile(newPath);
    return result;
  }

  async onUserDelete(user) {
    let userDir;
    if (user && user._id) {
      try {
        userDir = this.getUserFilesFolderPath(user._id.toString());
        await UploadModel.deleteMany({ user: user._id });
        fse.remove(userDir);
      } catch (e) {
        logger.error(e);
      }
    }
  }

  validateFileSize(file) {
    if (file && file.size > userMaxFileSize) {
      throw new Error(`File size is too large. Maximum allowed size is ${this.parseSizeAsMB(userMaxFileSize, 1)}`);
    }
    if (file && file.type === 'image/gif' && file.size > userMaxGifFileSize) {
      throw new Error(`GIF size is too large. Maximum allowed size is ${this.parseSizeAsMB(userMaxGifFileSize, 1)}`);
    }
  }

  parseSizeAsMB(value, decimalPlaces = 2) {
    if (value) {
      return parseFloat(parseInt(value) / 1048576).toFixed(decimalPlaces) + ' MB';
    }
    return null;
  }
}

module.exports = new UploadsService();
