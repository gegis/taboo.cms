require('app-module-path').addPath(`${__dirname}/app`);
const { start, logger } = require('@taboo/cms-core');

start().catch(error => {
  logger.error(error);
});
