const LogApiModel = require('modules/logs/models/LogApiModel');

class LogsApiService {
  async create({ action, token = null, user = null, code = '', error = '' }) {
    return await LogApiModel.create({ action, token, code, error, user });
  }
}

module.exports = new LogsApiService();
