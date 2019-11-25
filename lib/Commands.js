const path = require('path');
const validator = require('validator');
const cryptoRandomString = require('crypto-random-string');
const { filesHelper } = require('@taboo/cms-core');

const { Select, Input } = require('enquirer');

const replace = require('replace-in-file');

class Commands {
  constructor(config, { cliHelper, cliParser }) {
    this.config = config;
    this.cliHelper = cliHelper;
    this.cliParser = cliParser;
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

      // TODO needs implementing other cmsTypes: classic and headless
      if (cmsType !== 'react') {
        this.cliHelper.exit("At the moment only 'react' CMS type is supported. We are working on other types!");
      }

      if (!adminEmail) {
        adminEmail = await promptAdminEmail.run();
      }

      // Copy cms folders
      await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'app'), path.resolve(installDir, 'app'));
      await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'config'), path.resolve(installDir, 'config'));
      await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'scripts'), path.resolve(installDir, 'scripts'));
      await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'tasks'), path.resolve(installDir, 'tasks'));
      // These folders should keep only .gitkeep files
      await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'data'), path.resolve(installDir, 'data'));
      await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'logs'), path.resolve(installDir, 'logs'));
      await this.cliHelper.copyFolder(path.resolve(cmsPackageDir, 'public'), path.resolve(installDir, 'public'));

      // Copy cms files
      await this.cliHelper.copyFile(path.resolve(cmsPackageDir, '.babelrc'), path.resolve(installDir, '.babelrc'));
      await this.cliHelper.copyFile(
        path.resolve(cmsPackageDir, '.eslintignore'),
        path.resolve(installDir, '.eslintignore')
      );
      await this.cliHelper.copyFile(path.resolve(cmsPackageDir, '.eslintrc'), path.resolve(installDir, '.eslintrc'));
      await this.cliHelper.copyFile(path.resolve(cmsPackageDir, '.gitignore'), path.resolve(installDir, '.gitignore'));
      await this.cliHelper.copyFile(
        path.resolve(cmsPackageDir, '.prettierrc'),
        path.resolve(installDir, '.prettierrc')
      );
      await this.cliHelper.copyFile(path.resolve(cmsPackageDir, '.babelrc'), path.resolve(installDir, '.babelrc'));
      await this.cliHelper.copyFile(
        path.resolve(cmsPackageDir, 'gulpfile.js'),
        path.resolve(installDir, 'gulpfile.js')
      );
      await this.cliHelper.copyFile(path.resolve(cmsPackageDir, 'index.js'), path.resolve(installDir, 'index.js'));
      await this.cliHelper.copyFile(path.resolve(cmsPackageDir, 'pm2.json'), path.resolve(installDir, 'pm2.json'));
      await this.cliHelper.copyFile(
        path.resolve(cmsPackageDir, 'webpack.config.js'),
        path.resolve(installDir, 'webpack.config.js')
      );

      // TODO replace values in files according to install package name and adminEmail
      replacePromises = this.getReplaceInFilesOptions(cmsType, adminEmail).map(async replaceOptions => {
        await replace(replaceOptions);
      });
      await Promise.all(replacePromises);

      // TODO based on cmsType - remove/update necessary files

      // Update install app package.json
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
    } catch (e) {
      this.cliHelper.log(e, 'error');
      this.cliHelper.exit(e.message);
    }
    this.cliHelper.exit("Installation Complete. Please run 'npm i' to make sure everything is installed.", 'info', 0);
  }

  // TODO - accept model fields!!!!
  async module(action, moduleName) {
    const { cmsPackageDir, installDir } = this.config;
    const actionPrompt = new Select({
      message: 'Please select action:',
      choices: ['create', 'delete'],
    });
    const moduleNamePrompt = new Input({
      name: 'moduleName',
      message: 'Please enter module name:',
    });
    const modelNamePrompt = new Input({
      name: 'modelName',
      message: 'Please enter Model name (singular):',
      validate: (value, state) => {
        if (!value) {
          return state.styles.warning('Model name cannot be empty!');
        } else if (value && value.replace('Model', '') === '') {
          return state.styles.warning('Model name cannot be empty!');
        }
        return true;
      },
    });
    let modelName = this.cliParser.getCmdOption('model');
    let moduleNameUpper, moduleNameLower, modelNameUpper, modelNameLower, replacePromises;
    if (!action) {
      action = await actionPrompt.run();
    }
    // TODO implemented other actions
    if (action !== 'create') {
      this.cliHelper.exit("At the moment only 'create' is supported. We are working on other actions!");
    }
    if (!moduleName) {
      moduleName = await moduleNamePrompt.run();
    }
    if (!modelName || modelName === true) {
      modelName = await modelNamePrompt.run();
    }
    modelName = modelName.replace('Model', '');

    moduleNameUpper = this.cliHelper.firstUpper(moduleName);
    moduleNameLower = this.cliHelper.firstLower(moduleName);
    modelNameUpper = this.cliHelper.firstUpper(modelName);
    //TODO check and verify if we even need modelNameLower
    modelNameLower = this.cliHelper.firstLower(modelName);

    try {
      // Copy newModule folder
      await this.cliHelper.copyFolder(
        path.resolve(cmsPackageDir, 'lib/tpl/newModule'),
        path.resolve(installDir, `app/modules/${moduleNameLower}`)
      );

      // Replace module and model names
      replacePromises = this.getNewModuleReplaceInFilesOptions(
        moduleNameUpper,
        moduleNameLower,
        modelNameUpper,
        modelNameLower
      ).map(async replaceOptions => {
        await replace(replaceOptions);
      });
      await Promise.all(replacePromises);

      // Rename Files
      this.getNewModuleFileRenameOptions(moduleNameUpper, moduleNameLower, modelNameUpper).map(
        option => {
          filesHelper.moveFile(option.from, option.to);
        }
      );
    } catch (e) {
      this.cliHelper.log(e, 'error');
      this.cliHelper.exit(e.message);
    }
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

  getNewModuleReplaceInFilesOptions(moduleNameUpper, moduleNameLower, modelNameUpper, modelNameLower) {
    const { installDir } = this.config;
    const newModulePath = path.resolve(installDir, `app/modules/${moduleNameLower}/**/*.*`);
    return [
      {
        files: newModulePath,
        from: [/ModuleName/g, /moduleName/g, /ModelName/g, /modelName/g],
        to: [moduleNameUpper, moduleNameLower, modelNameUpper, modelNameLower],
      },
    ];
  }

  getNewModuleFileRenameOptions(moduleNameUpper, moduleNameLower, modelNameUpper) {
    const { installDir } = this.config;
    const newModulePath = path.resolve(installDir, `app/modules/${moduleNameLower}/`);
    const options = [
      {
        from: path.resolve(newModulePath, 'controllers', 'ModuleNameAdminController.js'),
        to: path.resolve(newModulePath, 'controllers', `${moduleNameUpper}AdminController.js`),
      },
      {
        from: path.resolve(newModulePath, 'controllers', 'ModuleNameController.js'),
        to: path.resolve(newModulePath, 'controllers', `${moduleNameUpper}Controller.js`),
      },
      {
        from: path.resolve(newModulePath, 'models', 'ModelNameModel.js'),
        to: path.resolve(newModulePath, 'models', `${modelNameUpper}Model.js`),
      },
      {
        from: path.resolve(newModulePath, 'services', 'ModuleNameService.js'),
        to: path.resolve(newModulePath, 'services', `${moduleNameUpper}Service.js`),
      },
      {
        from: path.resolve(newModulePath, 'helpers', 'ModuleNameHelper.js'),
        to: path.resolve(newModulePath, 'helpers', `${moduleNameUpper}Helper.js`),
      },
      {
        from: path.resolve(newModulePath, 'client/components/admin', 'CreateModelNameModal.jsx'),
        to: path.resolve(newModulePath, 'client/components/admin', `Create${modelNameUpper}Modal.jsx`),
      },
      {
        from: path.resolve(newModulePath, 'client/components/admin', 'EditModelNameModal.jsx'),
        to: path.resolve(newModulePath, 'client/components/admin', `Edit${modelNameUpper}Modal.jsx`),
      },
      {
        from: path.resolve(newModulePath, 'client/components/admin', 'ModelNameForm.jsx'),
        to: path.resolve(newModulePath, 'client/components/admin', `${modelNameUpper}Form.jsx`),
      },
      {
        from: path.resolve(newModulePath, 'client/components/admin', 'ModuleName.jsx'),
        to: path.resolve(newModulePath, 'client/components/admin', `${moduleNameUpper}.jsx`),
      },
      {
        from: path.resolve(newModulePath, 'client/components/admin', 'ModuleNameList.jsx'),
        to: path.resolve(newModulePath, 'client/components/admin', `${moduleNameUpper}List.jsx`),
      },
      {
        from: path.resolve(newModulePath, 'client/components', 'ModuleName.jsx'),
        to: path.resolve(newModulePath, 'client/components', `${moduleNameUpper}.jsx`),
      },
      {
        from: path.resolve(newModulePath, 'client/stores', 'ModuleNameAdminStore.js'),
        to: path.resolve(newModulePath, 'client/stores', `${moduleNameUpper}AdminStore.js`),
      },
      {
        from: path.resolve(newModulePath, 'client/stores', 'ModuleNameStore.js'),
        to: path.resolve(newModulePath, 'client/stores', `${moduleNameUpper}Store.js`),
      },
    ];
    return options;
  }
}

module.exports = Commands;
