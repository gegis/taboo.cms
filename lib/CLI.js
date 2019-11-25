const argv = require('yargs').argv;
const CLIParser = require('./CLIParser');
const Commands = require('./Commands');

class CLI {
  constructor() {
    this.cwd = process.cwd();
  }
  async init() {
    const cmd = CLIParser.getCmdArg(0, true, 'Please specify command to run: install, createModule');
    const type = CLIParser.getCmdArg(1);
    if (cmd && Commands[cmd]) {
      Commands[cmd](type);
    } else {
      Commands.exit(`Command '${cmd}' not found`);
    }
  }
}

module.exports = new CLI();
