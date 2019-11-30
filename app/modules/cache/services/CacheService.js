const flatCache = require('flat-cache');
const path = require('path');
const { config } = require('@taboo/cms-core');
const { cache: { enabled = false, cachePath = './data/app-cache', cacheIds = {} } = {} } = config.server;

class CacheService {
  constructor() {
    this.cache = {};
    this.setupAllCacheIds();
  }

  setupAllCacheIds() {
    if (enabled) {
      for (let cacheId in cacheIds) {
        this.setupCacheId(cacheId);
      }
    }
  }

  setupCacheId(cacheId) {
    if (enabled) {
      this.cache[cacheId] = flatCache.load(cacheIds[cacheId], path.resolve(cachePath));
    }
  }

  getAll(cacheId) {
    if (enabled) {
      return this.cache[cacheId].all();
    }
    return null;
  }

  get(cacheId, key) {
    if (enabled) {
      return this.cache[cacheId].getKey(key);
    }
    return null;
  }

  set(cacheId, key, data, save = true) {
    if (enabled) {
      this.cache[cacheId].setKey(key, data);
      if (save) {
        this.save(cacheId);
      }
    }
  }

  delete(cacheId, key) {
    if (enabled) {
      this.cache[cacheId].removeKey(key);
    }
  }

  save(cacheId, noPrune = true) {
    //noPrune === true - to prevent the removal of non visited keys
    if (enabled) {
      this.cache[cacheId].save(noPrune);
    }
  }

  clearCacheId(cacheId) {
    if (enabled) {
      flatCache.clearCacheById(cacheIds[cacheId], cachePath);
      this.setupCacheId(cacheId);
    }
  }

  clearAll() {
    if (enabled) {
      flatCache.clearAll(cachePath);
      this.setupAllCacheIds();
    }
  }
}

module.exports = new CacheService();
