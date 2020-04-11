const { config } = require('@taboo/cms-core');
const LogApiModel = require('modules/logs/models/LogApiModel');
const AbstractAdminController = require('modules/core/controllers/AbstractAdminController');
const { api: { logsApi: { defaultSort = { createdAt: 'desc' } } = {} } = {} } = config;

class LogsApiAdminController extends AbstractAdminController {
  constructor() {
    super({
      model: LogApiModel,
      searchFields: ['_id', 'action', 'token', 'code', 'error', 'user'],
      searchOptions: {
        idFields: ['_id', 'user'],
      },
      populate: {
        findAll: 'user',
      },
      defaultSort,
    });
  }
}

module.exports = new LogsApiAdminController();
