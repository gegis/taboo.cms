const mongoose = require('mongoose');

class MongoDbAdapter {
  constructor() {
    this.config = null;
    this.connection = null;
    this.connectionName = '';
  }

  /**
   * Method return current connection
   * @returns {object|null}
   */
  getConnection() {
    return this.connection;
  }

  /**
   * Method returns connection name to server string
   * @returns {string}
   */
  getConnectionName() {
    return this.connectionName;
  }

  /**
   * Connects to database
   * @param config
   * @returns {Promise}
   */
  connect(config) {
    this.config = config;
    return new Promise(resolve => {
      let connectionString = 'mongodb://';
      this.connectionName = `${config.host}:${config.port}/${config.database}`;
      if (config.user) {
        connectionString += config.user;
      }
      if (this.config.password) {
        connectionString += `:${config.password}`;
      }
      if (this.config.user) {
        connectionString += '@';
      }
      connectionString += this.connectionName;

      mongoose.connect(connectionString, config.options);

      this.connection = mongoose.connection;

      this.connection.on('error', err => {
        throw Error(err);
      });

      this.connection.once('open', () => {
        resolve(this.connection);
      });
    });
  }

  /**
   * @param modelName
   * @param modelConfig
   * @returns {mongoose.model}
   */
  setupModel(modelName, modelConfig) {
    if (!modelName) {
      throw new Error('modelName must be specified');
    }
    if (!modelConfig.schema) {
      throw new Error(`modelConfig ${modelName} must have 'schema' specified`);
    }
    if (!this.connection) {
      throw new Error('connection is not setup');
    }

    const schemaOptions = modelConfig.schemaOptions || {};
    const schema = new mongoose.Schema(modelConfig.schema, schemaOptions);

    if (modelConfig.afterSchemaCreate) {
      modelConfig.afterSchemaCreate(schema);
    }

    const model = this.connection.model(modelName, schema);

    if (modelConfig.afterModelCreate) {
      modelConfig.afterModelCreate(model, schema);
    }

    return model;
  }

  getSchemaTypes() {
    return mongoose.Schema.Types;
  }
}

module.exports = new MongoDbAdapter();
