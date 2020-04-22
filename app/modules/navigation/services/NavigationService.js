const CacheService = require('modules/cache/services/CacheService');
const NavigationModel = require('modules/navigation/models/NavigationModel');

class NavigationService {
  constructor() {
    this.cacheId = 'navigation';
  }
  async getEnabledByName(name) {
    const cacheKey = `${name}-enabled`;
    let navigation;
    let items = CacheService.get(this.cacheId, cacheKey);

    if (!items) {
      items = [];
      navigation = await NavigationModel.findOne({ name: name, enabled: true });
      if (navigation && navigation.items && navigation.items.length > 1) {
        items = navigation.items;
        CacheService.set(this.cacheId, cacheKey, items);
      }
    }

    return items;
  }

  async getAllEnabled() {
    return NavigationModel.find({ enabled: true });
  }

  deleteNavigationCache() {
    CacheService.clearCacheId(this.cacheId);
  }
}

module.exports = new NavigationService();
