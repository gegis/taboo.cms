const path = require('path');
const CLIParser = require('./CLIParser');
const Commands = require('./Commands');

class CLI {
  constructor() {
    const installDir = process.cwd();
    const cmsPackageDir = path.resolve(__dirname,'..');
    const installPackageJson = require(path.resolve(installDir, 'package.json'));
    const cmsPackageJson = require(path.resolve(cmsPackageDir, 'package.json'));
    this.config = {
      installDir: installDir,
      cmsPackageDir: cmsPackageDir,
      installPackageJson: installPackageJson,
      cmsPackageJson: cmsPackageJson,
      installPackageName: installPackageJson.name,
      cmsPackageName: cmsPackageJson.name,
      cmsPackageInstalledVersion: installPackageJson.dependencies[cmsPackageJson.name] || cmsPackageJson.version,
    };
    this.commands = new Commands(this.config);
    this.cliParser = new CLIParser(this.config, { commands: this.commands });
  }

  async init() {
    const cmd = this.cliParser.getCmdArg(0, true, 'Please specify command to run: install, createModule');
    const installType = this.cliParser.getCmdArg(1);
    const adminEmail = this.cliParser.getCmdArg(2);
    if (cmd && this.commands[cmd]) {
      this.commands[cmd](installType, adminEmail);
    } else {
      this.commands.exit(`Command '${cmd}' not found`);
    }
  }
}

module.exports = new CLI();
