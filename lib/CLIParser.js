const argv = require('yargs').argv;

class CLIParser {
  constructor(config, { commands }) {
    this.config = config;
    this.commands = commands;
  }
  getCmdArg(position, exitOnEmpty = false, exitMessage = 'Please specify command to run') {
    if (argv._ && argv._[position]) {
      return argv._[position];
    } else if (exitOnEmpty) {
      this.commands.exit(exitMessage);
    }
    return null;
  }

  getCmdOption(option, exitOnEmpty = false, exitMessage) {
    if (argv[option]) {
      return argv[option];
    } else if (exitOnEmpty) {
      if (exitMessage) {
        exitMessage = `Please specify --${option} option`;
      }
      this.commands.exit(exitMessage);
    }
    return null;
  }
}

module.exports = CLIParser;
