const colorprint = require('colorprint');
const { Select } = require('enquirer');
const shell = require('shelljs');

class Commands {
  constructor() {
    this.cwd = process.cwd();
  }
  async install(cmsType) {
    try {
      const prompt = new Select({
        name: 'type',
        message: 'CMS Type',
        choices: ['react', 'classic', 'headless']
      });
      if (!cmsType) {
        cmsType = await prompt.run();
      }
      console.log(cmsType);
      console.log(this.cwd);
      console.log(shell.pwd());
    } catch (e) {
      this.exit(e.message);
    }
  }

  /**
   *
   * @param msg
   * @param type - notice, info, debug, trace, warn, error, fatal
   * @param code
   */
  exit(msg, type = 'error', code = 1) {
    colorprint[type](msg);
    process.exit(code);
  }
}

module.exports = new Commands();
