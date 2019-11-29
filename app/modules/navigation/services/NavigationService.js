const { Model } = require('@taboo/cms-core');
const ArrayHelper = require('../../core/helpers/ArrayHelper');

class NavigationService {
  async getOneTypeEnabled(type, language = 'en') {
    const itemsResult = await Model('navigation.Navigation').find({ type: type, language: language, enabled: true });
    const items = [];
    itemsResult.map(item => {
      const { language, sort, type, title, url } = item;
      items.push({ language, sort, type, title, url });
    });
    return ArrayHelper.sortByProperty(items, 'sort');
  }
  async getAllEnabled(language = 'en') {
    const items = await Model('navigation.Navigation').find({ language: language, enabled: true });
    return ArrayHelper.sortByProperty(items, 'sort');
  }
}

module.exports = new NavigationService();
