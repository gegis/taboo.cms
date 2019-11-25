const path = require('path');
const validator = require('validator');
const cryptoRandomString = require('crypto-random-string');
const colorprint = require('colorprint');
const { Select, Input } = require('enquirer');
const ncp = require('ncp').ncp;
// const shell = require('shelljs');
const fs = require('fs');
const fsPromises = fs.promises;
const replace = require('replace-in-file');

class Commands {
  constructor(config) {
    this.config = config;
  }
  async install(cmsType, adminEmail) {
    const {
      cmsPackageDir,
      installDir,
      installPackageJson,
      cmsPackageJson,
      cmsPackageName,
      cmsPackageInstalledVersion,
    } = this.config;
    let replacePromises;
    try {
      const promptCmsType = new Select({
        name: 'type',
        message: 'CMS Type',
        choices: ['react', 'classic', 'headless'],
      });
      const promptAdminEmail = new Input({
        type: 'email',
        name: 'email',
        message: 'Please enter admin email:',
        validate: (value, state) => {
          if (!validator.isEmail(value)) {
            return state.styles.warning(`${value} is not a valid email!`);
          }
          return true;
        },
      });
      if (!cmsType) {
        cmsType = await promptCmsType.run();
      }
      if (!adminEmail) {
        adminEmail = await promptAdminEmail.run();
      }

      // Copy cms folders
      await this.copyFolder(path.resolve(cmsPackageDir, 'app'), path.resolve(installDir, 'app'));
      await this.copyFolder(path.resolve(cmsPackageDir, 'config'), path.resolve(installDir, 'config'));
      await this.copyFolder(path.resolve(cmsPackageDir, 'scripts'), path.resolve(installDir, 'scripts'));
      await this.copyFolder(path.resolve(cmsPackageDir, 'tasks'), path.resolve(installDir, 'tasks'));
      // These folders should keep only .gitkeep files
      await this.copyFolder(path.resolve(cmsPackageDir, 'data'), path.resolve(installDir, 'data'));
      await this.copyFolder(path.resolve(cmsPackageDir, 'logs'), path.resolve(installDir, 'logs'));
      await this.copyFolder(path.resolve(cmsPackageDir, 'public'), path.resolve(installDir, 'public'));

      // Copy cms files
      await this.copyFile(path.resolve(cmsPackageDir, '.babelrc'), path.resolve(installDir, '.babelrc'));
      await this.copyFile(path.resolve(cmsPackageDir, '.eslintignore'), path.resolve(installDir, '.eslintignore'));
      await this.copyFile(path.resolve(cmsPackageDir, '.eslintrc'), path.resolve(installDir, '.eslintrc'));
      await this.copyFile(path.resolve(cmsPackageDir, '.gitignore'), path.resolve(installDir, '.gitignore'));
      await this.copyFile(path.resolve(cmsPackageDir, '.prettierrc'), path.resolve(installDir, '.prettierrc'));
      await this.copyFile(path.resolve(cmsPackageDir, '.babelrc'), path.resolve(installDir, '.babelrc'));
      await this.copyFile(path.resolve(cmsPackageDir, 'gulpfile.js'), path.resolve(installDir, 'gulpfile.js'));
      await this.copyFile(path.resolve(cmsPackageDir, 'index.js'), path.resolve(installDir, 'index.js'));
      await this.copyFile(path.resolve(cmsPackageDir, 'pm2.json'), path.resolve(installDir, 'pm2.json'));
      await this.copyFile(
        path.resolve(cmsPackageDir, 'webpack.config.js'),
        path.resolve(installDir, 'webpack.config.js')
      );

      // TODO replace values in files by package.json values
      replacePromises = this.getReplaceInFilesOptions(cmsType, adminEmail).map(async replaceOptions => {
        await replace(replaceOptions);
      });
      await Promise.all(replacePromises);

      // TODO based on installation type - remove/update necessary files

      // Update install app package.json
      installPackageJson.dependencies = cmsPackageJson.dependencies;
      installPackageJson.dependencies[cmsPackageName] = cmsPackageInstalledVersion;
      installPackageJson.devDependencies = cmsPackageJson.devDependencies;
      installPackageJson.scripts = cmsPackageJson.scripts;
      installPackageJson['pre-commit'] = cmsPackageJson['pre-commit'];
      await this.writeToFile(path.resolve(installDir, 'package.json'), JSON.stringify(installPackageJson, null, 2));
    } catch (e) {
      this.log(e, 'error');
      this.exit(e.message);
    }
    this.exit("Installation Complete. Please run 'npm i' to make sure everything is installed.", 'info', 0);
  }

  getReplaceInFilesOptions(installType, adminEmail) {
    const { installDir, installPackageName } = this.config;
    const secret1 = cryptoRandomString({ length: 20, type: 'url-safe' });
    const secret2 = cryptoRandomString({ length: 20, type: 'url-safe' });
    return [
      {
        files: path.resolve(installDir, 'app/locales/en-gb.js'),
        from: "companyName: 'Taboo Solutions',",
        to: `companyName: '${installPackageName}',`,
      },
      {
        files: path.resolve(installDir, 'app/modules/db/services/InitDbService.js'),
        from: ["firstName: 'Taboo',", "lastName: 'CMS',", "email: 'admin@taboo.solutions',"],
        to: [`firstName: '${installPackageName}',`, `lastName: '${installPackageName}',`, `email: '${adminEmail}',`],
      },
      {
        files: path.resolve(installDir, 'config/db.js'),
        from: "database: 'taboo-cms',",
        to: `database: '${installPackageName}',`,
      },
      {
        files: path.resolve(installDir, 'config/mailer.js'),
        from: "from: 'Taboo Solutions <info@taboo.solutions>',",
        to: `from: '${installPackageName} ${adminEmail}',`,
      },
      {
        files: path.resolve(installDir, 'config/server.js'),
        from: [
          "secretKeys: ['REPLACE-ME-123456', '654321-REPLACE-ME'],",
          "defaultPageTitle: 'Taboo Solutions',",
          "key: 'taboo.sid',",
        ],
        to: [
          `secretKeys: ['${secret1}', '${secret2}'],`,
          `defaultPageTitle: '${installPackageName}',`,
          `key: '${installPackageName}.sid',`,
        ],
      },
      {
        files: path.resolve(installDir, 'scripts/**/*.*'),
        from: /taboo-cms/g,
        to: installPackageName,
      },
    ];
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
      console.error(msg); // eslint-disable-line no-console
    } else {
      colorprint[type](msg);
    }
  }
}

module.exports = Commands;
