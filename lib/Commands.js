const path = require('path');
const colorprint = require('colorprint');
const { Select } = require('enquirer');
const ncp = require('ncp').ncp;
// const shell = require('shelljs');

class Commands {
  constructor(config) {
    this.config = config;
  }
  async install(cmsType) {
    const { cmsPackageDir, cmsInstallDir } = this.config;
    try {
      const prompt = new Select({
        name: 'type',
        message: 'CMS Type',
        choices: ['react', 'classic', 'headless'],
      });
      if (!cmsType) {
        cmsType = await prompt.run();
      }

      // Copy app folder
      await this.copyFolder(path.resolve(cmsPackageDir, 'app'), path.resolve(cmsInstallDir, 'app'));

      // console.log(cmsType);
      // console.log(this.cwd);
      // console.log(shell.pwd());
    } catch (e) {
      this.exit(e.message);
    }

    this.exit('Installtion Complete', 'info', 0);
  }

  copyFolder(src, dest, options = {}) {
    return new Promise((resolve, reject) => {
      ncp(src, dest, options, function(err) {
        if (err) {
          return reject(err);
        }
        resolve({ src, dest });
      });
    });
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
}

module.exports = Commands;
