const path = require('path');
const { filesHelper } = require('@taboo/cms-core');
const CLIHelper = require('modules/cli/helpers/CLIHelper');
const CLIParser = require('modules/cli/helpers/CLIParser');
const MigrationModel = require('modules/db/models/MigrationModel');

class DbCommand {
  constructor() {
    this.migrationsPath = '../migrations';
  }

  async migrate() {
    const newMigrations = [];
    const migrationFiles = filesHelper.getAllFileNames(path.resolve(__dirname, this.migrationsPath));
    const executedMigrations = await this.getExecutedMigrationsNames();

    migrationFiles.sort();
    executedMigrations.sort();

    for (let i = 0; i < migrationFiles.length; i++) {
      if (executedMigrations.indexOf(migrationFiles[i]) === -1) {
        await this.runMigrationUp(migrationFiles[i]);
        let newMigration = await this.createMigrationEntry(migrationFiles[i]);
        newMigrations.push(newMigration.name);
      }
    }

    if (newMigrations.length === 0) {
      CLIHelper.log('No new migrations executed', 'warn');
    }

    return 'DB migration successfully finished';
  }

  async up() {
    let fileName = CLIParser.getCmdOption('file', true, 'Please specify db down --file=file-name.js');
    let newMigration = null;
    let migrationEntry;
    if (fileName) {
      migrationEntry = await this.getMigrationEntry(fileName);
      if (migrationEntry !== null) {
        throw new Error(`Migration '${fileName}' already exists`);
      }
      await this.runMigrationUp(fileName);
      newMigration = await this.createMigrationEntry(fileName);
    }

    if (newMigration === null) {
      throw new Error(`Migration '${fileName}' failed`);
    }

    return `DB migration '${fileName}' UP finished`;
  }

  async down() {
    let fileName = CLIParser.getCmdOption('file', true, 'Please specify db down --file=file-name.js');
    let migrationEntry;
    if (fileName) {
      migrationEntry = await this.getMigrationEntry(fileName);
      if (migrationEntry === null) {
        throw new Error(`Migration '${fileName}' does not exist`);
      }
      await this.runMigrationDown(fileName);
      await this.deleteMigrationEntry(fileName);
    }

    return `DB migration '${fileName}' DOWN finished`;
  }

  async runMigrationUp(fileName) {
    const migrationModule = require(`${this.migrationsPath}/${fileName}`);
    CLIHelper.log(`Running migration UP: ${fileName}`, 'info');
    await migrationModule.up(fileName);
    return 'Success';
  }

  async runMigrationDown(fileName) {
    const migrationModule = require(`${this.migrationsPath}/${fileName}`);
    CLIHelper.log(`Running migration DOWN: ${fileName}`, 'info');
    await migrationModule.down(fileName);
    return 'Success';
  }

  async getMigrationEntry(name) {
    return MigrationModel.findOne({ name });
  }

  async createMigrationEntry(name) {
    return MigrationModel.create({ name });
  }

  async deleteMigrationEntry(name) {
    return MigrationModel.deleteOne({ name });
  }

  /**
   * @returns {[string]}
   */
  async getExecutedMigrationsNames() {
    const migrationNames = [];
    const migrations = await this.getExecutedMigrations();
    if (migrations) {
      migrations.map(item => {
        migrationNames.push(item.name);
      });
    }
    return migrationNames;
  }

  /**
   * @returns {Promise<MigrationModel>}
   */
  async getExecutedMigrations() {
    return MigrationModel.find();
  }
}

module.exports = new DbCommand();
