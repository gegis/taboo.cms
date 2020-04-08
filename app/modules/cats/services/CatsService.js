const CatModel = require('modules/cats/models/CatModel');

class CatsService {
  async getAllEnabled() {
    return CatModel.find({ enabled: true });
  }
}

module.exports = new CatsService();
