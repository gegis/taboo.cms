const path = require('path');
const CLIHelper = require('../app/modules/cli/helpers/CLIHelper');
const CLIParser = require('../app/modules/cli/helpers/CLIParser');
const Commands = require('./commands/Commands');
const InstallCommand = require('./commands/InstallCommand');
const ModuleCommand = require('./commands/ModuleCommand');

class CLI {
  constructor() {
    const installDir = process.cwd();
    const cmsPackageDir = path.resolve(__dirname, '..');
    const installPackageJson = require(path.resolve(installDir, 'package.json'));
    const cmsPackageJson = require(path.resolve(cmsPackageDir, 'package.json'));
    const cmsPackageInstalledVersion =
      installPackageJson && installPackageJson.dependencies && installPackageJson.dependencies[cmsPackageJson.name]
        ? installPackageJson.dependencies[cmsPackageJson.name]
        : cmsPackageJson.version;
    this.config = {
      installDir: installDir,
      cmsPackageDir: cmsPackageDir,
      installPackageJson: installPackageJson,
      cmsPackageJson: cmsPackageJson,
      installPackageName: installPackageJson.name,
      cmsPackageName: cmsPackageJson.name,
      cmsPackageInstalledVersion: cmsPackageInstalledVersion,
    };
    this.installCommand = new InstallCommand(this.config);
    this.moduleCommand = new ModuleCommand(this.config);
    this.commands = new Commands(this.config, {
      installCommand: this.installCommand,
      moduleCommand: this.moduleCommand,
    });
  }

  async init() {
    const cmd = CLIParser.getCmdArg(0, true, 'Please specify command to run: install, module');
    const param1 = CLIParser.getCmdArg(1);
    const param2 = CLIParser.getCmdArg(2);
    if (cmd && this.commands[cmd]) {
      this.commands[cmd](param1, param2).catch(e => {
        if (e) {
          CLIHelper.log(e);
          CLIHelper.exit(`Error occurred while running CLI command '${cmd}'`);
        } else {
          CLIHelper.exit(`Command '${cmd}' was cancelled`);
        }
      });
    } else {
      CLIHelper.exit(`Command '${cmd}' not found`);
    }
  }
}

module.exports = new CLI();
