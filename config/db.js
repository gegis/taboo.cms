const MongoDbAdapter = require('../app/modules/db/adapters/MongoDbAdapter');

module.exports = {
  connections: {
    mongodb: {
      adapter: MongoDbAdapter,
      host: 'localhost',
      port: '27017',
      database: 'taboo-cms',
      user: '',
      password: '',
      options: {
        // authSource: 'admin',
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    },
  },
};
