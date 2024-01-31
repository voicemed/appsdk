import LRUCache from "lru-cache";

const hash = require('object-hash');

export default (context, inject) => {
  const axiosService = {
    ttl: 5 * 60 * 1000,
    cacheService: null,
    getCachedValue: (key) => {
      return axiosService.cacheService.get(key)
    },
    setCachedValue: (cacheKey, value, ttl) => {
      let setV = axiosService.cacheService.set(cacheKey, value, ttl)
      //console.log('got set Value', setV, value, cacheKey)
      return value
    },
    serializeKey: (url, data, config) => {
      //console.log('trySerialKey:',config);
      /*console.log('getSerialKey:',config, {
        method: config.method,
        url: config.url || url,
        params: config.params,
        data: config.data || data
      })
      */
      return hash({
        method: config.method,
        url: config.url || url,
        params: config.params,
        data: config.data || data
      })
    },
    $deleteCache: (url, config) => {
      const cacheKey = axiosService.serializeKey(url, null, config)
      return axiosService.cacheService.delete(cacheKey)
    },
    $clearCache: (url, config) => {
      axiosService.cacheService.clear()
    },
    $get: (url, config) => {
      if (null === config || typeof config ==='undefined') {
        config = {
          "method": "get",
          "url": url,
          "params": [],
          "data": []
        }
      }
      const cacheKey = axiosService.serializeKey(url, null, config)
      const cachedValue = axiosService.getCachedValue(cacheKey)
      if (cachedValue !== undefined) {
        return Promise.resolve(cachedValue)
      }
      return context.$axios.$get(url, config).then((resp) => {
        return axiosService.setCachedValue(cacheKey, resp, axiosService.ttl)
      })
    },
    $options: (url, config) => {
      if (null === config || typeof config ==='undefined') {
        config = {
          "method": "option",
          "url": url,
          "params": [],
          "data": []
        }
      }
      return context.$axios.$options(url, config)
    },
    $head: (url, config) => {
      if (null === config || typeof config ==='undefined') {
        config = {
          "method": "head",
          "url": url,
          "params": [],
          "data": []
        }
      }
      return context.$axios.$head(url, config)
    },
    $delete: (url, config) => {
      if (null === config || typeof config ==='undefined') {
        config = {
          "method": "delete",
          "url": url,
          "params": [],
          "data": []
        }
      }
      return context.$axios.$delete(url, config)
    },
    $post: (url, data, config) => {
      if (null === config || typeof config ==='undefined') {
        config = {
          "method": "post",
          "url": url,
          "params": [],
          "data": []
        }
      }
      return context.$axios.$post(url, data, config)
    },
    $put: (url, data, config) => {
      if (null === config || typeof config ==='undefined') {
        config = {
          "method": "put",
          "url": url,
          "params": [],
          "data": []
        }
      }
      return context.$axios.$put(url, data, config)
    },
    $patch: (url, data, config) => {
      if (null === config || typeof config ==='undefined') {
        config = {
          "method": "patch",
          "url": url,
          "params": [],
          "data": []
        }
      }
      return context.$axios.$patch(url, data, config)
    },
    $request: (config) => {
      if(typeof(config.headers['X-Airlyn-UUID']) === 'undefined') {
        config.headers['X-Airlyn-UUID'] = $nuxt.$deviceInfo.currentUUID
      }
      if(typeof(config.headers['X-Airlyn-Locale']) === 'undefined') {
        config.headers['X-Airlyn-Locale'] = $nuxt.$i18n.locale;
      }
      console.warn('ajax config[cache]',config)
      return context.$axios.$request(config)
    }

  }

  axiosService.cacheService = new LRUCache({
    ttl: 5 * 60 * 1000,
    max: 50
  });

  inject('axiosService', axiosService)
};
