const CacheService = require('modules/cache/services/CacheService');
const NavigationModel = require('modules/navigation/models/NavigationModel');

class NavigationService {
  constructor() {
    this.cacheId = 'navigation';
  }
  async getEnabledByName(name) {
    const cacheKey = `${name}-enabled`;
    let navigationDb;
    let navigation = CacheService.get(this.cacheId, cacheKey);

    if (!navigation) {
      navigationDb = await NavigationModel.findOne({ name: name, enabled: true });
      if (navigationDb) {
        navigation = navigationDb._doc;
        CacheService.set(this.cacheId, cacheKey, navigation);
      }
    }

    return navigation;
  }

  async getAllEnabled() {
    return NavigationModel.find({ enabled: true });
  }

  deleteNavigationCache() {
    CacheService.clearCacheId(this.cacheId);
  }
}

module.exports = new NavigationService();
