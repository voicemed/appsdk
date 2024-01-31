const allowedRoutes = [
  "index",
  "home",
  "welcome",
  "user-login",
  "user-signup",
  "user-forgot",
]
export default function ({store, route}) {

  //console.log('cambio rotta', store, route, $nuxt.$auth.loggedIn, $nuxt.getRouteBaseName(route));
  /**
   * Allowed logged out paths: login, welcome, signup
   */
  if ($nuxt.$auth.loggedIn === false) {
    if (allowedRoutes.indexOf($nuxt.getRouteBaseName(route)) === -1) {
      $nuxt.$router.replace($nuxt.localePath("/welcome"));
    }
  }
}
