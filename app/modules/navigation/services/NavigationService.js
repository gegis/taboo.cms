const CacheService = require('modules/cache/services/CacheService');
const NavigationModel = require('modules/navigation/models/NavigationModel');

class NavigationService {
  async getEnabledByName(name, language = 'en') {
    let navigation;
    let items = CacheService.get('navigation', `${name}-${language}-enabled`);

    if (!items) {
      items = [];
      navigation = await NavigationModel.findOne({ name: name, language: language, enabled: true });
      if (navigation && navigation.items && navigation.items.length > 1) {
        items = navigation.items;
        CacheService.set('navigation', `${name}-${language}-enabled`, items);
      }
    }

    return items;
  }

  async getAllEnabled(language = 'en') {
    return NavigationModel.find({ language: language, enabled: true });
  }

  deleteNavigationCache() {
    CacheService.clearCacheId('navigation');
  }
}

module.exports = new NavigationService();
