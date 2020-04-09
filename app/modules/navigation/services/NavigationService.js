const CacheService = require('modules/cache/services/CacheService');
const NavigationModel = require('modules/navigation/models/NavigationModel');

class NavigationService {
  async getEnabledBySlug(slug, language = 'en') {
    let navigation;
    let items = CacheService.get('navigation', `${slug}-${language}-enabled`);

    if (!items) {
      items = [];
      navigation = await NavigationModel.findOne({ slug: slug, language: language, enabled: true });
      if (navigation && navigation.items && navigation.items.length > 1) {
        items = navigation.items;
        CacheService.set('navigation', `${slug}-${language}-enabled`, items);
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
