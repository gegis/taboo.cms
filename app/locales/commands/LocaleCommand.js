const { config, loadLocales, cmsHelper } = require('@taboo/cms-core');
const path = require('path');
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
const parse = require('csv-parse/lib/sync');
const CLIParser = require('modules/cli/helpers/CLIParser');
const CLIHelper = require('modules/cli/helpers/CLIHelper');
const { i18n: { defaultLocalesMapping = {} } = {} } = config;

class LocaleCommand {
  constructor() {
    this.translationsCsvFileName = 'translations.csv';
    this.adminTranslationsCsvFileName = 'translations-admin.csv';
    this.translationsFileNamePrefix = '_';
    this.adminTranslationsFileNamePrefix = 'admin/_';
    this.keyColumnName = 'key';
    this.fields = [
      {
        label: this.keyColumnName,
        value: this.keyColumnName,
        default: '',
      },
    ];
    for (let language in defaultLocalesMapping) {
      this.fields.push({
        label: defaultLocalesMapping[language],
        value: defaultLocalesMapping[language],
        default: '',
      });
    }
  }

  async export() {
    loadLocales();
    await this.createCsv(this.fields, cmsHelper.getLocalesArray(), this.translationsCsvFileName);
    await this.createCsv(this.fields, cmsHelper.getLocalesArray(true), this.adminTranslationsCsvFileName);
    return 'Successfully Exported.';
  }

  /**
   * --type=client|admin|both
   * @returns {string}
   */
  async import() {
    let importType = CLIParser.getCmdOption('type', true, 'Please specify import --type=client|admin|both');
    if (importType === 'client' || importType === 'both') {
      await this.importClient();
    }
    if (importType === 'admin' || importType === 'both') {
      await this.importAdmin();
    }
    return 'Translations import finished.';
  }

  async importClient() {
    const csvSource = path.resolve(config.server.localesDir, this.translationsCsvFileName);
    const csv = await fs.promises.readFile(csvSource, 'UTF8');
    const translations = this.parseCsv(csv);
    await this.createTranslationsFile(translations, this.translationsFileNamePrefix);
  }

  async importAdmin() {
    const adminCsvSource = path.resolve(config.server.localesDir, this.adminTranslationsCsvFileName);
    const adminCsv = await fs.promises.readFile(adminCsvSource, 'UTF8');
    const translations = this.parseCsv(adminCsv);
    await this.createTranslationsFile(translations, this.adminTranslationsFileNamePrefix);
  }

  async createTranslationsFile(translations, fileNamePrefix) {
    const { server: { localesDir = null } = {} } = config;
    if (!localesDir) {
      throw new Error('localesDir not found');
    }
    const localesTranslations = this.parseTranslations(translations);
    for (let locale in localesTranslations) {
      let destination = path.resolve(localesDir, `${fileNamePrefix}${locale}.js`);
      await fs.promises.writeFile(destination, `module.exports = ${JSON.stringify(localesTranslations[locale], null, 2)};`, 'UTF8');
      CLIHelper.log(`Translations saved to file ${destination}`, 'info');
    }
  }

  async createCsv(fields, data, fileName) {
    const destination = path.resolve(config.server.localesDir, fileName);
    const json2csvParser = new Json2csvParser({ fields });
    let csv = json2csvParser.parse(data);
    await fs.promises.writeFile(destination, csv);

    CLIHelper.log(`Translations CSV generated in ${destination}`, 'info');
  }

  parseCsv(csv) {
    return parse(csv, {
      columns: true,
    });
  }

  parseTranslations(translations) {
    const localesTranslations = {};
    translations.map(row => {
      for (let col in row) {
        if (col !== this.keyColumnName) {
          let locale = col;
          let keyValue = row[this.keyColumnName];
          let translationValue = row[col];
          if (!localesTranslations[locale]) {
            localesTranslations[locale] = {};
          }
          if (translationValue !== '') {
            localesTranslations[locale][keyValue] = translationValue;
          }
        }
      }
    });
    return localesTranslations;
  }
}

module.exports = new LocaleCommand();
