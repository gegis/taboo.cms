const colorprint = require('colorprint');
const ncp = require('ncp').ncp;
const fs = require('fs');
const fsPromises = fs.promises;

class CLIHelper {
  async copyFolder(src, dest, options = {}) {
    return new Promise((resolve, reject) => {
      ncp(src, dest, options, function(err) {
        if (err) {
          return reject(err);
        }
        resolve({ src, dest });
      });
    });
  }

  async copyFile(src, dest) {
    return await fsPromises.copyFile(src, dest);
  }

  async writeToFile(file, data, options = {}) {
    return await fsPromises.writeFile(file, data, options);
  }

  async createDir(dirPath, options = {}) {
    return await fsPromises.mkdir(dirPath, options);
  }

  async moveFile(from, to) {
    return await fsPromises.rename(from, to);
  }

  async deleteFile(filePath) {
    return await fsPromises.unlink(filePath);
  }

  async deleteDir(dirPath) {
    return await this.deleteDirRecursive(dirPath);
  }

  async deleteDirRecursive(dirPath) {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach(file => {
        const curPath = dirPath.join(dirPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          this.deleteDirRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(dirPath);
    }
  }

  firstUpper(string = '') {
    if (string && string.length > 0) {
      string = string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
  }

  firstLower(string = '') {
    if (string && string.length > 0) {
      string = string.charAt(0).toLowerCase() + string.slice(1);
    }
    return string;
  }

  /**
   *
   * @param msg
   * @param type - notice, info, debug, trace, warn, error, fatal
   * @param code
   */
  exit(msg, type = 'error', code = 1) {
    colorprint[type](msg);
    process.exit(code);
  }

  /**
   * @param err
   * @param type - notice, info, debug, trace, warn, error, fatal
   */
  log(msg, type = 'error') {
    if (typeof msg === 'object') {
      colorprint[type](type.toUpperCase());
      console.error(msg); // eslint-disable-line no-console
    } else {
      colorprint[type](msg);
    }
  }
}

module.exports = new CLIHelper();
