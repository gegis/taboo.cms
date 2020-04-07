const { Model, Service } = require('@taboo/cms-core');

class NavigationService {
  async getEnabledBySlug(slug, language = 'en') {
    let navigation;
    let items = Service('cache.Cache').get('navigation', `${slug}-${language}-enabled`);

    if (!items) {
      items = [];
      navigation = await Model('navigation.Navigation').findOne({ slug: slug, language: language, enabled: true });
      if (navigation && navigation.items && navigation.items.length > 1) {
        items = navigation.items;
        Service('cache.Cache').set('navigation', `${slug}-${language}-enabled`, items);
      }
    }

    return items;
  }

  async getAllEnabled(language = 'en') {
    return Model('navigation.Navigation').find({ language: language, enabled: true });
  }

  deleteNavigationCache() {
    Service('cache.Cache').clearCacheId('navigation');
  }
}

module.exports = new NavigationService();
