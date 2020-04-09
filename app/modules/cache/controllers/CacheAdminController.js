const CacheService = require('modules/cache/services/CacheService');

class CacheAdminController {
  async clearAll(ctx) {
    CacheService.clearAll();
    ctx.body = {
      success: true,
    };
  }
}

module.exports = new CacheAdminController();
