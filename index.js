const Plugin = require('@midgar/midgar/plugin')
const redisStore = require('cache-manager-redis-store');

const utils = require('@midgar/utils')

/**
 * MidgarRedisCache plugin
 * 
 * Add redis cache storage
 */
class MidgarRedisCache extends Plugin {
  /**
   * Init plugin
   */
  async init() {
    this.pm.on('@midgar/cache:beforeInit', (...args) => {
      return this._beforeCacheInit(...args)
    })
  }

  /**
   * Before cache init callback
   * 
   * Add the redis cache store
   */
  async _beforeCacheInit({ cache }) {
    await cache.addStore('redis', (key) => {
      return this._getStoreConfig(key)
    })
  }

  /**
   * Return the config to create store instance
   * 
   * @param {*} key 
   */
  _getStoreConfig(key) {
    const midgarConfig = this.midgar.config.cache && this.midgar.config.cache[key] ? this.midgar.config.cache[key] : {}

    const config = utils.assignRecursive({
      host: 'localhost',
      port: 6379,
      db: 0,
      ttl: 600,
    }, midgarConfig)

    config.store = redisStore

    return config
  }
}

module.exports = MidgarRedisCache
