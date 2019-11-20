const sharp = require('sharp');
const { config, Model, Helper } = require('@taboo/cms-core');

class UploadsService {
  async updateUserFiles(ctx, userId, document) {
    const {
      users: { documentTypes = ['documentPassport1', 'documentPassport2', 'documentIncorporation'] },
    } = config;
    const user = await Model('users.User').findById(userId);
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
        matchingTypes.indexOf('documentPassport1') !== -1 &&
        matchingTypes.indexOf('documentPassport2') !== -1 &&
        matchingTypes.indexOf('documentIncorporation') !== -1
      ) {
        user.verificationStatus = 'pending';
      } else if (
        !user.businessAccount &&
        matchingTypes.indexOf('documentPassport1') !== -1 &&
        matchingTypes.indexOf('documentPassport2') !== -1
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
      Helper('uploads.Uploads').getFilePathWithSuffix(filePath, 'resized'),
      defaultSize
    );
    if (isProfilePicture) {
      await this.resizeImage(filePath, Helper('uploads.Uploads').getFilePathWithSuffix(result.newPath, 'md'), mdSize);
      await this.resizeImage(filePath, Helper('uploads.Uploads').getFilePathWithSuffix(result.newPath, 'sm'), smSize);
      await this.resizeImage(filePath, Helper('uploads.Uploads').getFilePathWithSuffix(result.newPath, 'xs'), xsSize);
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
