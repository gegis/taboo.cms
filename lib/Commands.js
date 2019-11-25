const path = require('path');
const colorprint = require('colorprint');
const { Select } = require('enquirer');
const ncp = require('ncp').ncp;
// const shell = require('shelljs');
const fs = require('fs');
const fsPromises = fs.promises;

class Commands {
  constructor(config) {
    this.config = config;
    this.installConfig = {
      name: '',
    };
  }
  async install(cmsType) {
    const { cmsPackageDir, cmsInstallDir } = this.config;
    const cmsPackageJson = require(path.resolve(cmsPackageDir, 'package.json'));
    const installPackageJson = require(path.resolve(cmsInstallDir, 'package.json'));
    const cmsPackageName = cmsPackageJson.name;
    const installPackageName = installPackageJson.name;
    console.log(cmsPackageJson.name);
    const cmsPackageInstalledVersion = installPackageJson.dependencies[cmsPackageName] || cmsPackageJson.version;
    try {
      const prompt = new Select({
        name: 'type',
        message: 'CMS Type',
        choices: ['react', 'classic', 'headless'],
      });
      if (!cmsType) {
        cmsType = await prompt.run();
      }

      // // Copy cms folders
      // await this.copyFolder(path.resolve(cmsPackageDir, 'app'), path.resolve(cmsInstallDir, 'app'));
      // await this.copyFolder(path.resolve(cmsPackageDir, 'config'), path.resolve(cmsInstallDir, 'config'));
      // await this.copyFolder(path.resolve(cmsPackageDir, 'scripts'), path.resolve(cmsInstallDir, 'scripts'));
      // await this.copyFolder(path.resolve(cmsPackageDir, 'tasks'), path.resolve(cmsInstallDir, 'tasks'));
      // // These folders should keep only .gitkeep files
      // await this.copyFolder(path.resolve(cmsPackageDir, 'data'), path.resolve(cmsInstallDir, 'data'));
      // await this.copyFolder(path.resolve(cmsPackageDir, 'logs'), path.resolve(cmsInstallDir, 'logs'));
      // await this.copyFolder(path.resolve(cmsPackageDir, 'public'), path.resolve(cmsInstallDir, 'public'));
      //
      // // Copy cms files
      // await this.copyFile(path.resolve(cmsPackageDir, '.babelrc'), path.resolve(cmsInstallDir, '.babelrc'));
      // await this.copyFile(path.resolve(cmsPackageDir, '.eslintignore'), path.resolve(cmsInstallDir, '.eslintignore'));
      // await this.copyFile(path.resolve(cmsPackageDir, '.eslintrc'), path.resolve(cmsInstallDir, '.eslintrc'));
      // await this.copyFile(path.resolve(cmsPackageDir, '.gitignore'), path.resolve(cmsInstallDir, '.gitignore'));
      // await this.copyFile(path.resolve(cmsPackageDir, '.prettierrc'), path.resolve(cmsInstallDir, '.prettierrc'));
      // await this.copyFile(path.resolve(cmsPackageDir, '.babelrc'), path.resolve(cmsInstallDir, '.babelrc'));
      // await this.copyFile(path.resolve(cmsPackageDir, 'gulpfile.js'), path.resolve(cmsInstallDir, 'gulpfile.js'));
      // await this.copyFile(path.resolve(cmsPackageDir, 'index.js'), path.resolve(cmsInstallDir, 'index.js'));
      // await this.copyFile(path.resolve(cmsPackageDir, 'pm2.json'), path.resolve(cmsInstallDir, 'pm2.json'));
      // await this.copyFile(
      //   path.resolve(cmsPackageDir, 'webpack.config.js'),
      //   path.resolve(cmsInstallDir, 'webpack.config.js')
      // );

      // TODO replace values in files by package.json values
      console.log('REPLACE ME');
      console.log(installPackageName);

      // TODO based on installation type - remove/update necessary files

      // Update install app package.json
      installPackageJson.dependencies = cmsPackageJson.dependencies;
      installPackageJson.dependencies[cmsPackageName] = cmsPackageInstalledVersion;
      installPackageJson.devDependencies = cmsPackageJson.devDependencies;
      installPackageJson.scripts = cmsPackageJson.scripts;
      installPackageJson['pre-commit'] = cmsPackageJson['pre-commit'];
      await this.writeToFile(path.resolve(cmsInstallDir, 'package.json'), JSON.stringify(installPackageJson, null, 2));
    } catch (e) {
      this.log(e, 'error');
      this.exit(e.message);
    }
    this.exit("Installation Complete. Please run 'npm i' to make sure everything is installed.", 'info', 0);
  }

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
      console.error(msg);
    } else {
      colorprint[type](msg);
    }
  }
}

module.exports = Commands;
