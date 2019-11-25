const path = require('path');
const CLIParser = require('./CLIParser');
const Commands = require('./Commands');

class CLI {
  constructor() {
    this.config = {
      cmsInstallDir: process.cwd(),
      cmsPackageDir: path.resolve(__dirname,'..'),
    };
    this.commands = new Commands(this.config);
    this.cliParser = new CLIParser(this.config, { commands: this.commands });
  }

  async init() {
    const cmd = this.cliParser.getCmdArg(0, true, 'Please specify command to run: install, createModule');
    const type = this.cliParser.getCmdArg(1);
    if (cmd && this.commands[cmd]) {
      this.commands[cmd](type);
    } else {
      this.commands.exit(`Command '${cmd}' not found`);
    }
  }
}

module.exports = new CLI();
