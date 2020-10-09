const { config } = require('@taboo/cms-core');
const LogApiModel = require('modules/logs/models/LogApiModel');
const AuthService = require('modules/users/services/AuthService');
const LogsApiService = require('modules/logs/services/LogsApiService');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const { api: { logsApi: { defaultSort = { createdAt: 'desc' } } = {} } = {} } = config;

class LogsApiAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: LogApiModel,
      searchFields: ['_id', 'action', 'token', 'code', 'message', 'user'],
      searchOptions: {
        idFields: ['_id', 'user'],
      },
      populate: {
        findAll: 'user',
      },
      defaultSort,
    });
    AuthService.setup({ logsApiService: LogsApiService });
  }
}

module.exports = new LogsApiAdminController();
