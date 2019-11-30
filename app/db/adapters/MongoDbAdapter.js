const mongoose = require('mongoose');

class MongoDbAdapter {
  constructor(config) {
    this.config = config;
    this.connection = null;
    this.connectedTo = '';
  }

  connect() {
    return new Promise(resolve => {
      const { config } = this;
      let connectionString = 'mongodb://';
      this.connectedTo = `${config.host}:${config.port}/${config.database}`;
      if (config.user) {
        connectionString += config.user;
      }
      if (this.config.password) {
        connectionString += `:${config.password}`;
      }
      if (this.config.user) {
        connectionString += '@';
      }
      connectionString += this.connectedTo;

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

  setupModel(modelName, modelConfig) {
    return new Promise(resolve => {
      if (!modelConfig.schema) {
        throw new Error(`Model ${modelName} must have 'schema' specified`);
      }

      const schemaOptions = modelConfig.schemaOptions || {};
      const schema = new mongoose.Schema(modelConfig.schema, schemaOptions);
      let model;

      if (modelConfig.afterSchemaCreate) {
        modelConfig.afterSchemaCreate(schema);
      }

      model = mongoose.model(modelName, schema);

      if (modelConfig.afterModelCreate) {
        modelConfig.afterModelCreate(model, schema);
      }

      resolve(model);
    });
  }
}

module.exports = MongoDbAdapter;
