const BlockModel = require('modules/blocks/models/BlockModel');

class BlocksService {
  async getAllEnabled() {
    return BlockModel.find({ enabled: true });
  }
}

module.exports = new BlocksService();
