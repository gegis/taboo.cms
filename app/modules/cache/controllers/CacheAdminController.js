const { Service } = require('@taboo/cms-core');

class CacheAdminController {
  async clearAll(ctx) {
    Service('cache.Cache').clearAll();
    ctx.body = {
      success: true,
    };
  }
}

module.exports = new CacheAdminController();
