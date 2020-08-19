import UnitsHelper from 'app/modules/core/ui/helpers/UnitsHelper.js';

const { uploads: { userMaxFileSize = 0, userMaxGifFileSize = 0 } = {} } = window.app.config;

class UploadsHelper {
  validateFileSize(file) {
    if (file && file.size > userMaxFileSize) {
      throw new Error(`File size is too large. Maximum allowed size is ${UnitsHelper.parseSizeAsMB(userMaxFileSize)}`);
    }
    if (file && file.type === 'image/gif' && file.size > userMaxGifFileSize) {
      throw new Error(
        `GIF size is too large. Maximum allowed size is ${UnitsHelper.parseSizeAsMB(userMaxGifFileSize)}`
      );
    }
  }
}

export default new UploadsHelper();
