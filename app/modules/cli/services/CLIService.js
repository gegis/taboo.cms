const DbService = require('modules/db/services/DbService');

class CLIService {
  constructor(commands) {
    this.dbService = null;
    this.commands = commands;
  }

  async run(command, action) {
    let result;
    if (!this.commands[command]) {
      throw new Error(`Command '${command}' not found.`);
    }
    const commandLib = await this.getLib(command);
    try {
      result = await commandLib[action]();
    } catch (e) {
      if (e.message === 'commandLib[action] is not a function') {
        throw new Error(`Action '${action}' not found.`);
      }
      throw e;
    }
    return result;
  }

  async getLib(command) {
    const commandOptions = this.commands[command];
    if (commandOptions && commandOptions.dbConnection) {
      this.dbService = new DbService(commandOptions.dbConnection);
      await this.dbService.connect();
    }
    return require(commandOptions.path);
  }
}

module.exports = CLIService;
