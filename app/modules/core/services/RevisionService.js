const RevisionModel = require('modules/core/models/RevisionModel');

class RevisionService {
  async getById(model, id) {
    let key, revision;
    let value = null;
    if (model && id) {
      key = this.getKeyName(model, id);
      revision = await RevisionModel.findOne({ key });
      if (revision) {
        value = revision.value;
      }
    }
    return value;
  }

  async saveById(model, id) {
    let key, item, revision, newRevision;
    if (model && id) {
      key = this.getKeyName(model, id);
      item = await model.findById(id);
      if (item) {
        revision = await RevisionModel.findOne({ key });
        if (revision) {
          newRevision = await RevisionModel.findByIdAndUpdate(revision._id, { key, value: item });
        } else {
          newRevision = await RevisionModel.create({ key, value: item });
        }
      }
    }
    return newRevision;
  }

  getKeyName(model, id) {
    return `${model.collection.collectionName}-${id}`;
  }
}
module.exports = new RevisionService();
