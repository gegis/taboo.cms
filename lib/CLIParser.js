const argv = require('yargs').argv;
const Commands = require('./Commands');

class CLIParser {
  getCmdArg(position, exitOnEmpty = false, exitMessage = 'Please specify command to run') {
    if (argv._ && argv._[position]) {
      return argv._[position];
    } else if (exitOnEmpty) {
      Commands.exit(exitMessage);
    }
    return null;
  }

  getCmdOption(option, exitOnEmpty = false, exitMessage) {
    console.log(argv);
    if (argv[option]) {
      return argv[option];
    } else if (exitOnEmpty) {
      if (exitMessage) {
        exitMessage = `Please specify --${option} option`;
      }
      Commands.exit(exitMessage);
    }
    return null;
  }
}

module.exports = new CLIParser();
