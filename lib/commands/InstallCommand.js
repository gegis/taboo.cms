const path = require('path');
const validator = require('validator');
const cryptoRandomString = require('crypto-random-string');
const CLIHelper = require('../../app/modules/cli/helpers/CLIHelper');

const { Select, Input } = require('enquirer');

const replace = require('replace-in-file');

class InstallCommand {
  constructor(config) {
    this.config = config;
    this.cliHelper = CLIHelper;
  }
  async init(cmsType, adminEmail) {
    const { cmsPackageDir, installDir, cmsPackageName } = this.config;
    const promptCmsType = new Select({
      name: 'type',
      message: 'CMS Type',
      choices: ['react', 'classic'],
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

    if (installDir === cmsPackageDir) {
      this.cliHelper.exit(`You cannot install within '${cmsPackageName}' module`);
    }

    try {
      if (!cmsType) {
        cmsType = await promptCmsType.run();
      }
      // TODO implement classic for v2
      if (cmsType === 'classic') {
        this.cliHelper.exit("We are sorry, but 'classic' type is not yet supported by the CMS version 2.");
      }

      if (!adminEmail) {
        adminEmail = await promptAdminEmail.run();
      }

      // By default application is prepared and ready as client side React app.
      await this.copyCmsFolders(cmsPackageDir, installDir);
      await this.copyCmsFiles(cmsPackageDir, installDir);
      await this.replaceValuesInFiles(cmsType, adminEmail);
      // ---------- CMS Type specific ---------------------------------
      await this.deleteFilesByCmsType(cmsType, installDir);
      await this.copyFoldersByCmsType(cmsType, cmsPackageDir, installDir);
      await this.replaceValuesInFilesByCmsType(cmsType);
      // --------------------------------------------------------------
      await this.updatePackageJson(cmsType);
    } catch (e) {
      this.cliHelper.log(e, 'error');
      this.cliHelper.exit(e.message);
    }
    this.showHelpAndExit();
  }

  showHelpAndExit() {
    this.cliHelper.log('=================================================================================', 'info');
    this.cliHelper.log('============================== Taboo CMS ========================================', 'info');
    this.cliHelper.log('=================================================================================', 'info');
    this.cliHelper.log('Installation Complete.', 'info');
    this.cliHelper.log('=================================================================================', 'info');
    this.cliHelper.log("1. Run 'npm i' to make sure everything is installed.", 'info');
    this.cliHelper.log(
      "2. Copy './config/SAMPLE.local.js' and rename to './config/local.js', update if needed.",
      'info'
    );
    this.cliHelper.log('3. Make sure you have MongoDB server installed and running.', 'info');
    this.cliHelper.log("4. Load initial data - 'npm run taboo-cms-command db migrate'.", 'info');
    this.cliHelper.log("5. Start the app - 'npm start'.", 'info');
    this.cliHelper.exit('=================================================================================', 'info', 0);
  }

  async copyCmsFolders(cmsPackageDir, installDir) {
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'app'), path.resolve(installDir, 'app'));
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'config'), path.resolve(installDir, 'config'));
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'scripts'), path.resolve(installDir, 'scripts'));
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'tasks'), path.resolve(installDir, 'tasks'));
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'lib/bin'), path.resolve(installDir, 'bin'));
    // These folders should keep only .gitkeep files
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'data'), path.resolve(installDir, 'data'));
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'logs'), path.resolve(installDir, 'logs'));
    await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'public'), path.resolve(installDir, 'public'));
  }

  async copyFoldersByCmsType(cmsType, cmsPackageDir, installDir) {
    if (cmsType === 'classic') {
      await this.cliHelper.copyFolder(
        path.resolve(cmsPackageDir, 'lib/tpl/classic/app'),
        path.resolve(installDir, 'app')
      );
      await this.cliHelper.copyFolder(
        path.resolve(cmsPackageDir, 'lib/tpl/classic/config'),
        path.resolve(installDir, 'config')
      );
    }
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
    await this.cliHelper.copyFile(path.resolve(cmsPackageDir, 'apidoc.json'), path.resolve(installDir, 'apidoc.json'));
    // Decided that package-lock.json is important after last babel and core-js failure!
    // TODO - it seems npm is ignoring this file on publish
    // await this.cliHelper.copyFile(
    //   path.resolve(cmsPackageDir, 'package-lock.json'),
    //   path.resolve(installDir, 'package-lock.json')
    // );
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

  // async deleteFoldersByCmsType(cmsType, installDir) {
  //   if (cmsType === 'classic') {
  //     await this.cliHelper.deleteDir(path.resolve(installDir, 'app/modules/core/client'));
  //   }
  // }

  async deleteFilesByCmsType(cmsType, installDir) {
    if (cmsType === 'classic') {
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/assets/styles/lib/lib.less'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/assets/styles/fonts.less'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/assets/styles/helpers.less'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/assets/styles/index.less'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/assets/styles/modal.less'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/assets/styles/print.less'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/assets/styles/responsive.less'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/assets/styles/vars.less'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/index.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/App.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/ButtonLink.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/Dashboard.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/Footer.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/Header.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/IndexPage.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/Layout.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/Modal.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/NavLink.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/NoAccess.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/NotFound.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/core/ui/components/UserRoute.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/galleries/ui/components/GalleryModal.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/navigation/ui/stores/NavigationStore.js'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/galleries/ui/styles/index.less'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/pages/ui/components/Page.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/pages/ui/stores/PagesStore.js'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/uploads/ui/components/DocumentUpload.jsx'));
      await this.cliHelper.deleteFile(
        path.resolve(installDir, 'app/modules/users/ui/components/AccountVerification.jsx')
      );
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/users/ui/components/ChangePassword.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/users/ui/components/MyProfile.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/users/ui/components/ProfilePicture.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/users/ui/components/ResetPassword.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/users/ui/components/SignIn.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/users/ui/components/SignUp.jsx'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/users/ui/stores/UsersStore.js'));
      await this.cliHelper.deleteFile(path.resolve(installDir, 'app/modules/users/ui/styles/index.less'));
    }
  }

  async updatePackageJson(cmsType) {
    const { installDir, installPackageJson, cmsPackageJson, cmsPackageName, cmsPackageInstalledVersion } = this.config;

    installPackageJson.dependencies = cmsPackageJson.dependencies;
    installPackageJson.devDependencies = cmsPackageJson.devDependencies;
    installPackageJson.devDependencies[cmsPackageName] = cmsPackageInstalledVersion;
    installPackageJson.scripts = cmsPackageJson.scripts;
    installPackageJson['pre-commit'] = cmsPackageJson['pre-commit'];
    installPackageJson.tabooCms = {
      installed: true,
      type: cmsType,
    };

    if (cmsType === 'classic') {
      installPackageJson.dependencies.jquery = '^3.4.1';
      installPackageJson.dependencies.bootstrap = '^4.4.1';
      installPackageJson.dependencies['gulp-sass'] = '^4.0.2';
    }

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
        from: "websiteName: 'Taboo Solutions',",
        to: `websiteName: '${installPackageName}',`,
      },
      {
        files: path.resolve(installDir, 'config/index.js'),
        from: [
          "title: 'Taboo CMS Admin',",
          "metaTitle: 'Taboo CMS',",
          "firstName: 'Admin',",
          "lastName: 'Taboo',",
          "email: 'admin@taboo.solutions',",
        ],
        to: [
          `title: '${installPackageName} Admin',`,
          `metaTitle: '${installPackageName}',`,
          `firstName: '${installPackageName}',`,
          `lastName: '${installPackageName}',`,
          `email: '${adminEmail}',`,
        ],
      },
      {
        files: path.resolve(installDir, 'app/modules/db/data/settings.js'),
        from: ['"metaTitle": "Taboo CMS",'],
        to: [`"metaTitle": "${installPackageName}",`],
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
        from: ["secretKeys: ['REPLACE-ME-123456', '654321-REPLACE-ME'],", "key: 'taboo.sid',"],
        to: [`secretKeys: ['${secret1}', '${secret2}'],`, `key: '${installPackageName}.sid',`],
      },
      {
        files: path.resolve(installDir, 'scripts/**/*.*'),
        from: /taboo-cms/g,
        to: installPackageName,
      },
    ];
  }

  async replaceValuesInFilesByCmsType(cmsType) {
    let replacePromises;
    let replaceValues = this.getReplaceInFilesByCmsType(cmsType);
    if (replaceValues && replaceValues.length > 0) {
      replacePromises = replaceValues.map(async replaceOptions => {
        await replace(replaceOptions);
      });
      await Promise.all(replacePromises);
    }
  }

  getReplaceInFilesByCmsType(cmsType) {
    const { installDir } = this.config;
    const replaceInFiles = [];
    if (cmsType === 'classic') {
      replaceInFiles.push({
        files: path.resolve(installDir, 'config/server.js'),
        from: "globalPolicies: ['acl'],",
        to: "globalPolicies: ['setViewParams', 'acl'],",
      });
      replaceInFiles.push({
        files: path.resolve(installDir, 'app/modules/db/data/pages.js'),
        from: [/<div class="rs-panel rs-panel-default rs-panel-bordered">/g, /<div class="rs-panel-body">/g],
        to: ['<div class="card">', '<div class="card-body">'],
      });
      replaceInFiles.push({
        files: path.resolve(installDir, 'webpack.config.js'),
        from: "app: './app/modules/core/ui/index.jsx',",
        to: "app: './app/modules/core/ui/index.js',",
      });
    }
    return replaceInFiles;
  }
}

module.exports = InstallCommand;
