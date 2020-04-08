const path = require('path');
const CLIHelper = require('./helpers/CLIHelper');
const CLIParser = require('./helpers/CLIParser');
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
    this.cliHelper = new CLIHelper(this.config);
    this.cliParser = new CLIParser(this.config, { cliHelper: this.cliHelper });
    this.installCommand = new InstallCommand(this.config, { cliHelper: this.cliHelper });
    this.moduleCommand = new ModuleCommand(this.config, { cliHelper: this.cliHelper, cliParser: this.cliParser });
    this.commands = new Commands(this.config, {
      installCommand: this.installCommand,
      moduleCommand: this.moduleCommand,
    });
  }

  async init() {
    const cmd = this.cliParser.getCmdArg(0, true, 'Please specify command to run: install, module');
    const param1 = this.cliParser.getCmdArg(1);
    const param2 = this.cliParser.getCmdArg(2);
    if (cmd && this.commands[cmd]) {
      this.commands[cmd](param1, param2);
    } else {
      this.cliHelper.exit(`Command '${cmd}' not found`);
    }
  }
}

module.exports = new CLI();
