const path = require('path');
const { filesHelper } = require('@taboo/cms-core');
const CoreHelper = require('modules/core/helpers/CoreHelper');

class UploadsHelper {
  getFileName(fileName, appendTimestamp) {
    let fileNameParts;
    if (appendTimestamp) {
      fileNameParts = filesHelper.getFileNameParts(fileName);
      fileNameParts.name = CoreHelper.parseSlug(fileNameParts.name);
      fileNameParts.name += '-' + CoreHelper.getUnixTimestamp();
      fileName = [fileNameParts.name, fileNameParts.extension].join('.');
    }
    return fileName;
  }

  getFilePathWithSuffix(filePath, suffix) {
    let newPath = null;
    let dirPath;
    let fileNameParts;
    if (filePath && suffix) {
      dirPath = path.dirname(filePath);
      fileNameParts = filesHelper.getFileNameParts(filePath);
      fileNameParts.name += '-' + suffix;
      newPath = path.join(dirPath, [fileNameParts.name, fileNameParts.extension].join('.'));
    }
    return newPath;
  }
}

module.exports = new UploadsHelper();
