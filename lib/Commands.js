class Commands {
  constructor(config, { installCommand, moduleCommand }) {
    this.config = config;
    this.installCommand = installCommand;
    this.moduleCommand = moduleCommand;
  }

  async install(cmsType, adminEmail) {
    await this.installCommand.init(cmsType, adminEmail);
  }

  async module(action, moduleName) {
    console.log('here');
    await this.moduleCommand.init(action, moduleName);
  }
}

module.exports = Commands;
