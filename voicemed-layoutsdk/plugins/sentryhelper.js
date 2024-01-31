export default (context, inject) => {
  const captureExt = (e) => {
    if($nuxt.$nuxt.$analytics) {
      $nuxt.$analytics.logEvent("error", {
        "title": ((e.name || "generic error") +" "+ (e.message || "")).trim()
      });
    }
    /*
    if($nuxt.$capacitor.getPlatform() !== 'ios' && $nuxt.$config.env.sentry) {
      $nuxt.$sentry.captureException(e);
      return;
    }
     */
    console.log(e.code,e.message,e.name);
    console.error('ERRORE',e);
  }
  const captureMessage = (e) => {
    /*
    if($nuxt.$capacitor.getPlatform() !== 'ios' && $nuxt.$config.env.sentry) {
      $nuxt.$sentry.captureMessage(e);
      return;
    }
     */
    console.log(e.code,e.message,e.name);
    console.error('ERRORE',e);
  }
  inject('captureException', captureExt)
  inject('captureMessage', captureMessage)
}
