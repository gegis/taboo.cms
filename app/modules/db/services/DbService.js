const { config, logger } = require('@taboo/cms-core');

class DbService {
  constructor(connectionName) {
    this.setConnectionName(connectionName);
  }

  setConnectionName(connectionName) {
    const { adapter = null } = config.db.connections[connectionName];
    this.connectionName = connectionName;
    this.adapter = adapter;
  }

  async connect(connectionName = null) {
    if (connectionName) {
      this.setConnectionName(connectionName);
    }
    if (!this.adapter) {
      throw new Error('DB Connection Adapter not found!');
    }
    await this.adapter.connect(config.db.connections[this.connectionName]);
    logger.info(`Successfully connected to: ${this.adapter.getConnectionName()}`);
  }
}

module.exports = DbService;
