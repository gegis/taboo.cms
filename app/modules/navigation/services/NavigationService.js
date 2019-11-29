const { Model } = require('@taboo/cms-core');

class NavigationService {
  async getOneTypeEnabled(type) {
    return Model('navigation.Navigation').find({type: type, enabled: true});
  }
  async getAllEnabled() {
    return Model('navigation.Navigation').find({enabled: true});
  }
}

module.exports = new NavigationService();
