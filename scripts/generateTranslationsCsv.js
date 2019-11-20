const path = require('path');
const fs = require('fs');
const { config, start, logger, locales, cmsHelper } = require('@taboo/cms-core');
const Json2csvParser = require('json2csv').Parser;

const translationsFileName = 'translations.csv';

const run = async () => {
  let localesArray;
  const fields = [
    {
      label: 'key',
      value: 'key',
      default: '',
    },
  ];
  const destination = path.resolve(config.server.localesDir, translationsFileName);

  await start();

  for (let locale in locales) {
    fields.push({
      label: locale,
      value: locale,
      default: '',
    });
  }

  localesArray = cmsHelper.getLocalesArray();

  const json2csvParser = new Json2csvParser({ fields });
  let csv = '';
  try {
    csv = json2csvParser.parse(localesArray);
  } catch (e) {
    logger.error(e);
  }

  fs.writeFileSync(destination, csv);

  logger.info('Translations CSV generated in ' + destination);

  process.exit(0);
};

run();
