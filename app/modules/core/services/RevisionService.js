const { Model } = require('@taboo/cms-core');

class RevisionService {
  async get(model, id) {
    const key = `${model}-${id}`;
    let revision;
    let value = null;
    if (model && id) {
      revision = await Model('core.Revision').findOne({ key });
      if (revision) {
        value = revision.value;
      }
    }
    return value;
  }

  async save(model, id) {
    const key = `${model}-${id}`;
    let item, revision, newRevision;
    if (model && id) {
      item = await Model(model).findById(id);
      if (item) {
        revision = await Model('core.Revision').findOne({ key });
        if (revision) {
          newRevision = await Model('core.Revision').findByIdAndUpdate(revision._id, { key, value: item });
        } else {
          newRevision = await Model('core.Revision').create({ key, value: item });
        }
      }
    }
    return newRevision;
  }
}
module.exports = new RevisionService();
