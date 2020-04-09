#!/usr/bin/env node
require('app-module-path').addPath(`${process.cwd()}/app`);
const { config } = require('@taboo/cms-core');
const { db: { defaultConnection = 'mongodb' } = {} } = config;
const CLIHelper = require('modules/cli/helpers/CLIHelper');
const CLIParser = require('modules/cli/helpers/CLIParser');
const CLIService = require('modules/cli/services/CLIService');
const commands = {
  user: {
    path: 'modules/users/commands/UserCommand.js',
    dbConnection: defaultConnection,
  },
  locale: {
    path: 'locales/commands/LocaleCommand.js',
  },
};

const cliService = new CLIService(commands);
const command = CLIParser.getCmdArg(0, true, 'Please specify command to run!');
const action = CLIParser.getCmdArg(1, true, 'Please specify action to run!');

cliService
  .run(command, action)
  .then(result => {
    if (result) {
      CLIHelper.exit(result, 'info', 0);
    } else {
      CLIHelper.exit('Command complete!', 'info', 0);
    }
  })
  .catch(e => {
    if (e) {
      CLIHelper.log(e);
      CLIHelper.exit(`Error occurred while running CLI command '${command}'`);
    } else {
      CLIHelper.exit(`Command '${command}' was cancelled`);
    }
  });
