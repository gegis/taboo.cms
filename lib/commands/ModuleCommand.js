const path = require('path');
const { Select, Input } = require('enquirer');
const replace = require('replace-in-file');
const CLIHelper = require('../../app/modules/cli/helpers/CLIHelper');
const CLIParser = require('../../app/modules/cli/helpers/CLIParser');

class ModuleCommand {
  constructor(config) {
    this.config = config;
    this.cliHelper = CLIHelper;
    this.cliParser = CLIParser;
    this.actions = {
      create: this.createModule.bind(this),
    };
  }

  // TODO - accept model fields!!!!
  async init(action, moduleName) {
    const actionPrompt = this.getActionPrompt();
    const moduleNamePrompt = this.getModuleNamePrompt();
    const modelNamePrompt = this.getModelNamePrompt();
    let modelName = this.cliParser.getCmdOption('model');
    let moduleNameUpper, moduleNameLower, modelNameUpper;

    if (!action) {
      action = await actionPrompt.run();
    }

    // TODO implemented other actions
    if (!this.actions[action]) {
      this.cliHelper.log("At the moment only 'create' is supported. We are working on other actions!");
      throw new Error(`Action '${action}' does not exist.`);
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

    await this.actions[action]({ moduleNameUpper, moduleNameLower, modelNameUpper });

    this.cliHelper.log('=================================================================================', 'info');
    this.cliHelper.log('================================= Taboo CMS =====================================', 'info');
    this.cliHelper.log('=================================================================================', 'info');
    this.cliHelper.log(`'${moduleNameLower}' module has been successfully created.`, 'info');
    this.cliHelper.exit('=================================================================================', 'info', 0);
  }

  async createModule(options) {
    const { cmsPackageDir, installDir, installPackageJson: { tabooCms: { type = 'react' } = {} } = {} } = this.config;
    const { moduleNameUpper, moduleNameLower, modelNameUpper } = options;
    let replacePromises, fileRenameOptions;

    // Copy newModule folder
    await this.cliHelper.copyFolder(
      path.resolve(cmsPackageDir, 'lib/tpl/newModule'),
      path.resolve(installDir, `app/modules/${moduleNameLower}`)
    );

    // Copy newModuleClassic folder related assets
    if (type === 'classic') {
      await this.cliHelper.copyFolder(
        path.resolve(cmsPackageDir, 'lib/tpl/newModuleClassic/client'),
        path.resolve(installDir, `app/modules/${moduleNameLower}/client`)
      );
      await this.cliHelper.copyFolder(
        path.resolve(cmsPackageDir, 'lib/tpl/newModuleClassic/views'),
        path.resolve(installDir, `app/modules/${moduleNameLower}/views`)
      );
    }

    // Replace module and model names in files
    replacePromises = this.getNewModuleReplaceInFilesOptions(moduleNameUpper, moduleNameLower, modelNameUpper).map(
      async replaceOptions => {
        await replace(replaceOptions);
      }
    );
    await Promise.all(replacePromises);

    // Rename Files
    fileRenameOptions = this.getNewModuleFileRenameOptions(type, moduleNameUpper, moduleNameLower, modelNameUpper);
    for (let i = 0; i < fileRenameOptions.length; i++) {
      await this.cliHelper.moveFile(fileRenameOptions[i].from, fileRenameOptions[i].to);
    }

    this.deleteFilesByCmsType(type, moduleNameUpper, moduleNameLower, modelNameUpper);
  }

  getActionPrompt() {
    return new Select({
      message: 'Please select action:',
      choices: ['create', 'delete'],
    });
  }

  getModuleNamePrompt() {
    return new Input({
      name: 'moduleName',
      message: 'Please enter Module name (camelCase, plural):',
    });
  }

  getModelNamePrompt() {
    return new Input({
      name: 'modelName',
      message: 'Please enter Model name (camelCase, singular):',
      validate: (value, state) => {
        if (!value) {
          return state.styles.warning('Model name cannot be empty!');
        } else if (value && value.replace('Model', '') === '') {
          return state.styles.warning('Model name cannot be empty!');
        }
        return true;
      },
    });
  }

  getNewModuleReplaceInFilesOptions(moduleNameUpper, moduleNameLower, modelNameUpper) {
    const { installDir } = this.config;
    const newModulePath = path.resolve(installDir, `app/modules/${moduleNameLower}/**/*.*`);
    return [
      {
        files: newModulePath,
        from: [/ModuleName/g, /moduleName/g, /ModelName/g],
        to: [moduleNameUpper, moduleNameLower, modelNameUpper],
      },
    ];
  }

  getNewModuleFileRenameOptions(cmsType, moduleNameUpper, moduleNameLower, modelNameUpper) {
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
    if (cmsType === 'classic') {
      options.push({
        from: path.resolve(newModulePath, 'client/scripts', 'ModuleName.js'),
        to: path.resolve(newModulePath, 'client/scripts', `${moduleNameUpper}.js`),
      });
    }
    return options;
  }

  async deleteFilesByCmsType(cmsType, moduleNameUpper, moduleNameLower) {
    const { installDir } = this.config;
    const newModulePath = path.resolve(installDir, `app/modules/${moduleNameLower}/`);
    if (cmsType === 'classic') {
      await this.cliHelper.deleteFile(path.resolve(newModulePath, 'client/components', `${moduleNameUpper}.jsx`));
    }
  }
}

module.exports = ModuleCommand;
