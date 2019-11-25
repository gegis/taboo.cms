const path = require('path');
const parse = require('csv-parse');
const fs = require('fs');
const { config, logger } = require('@taboo/cms-core');

const translationsFileName = 'translations.csv';

const run = async () => {
  const source = path.resolve(config.server.localesDir, translationsFileName);
  const csv = fs.readFileSync(source, 'UTF8');
  parse(
    csv,
    {
      comment: '#',
    },
    function(err, rows) {
      const locales = {};
      let destination;
      let locale;
      let cols = rows.shift();
      if (err) {
        logger.error(err);
        process.exit(1);
      }

      cols.map((col, i) => {
        if (i > 0) {
          locale = col;
          if (!locales.hasOwnProperty(locale)) {
            locales[locale] = {};
          }
          rows.map(row => {
            locales[locale][row[0]] = row[i];
          });
        }
      });

      for (let locale in locales) {
        destination = path.resolve(config.server.localesDir, `_${locale}.js`);
        fs.writeFileSync(destination, `module.exports = ${JSON.stringify(locales[locale], null, 2)}`, 'UTF8');
        console.log(`Translations saved to locale: ${destination}`);
      }

      process.exit(0);
    }
  );
};

run();
