#!/usr/bin/env node
require('app-module-path').addPath(`${__dirname}/../app`);
const path = require('path');
const fs = require('fs');
const { config, start, logger, cmsHelper } = require('@taboo/cms-core');
const { i18n: { defaultLocalesMapping = {} } = {} } = config;
const Json2csvParser = require('json2csv').Parser;

const run = async () => {
  const translationsFileName = 'translations.csv';
  const adminTranslationsFileName = 'translations-admin.csv';
  const fields = [
    {
      label: 'key',
      value: 'key',
      default: '',
    },
  ];
  for (let language in defaultLocalesMapping) {
    fields.push({
      label: defaultLocalesMapping[language],
      value: defaultLocalesMapping[language],
      default: '',
    });
  }

  await start();
  createCsv(fields, cmsHelper.getLocalesArray(), translationsFileName);
  createCsv(fields, cmsHelper.getLocalesArray(true), adminTranslationsFileName);
  process.exit(0);
};

const createCsv = (fields, data, fileName) => {
  const destination = path.resolve(config.server.localesDir, fileName);
  const json2csvParser = new Json2csvParser({ fields });
  let csv = '';
  try {
    csv = json2csvParser.parse(data);
  } catch (e) {
    logger.error(e);
  }

  fs.writeFileSync(destination, csv);

  logger.info('Translations CSV generated in ' + destination);
};

run().catch(e => {
  console.error(e);
});
