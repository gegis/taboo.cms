const argv = require('yargs').argv;
const CLIHelper = require('./CLIHelper');

class CLIParser {
  /**
   * @param position
   * @param exitOnEmpty
   * @param exitMessage
   * @returns {string|null}
   */
  getCmdArg(position, exitOnEmpty = false, exitMessage = 'Please specify command to run') {
    if (argv._ && argv._[position]) {
      return argv._[position];
    } else if (exitOnEmpty) {
      CLIHelper.exit(exitMessage);
    }
    return null;
  }

  /**
   * @param option
   * @param exitOnEmpty
   * @param exitMessage
   * @returns {string|null}
   */
  getCmdOption(option, exitOnEmpty = false, exitMessage) {
    if (argv[option]) {
      return argv[option];
    } else if (exitOnEmpty) {
      if (!exitMessage) {
        exitMessage = `Please specify --${option} option`;
      }
      CLIHelper.exit(exitMessage);
    }
    return null;
  }
}

module.exports = new CLIParser();
