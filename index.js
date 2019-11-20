const { start, logger } = require('@taboo/cms-core');

start().catch(error => {
  logger.error(error);
});
