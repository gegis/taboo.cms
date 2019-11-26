const path = require('path');

const { Select, Input } = require('enquirer');

const replace = require('replace-in-file');

class ModuleCommand {
  constructor(config, { cliHelper, cliParser }) {
    this.config = config;
    this.cliHelper = cliHelper;
    this.cliParser = cliParser;
  }

  // TODO - accept model fields!!!!
  async init(action, moduleName) {
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
    let moduleNameUpper, moduleNameLower, modelNameUpper, replacePromises, fileRenameOptions;

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

    try {
      // Copy newModule folder
      await this.cliHelper.copyFolder(
        path.resolve(cmsPackageDir, 'lib/tpl/newModule'),
        path.resolve(installDir, `app/modules/${moduleNameLower}`)
      );

      // Replace module and model names
      replacePromises = this.getNewModuleReplaceInFilesOptions(moduleNameUpper, moduleNameLower, modelNameUpper).map(
        async replaceOptions => {
          await replace(replaceOptions);
        }
      );
      await Promise.all(replacePromises);

      // Rename Files
      fileRenameOptions = this.getNewModuleFileRenameOptions(moduleNameUpper, moduleNameLower, modelNameUpper);
      for (let i = 0; i < fileRenameOptions.length; i++) {
        await this.cliHelper.moveFile(fileRenameOptions[i].from, fileRenameOptions[i].to);
      }
    } catch (e) {
      this.cliHelper.log(e, 'error');
      this.cliHelper.exit(e.message);
    }

    this.cliHelper.exit(`'${moduleNameLower}' module has been successfully created.`, 'info', 0);
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

module.exports = ModuleCommand;
