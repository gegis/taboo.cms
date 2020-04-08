const sharp = require('sharp');
const { config, filesHelper } = require('@taboo/cms-core');
const CoreHelper = require('modules/core/helpers/CoreHelper');
const UploadsHelper = require('modules/uploads/helpers/UploadsHelper');
const UserModel = require('modules/users/models/UserModel');

class UploadsService {
  getUploadFileName(fileName, appendTimestamp) {
    let fileNameParts;
    if (appendTimestamp) {
      fileNameParts = filesHelper.getFileNameParts(fileName);
      fileNameParts.name += '-' + CoreHelper.getUnixTimestamp();
      fileName = [fileNameParts.name, fileNameParts.extension].join('.');
    }
    return fileName;
  }

  async updateUserFiles(ctx, userId, document) {
    const {
      users: { documentTypes = ['documentPersonal1', 'documentPersonal2', 'documentIncorporation'] },
    } = config;
    const user = await UserModel.findById(userId);
    const userDocType = document.documentType;
    const matchingTypes = [];

    user[userDocType] = document._id.toString();

    if (user.verificationStatus === 'new' && documentTypes.indexOf(userDocType) !== -1) {
      documentTypes.map(docType => {
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

    if (userDocType === 'profilePicture' && ctx.session.user) {
      ctx.session.user.profilePictureUrl = document.url;
    }

    await user.save();
    return user;
  }

  async processUserImage(filePath, isProfilePicture) {
    const defaultSize = {
      height: 600,
    };
    const mdSize = {
      width: 260,
      height: 260,
    };
    const smSize = {
      width: 140,
      height: 140,
    };
    const xsSize = {
      width: 64,
      height: 64,
    };
    const result = await this.resizeImage(
      filePath,
      UploadsHelper.getFilePathWithSuffix(filePath, 'resized'),
      defaultSize
    );
    if (isProfilePicture) {
      await this.resizeImage(filePath, UploadsHelper.getFilePathWithSuffix(result.newPath, 'md'), mdSize);
      await this.resizeImage(filePath, UploadsHelper.getFilePathWithSuffix(result.newPath, 'sm'), smSize);
      await this.resizeImage(filePath, UploadsHelper.getFilePathWithSuffix(result.newPath, 'xs'), xsSize);
    }

    return result;
  }

  async resizeImage(filePath, newPath, options = {}) {
    const imageOptions = Object.assign(
      {},
      {
        width: null,
        height: null,
      },
      options
    );
    const result = {
      oldPath: filePath,
      newPath: newPath,
      result: null,
    };
    result.result = await sharp(filePath)
      .resize(imageOptions.width, imageOptions.height)
      // .sharpen()
      .toFile(newPath);
    return result;
  }
}

module.exports = new UploadsService();
