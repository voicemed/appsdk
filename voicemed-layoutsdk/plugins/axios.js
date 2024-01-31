export default ({$axios, app}) => {
  $axios.onRequest((config) => {
    //console.log('request url: ', config.url);
    const urlKeys = ['/proxyapi/', '/proxystorage/', '/proxygooglemaps/', '/v2api/']
    const founds = urlKeys.filter((url) => {
      if (config.url.substring(0, url.length) === url) {
        return true
      }
      return false
    })
    if (founds.length > 0) {
      //console.log(founds, config.url);
      const newUrl = $nuxt.$config.env.urls[founds[0]] + config.url.substring(founds[0].length)
      //console.log('new URL', newUrl)
      config.url = newUrl;
    }
    if(typeof(config.headers['X-Airlyn-UUID']) === 'undefined') {
      config.headers['X-Airlyn-UUID'] = $nuxt.$deviceInfo.currentUUID
    }
    if(typeof(config.headers['X-Airlyn-Locale']) === 'undefined') {
      config.headers['X-Airlyn-Locale'] = $nuxt.$i18n.locale;
    }
    //console.warn('ajax config',config)
    return config
  })
  $axios.onError(error => {
    if(error && error.response && error.response.data && error.response.data.message) {
      if (Array.isArray(error.response.data.message)) {
        error.response.data.message = error.response.data.message.join(", ")
      }
    }
    let errorJson = {
      statusCode: error.response.status,
      message: error.response.data.message || "",
      error: error.response.data.error || "",
      response: error.response || null
    }
    return Promise.reject(errorJson);
  })
  $axios.onResponse(response => {
    //console.log('got Axios Response', response);
    return Promise.resolve(response);
  })
}
