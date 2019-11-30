const path = require('path');
const validator = require('validator');
const cryptoRandomString = require('crypto-random-string');

const { Select, Input } = require('enquirer');

const replace = require('replace-in-file');

class InstallCommand {
  constructor(config, { cliHelper }) {
    this.config = config;
    this.cliHelper = cliHelper;
  }
  async init(cmsType, adminEmail) {
    const { cmsPackageDir, installDir, cmsPackageName } = this.config;
    if (installDir === cmsPackageDir) {
      this.cliHelper.exit(`You cannot install within '${cmsPackageName}' module`);
    }
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

      // TODO needs implementing other cmsTypes: classic and headless
      if (cmsType !== 'react') {
        this.cliHelper.exit("At the moment only 'react' CMS type is supported. We are working on other types!");
      }
      if (!adminEmail) {
        adminEmail = await promptAdminEmail.run();
      }

      await this.copyCmsFolders(cmsPackageDir, installDir);
      await this.copyCmsFiles(cmsPackageDir, installDir);
      await this.replaceValuesInFiles(cmsType, adminEmail);
      // TODO based on cmsType - remove/update unnecessary files
      await this.updatePackageJson(cmsType);
    } catch (e) {
      this.cliHelper.log(e, 'error');
      this.cliHelper.exit(e.message);
    }
    this.cliHelper.log('=================================================================================', 'info');
    this.cliHelper.log('============================== Taboo CMS ========================================', 'info');
    this.cliHelper.log('=================================================================================', 'info');
    this.cliHelper.log('Installation Complete.', 'info');
    this.cliHelper.log('=================================================================================', 'info');
    this.cliHelper.log("1. Run 'npm i' to make sure everything is installed.", 'info');
    this.cliHelper.log(
      "2. Copy './config/SAMPLE.local.js' and rename to './config/local.js', adjust if needed.",
      'info'
    );
    this.cliHelper.log('3. Make sure you have MongoDB server installed and running.', 'info');
    this.cliHelper.log("4. Start the app - 'npm start'.", 'info');
    this.cliHelper.exit('=================================================================================', 'info', 0);
  }

  async copyCmsFolders(cmsPackageDir, installDir) {
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'app'), path.resolve(installDir, 'app'));
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'config'), path.resolve(installDir, 'config'));
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'scripts'), path.resolve(installDir, 'scripts'));
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'tasks'), path.resolve(installDir, 'tasks'));
    // These folders should keep only .gitkeep files
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'data'), path.resolve(installDir, 'data'));
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'logs'), path.resolve(installDir, 'logs'));
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'public'), path.resolve(installDir, 'public'));
  }

  async copyCmsFiles(cmsPackageDir, installDir) {
    await this.cliHelper.copyFile(path.resolve(cmsPackageDir, '.babelrc'), path.resolve(installDir, '.babelrc'));
    await this.cliHelper.copyFile(
      path.resolve(cmsPackageDir, '.eslintignore'),
      path.resolve(installDir, '.eslintignore')
    );
    await this.cliHelper.copyFile(path.resolve(cmsPackageDir, '.eslintrc'), path.resolve(installDir, '.eslintrc'));
    await this.cliHelper.copyFile(
      path.resolve(cmsPackageDir, 'lib/tpl', 'gitignore'),
      path.resolve(installDir, '.gitignore')
    );
    await this.cliHelper.copyFile(path.resolve(cmsPackageDir, '.prettierrc'), path.resolve(installDir, '.prettierrc'));
    await this.cliHelper.copyFile(path.resolve(cmsPackageDir, '.babelrc'), path.resolve(installDir, '.babelrc'));
    await this.cliHelper.copyFile(path.resolve(cmsPackageDir, 'gulpfile.js'), path.resolve(installDir, 'gulpfile.js'));
    await this.cliHelper.copyFile(path.resolve(cmsPackageDir, 'index.js'), path.resolve(installDir, 'index.js'));
    await this.cliHelper.copyFile(path.resolve(cmsPackageDir, 'pm2.json'), path.resolve(installDir, 'pm2.json'));
    await this.cliHelper.copyFile(
      path.resolve(cmsPackageDir, 'webpack.config.js'),
      path.resolve(installDir, 'webpack.config.js')
    );
  }

  async replaceValuesInFiles(cmsType, adminEmail) {
    const replacePromises = this.getReplaceInFilesOptions(cmsType, adminEmail).map(async replaceOptions => {
      await replace(replaceOptions);
    });
    await Promise.all(replacePromises);
  }

  async updatePackageJson(cmsType) {
    const { installDir, installPackageJson, cmsPackageJson, cmsPackageName, cmsPackageInstalledVersion } = this.config;

    installPackageJson.dependencies = cmsPackageJson.dependencies;
    installPackageJson.dependencies[cmsPackageName] = cmsPackageInstalledVersion;
    installPackageJson.devDependencies = cmsPackageJson.devDependencies;
    installPackageJson.scripts = cmsPackageJson.scripts;
    installPackageJson['pre-commit'] = cmsPackageJson['pre-commit'];
    installPackageJson.tabooCms = {
      installed: true,
      type: cmsType,
    };

    await this.cliHelper.writeToFile(
      path.resolve(installDir, 'package.json'),
      JSON.stringify(installPackageJson, null, 2)
    );
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
        files: path.resolve(installDir, 'config/index.js'),
        from: ["firstName: 'Admin',", "lastName: 'Taboo',", "email: 'admin@taboo.solutions',"],
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
}

module.exports = InstallCommand;
