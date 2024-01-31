export default function ({$auth}) {
  $auth.onRedirect((to, from) => {
    console.log(to, from);
    if (from.indexOf('signup') > -1 || from.indexOf('login') > -1 || from.indexOf('forgot') > -1) {
      console.log('siamo in signup/login/forgot, lascia il mondo', from);
      return from;
    }
    return $nuxt.localePath(to);
  });
  const loggedChangeStatus = function (state) {
    console.log("User change status", state)
    if (state === false) {
      //Clean all storage
      $nuxt.$store.state.mediadevices.homeScroll = 0;
      $nuxt.$store.state.mediadevices.oriChallengeScroll = 0;
      $nuxt.$store.state.mediadevices.oriExerciseScroll = 0;
      $nuxt.$store.state.mediadevices.oriMyChallengeScroll = 0;
      console.log("User logged out, clean Storage status")
      Object.keys(localStorage).map((sKey) => {
        console.log('clear localStorage:', sKey, localStorage.getItem(sKey))
        localStorage.setItem(sKey, null)
        localStorage.removeItem(sKey);
        console.log('clear .end localStorage:', sKey, localStorage.getItem(sKey))
      })
      Object.keys(sessionStorage).map((sKey) => {
        console.log('clear sessionStorage:', sKey, sessionStorage.getItem(sKey))
        sessionStorage.setItem(sKey, null);
        sessionStorage.removeItem(sKey);
        console.log('clear .end sessionStorage:', sKey, sessionStorage.getItem(sKey))
      })
    }
  }
  $auth.$storage.watchState('loggedIn', loggedChangeStatus);

}
