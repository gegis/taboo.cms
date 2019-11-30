const { Model, Service } = require('@taboo/cms-core');
const ArrayHelper = require('../../core/helpers/ArrayHelper');

class NavigationService {
  async getEnabledByType(type, language = 'en') {
    let itemsResult;
    let items = Service('cache.Cache').get('navigation', `${type}-${language}-enabled`);

    if (!items) {
      items = [];
      itemsResult = await Model('navigation.Navigation').find({ type: type, language: language, enabled: true });
      if (itemsResult && itemsResult.length > 1) {
        itemsResult.map(item => {
          const { language, sort, type, title, url } = item;
          items.push({ language, sort, type, title, url });
        });
        items = ArrayHelper.sortByProperty(items, 'sort');
        Service('cache.Cache').set('navigation', `${type}-${language}-enabled`, items);
      }
    }

    return items;
  }

  async getAllEnabled(language = 'en') {
    const items = await Model('navigation.Navigation').find({ language: language, enabled: true });
    return ArrayHelper.sortByProperty(items, 'sort');
  }

  deleteNavigationCache() {
    Service('cache.Cache').clearCacheId('navigation');
  }
}

module.exports = new NavigationService();
