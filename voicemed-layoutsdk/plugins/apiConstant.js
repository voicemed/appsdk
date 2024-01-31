export default (context, inject) => {
  const apiConstants = {
    installCounter: '/proxyapi/devices/downloads',
    authVerify: '/proxyapi/auth/verify',
    authRequestVerificationCode: '/proxyapi/auth/new_verification_code',
    authPasswordResetCode: '/proxyapi/auth/reset_code',
    authPasswordVerifyResetCode: '/proxyapi/auth/verify_reset_code',
    authPasswordReset: '/proxyapi/auth/reset_password',
    appConfig: '/proxyapi/appconfig',
    userSignup: '/proxyapi/auth/signup',
    userCheckEmail: '/proxyapi/auth/check_user_exists',
    userUpdateAvatar: '/proxyapi/user/avatar',
    userUpdateProfile: '/v2api/user',
    userUpdatePassword: '/proxyapi/user/password',
    userPerformedExercises: "/proxyapi/user/performed_exercises",
    userPerformedExercisesRecordings: "/proxyapi/user/performed_exercises?type=recording",
    userPerformedExercisesRecordingsLimit1: "/proxyapi/user/performed_exercises?type=recording&limit=1&offset=0",
    userBreathingExercises: '/v2api/user/breathing_exercises',
    userBreathingPrograms: '/proxyapi/user/programs',
    userBreathingProgramsToday: '/proxyapi/user/programs/exercises/uncompleted',
    userBreathingProgram: '/v2api/user/programs',
    userStatistics: '/proxyapi/user/statistics',
    userActivities: '/proxyapi/user/activities',
    userScoreGraph: '/proxyapi/user/scores',
    userSuggestPrograms: '/proxyapi/user/programs/suggestProgramsByTags',
    userProgramCurrent: '/proxyapi/user/program/current',
    userProgramLeave: '/proxyapi/user/program/current/leave',
    preNoiseCheck: '/proxyapi/audio/pre_noise_check',
    preNoiseCheck_v2: '/v2api/audio/pre_noise_check',
    userJoinedPrograms: '/proxyapi/user/joins/programs',
    userJoinProgram: '/proxyapi/user/joins/programs/join/', /*last piece of slug is program_id*/
    userLeaveProgram: '/proxyapi/user/joins/programs/leave/', /*last piece of slug is program_id*/
    userCompleteProgram: '/proxyapi/user/joins/programs/complete/', /*last piece of slug is program_id*/
    userAccountDeletion: '/proxyapi/user/request_account_deletion', /*PUT /v1/user/request_account_deletion*/
    userAccountDeletionWithID: '/proxyapi/user/{id}/delete', /*PUT /v1/user/request_account_deletion*/
    userMetaSignin: '/proxyapi/auth/facebook/signin', /*POST */
    userGoogleSignin: '/proxyapi/auth/google/signin', /*POST */
    userAppleSignin: '/proxyapi/auth/apple/signin' /*POST */
  }
  const appConfiguration = {
    app: null,
    texts: {},
    traverse: function (source, prefix, locale) {
      const objectKeys = Object.keys(source);
      let keys = [];
      objectKeys.map((key) => {
        let keyB = prefix + "." + key;
        const child = source[key];
        if (typeof child === 'string') {
          keys.push({"key": keyB, locale: child});
        } else {
          const res = appConfiguration.traverse(child, keyB, locale);
          res.map((item) => keys.push(item));
        }
      });
      return keys;
    },
    listKeys: function (locale) {
      let baseK = null;
      if (locale !== 'en') {
        baseK = appConfiguration.listKeys('en');
      }
      const objectKeys = Object.keys($nuxt.$i18n.messages[locale]);
      let keys = [];
      objectKeys.map((key) => {
        let keyB = key;
        const child = $nuxt.$i18n.messages[locale][key];
        console.log(typeof child);
        if (typeof child === 'string') {
          keys.push({"key": keyB, locale: child});
        } else {
          const res = appConfiguration.traverse(child, keyB, locale);
          res.map((item) => keys.push(item));
        }
      });
      if (locale !== 'en') {
        let final = [];
        baseK.map((item) => {
          const k = item.key;
          const _dV = item.locale;
          const find = keys.find((inew) => inew.key == k)
          if (find) {
            final.push({"key": k, "locale": find.locale})
          } else {
            final.push({"key": k, "locale": _dV})
          }
        });
        return final;
      }
      return keys;
    },
    getText: function (key) {
      if (Object.keys(appConfiguration.texts).length < 1) {
        return appConfiguration.getTexts().then(() => {
          return appConfiguration.getText(key)
        });
      }
      //check text by key:
      return new Promise((resolve, reject) => {
        if (typeof appConfiguration.texts[key] !== 'undefined') {
          resolve(appConfiguration.texts[key]);
          return
        }
        reject(false)
      });
    },
    getTexts: function () {
      return appConfiguration.app.$axiosService.$get($nuxt.$apiConstants.appConfig).then((r) => {
        if (r) {
          appConfiguration.texts = r;
        }
        return appConfiguration.texts;
      });
    },
    // Element or Position to move + Time in ms (milliseconds)
    scrollTo: function (element, duration) {
      var e = document.documentElement;
      if (e.scrollTop === 0) {
        var t = e.scrollTop;
        ++e.scrollTop;
        e = t + 1 === e.scrollTop-- ? e : document.body;
      }
      $nuxt.$appConfiguration.scrollToC(e, e.scrollTop, element, duration);
    },

// Element to move, element or px from, element or px to, time in ms to animate
    scrollToC: function (element, from, to, duration) {
      if (duration <= 0) return;
      if( from == null) return;
      if( to == null) return;
      if (typeof from === "object") from = from.offsetTop;
      if (typeof to === "object") to = to.offsetTop;
      // Choose one effect like easeInQuart
      $nuxt.$appConfiguration.scrollToX(element, from, to, 0, 1 / duration, 20, $nuxt.$appConfiguration.linearTween);
    },
    scrollToX: function (element, xFrom, xTo, t01, speed, step, motion) {
      if (t01 < 0 || t01 > 1 || speed <= 0) {
        element.scrollTop = xTo;
        return;
      }
      element.scrollTop = xFrom - (xFrom - xTo) * motion(t01);
      t01 += speed * step;
      setTimeout(function () {
        $nuxt.$appConfiguration.scrollToX(element, xFrom, xTo, t01, speed, step, motion);
      }, step);
    },

    /* Effects List */
    linearTween: function (t) {
      return t;
    },

    easeInQuad: function (t) {
      return t * t;
    },

    easeOutQuad: function (t) {
      return -t * (t - 2);
    },

    easeInOutQuad: function (t) {
      t /= 0.5;
      if (t < 1) return t * t / 2;
      t--;
      return (t * (t - 2) - 1) / 2;
    },

    easeInCuaic: function (t) {
      return t * t * t;
    },

    easeOutCuaic: function (t) {
      t--;
      return t * t * t + 1;
    },

    easeInOutCuaic: function (t) {
      t /= 0.5;
      if (t < 1) return t * t * t / 2;
      t -= 2;
      return (t * t * t + 2) / 2;
    },

    easeInQuart: function (t) {
      return t * t * t * t;
    },

    easeOutQuart: function (t) {
      t--;
      return -(t * t * t * t - 1);
    },

    easeInOutQuart: function (t) {
      t /= 0.5;
      if (t < 1) return 0.5 * t * t * t * t;
      t -= 2;
      return -(t * t * t * t - 2) / 2;
    },

    easeInQuint: function (t) {
      return t * t * t * t * t;
    },

    easeOutQuint: function (t) {
      t--;
      return t * t * t * t * t + 1;
    },

    easeInOutQuint: function (t) {
      t /= 0.5;
      if (t < 1) return t * t * t * t * t / 2;
      t -= 2;
      return (t * t * t * t * t + 2) / 2;
    },
    easeInSine: function (t) {
      return -Math.cos(t / (Math.PI / 2)) + 1;
    },

    easeOutSine: function (t) {
      return Math.sin(t / (Math.PI / 2));
    },

    easeInOutSine: function (t) {
      return -(Math.cos(Math.PI * t) - 1) / 2;
    },

    easeInExpo: function (t) {
      return Math.pow(2, 10 * (t - 1));
    },

    easeOutExpo: function (t) {
      return -Math.pow(2, -10 * t) + 1;
    },

    easeInOutExpo: function (t) {
      t /= 0.5;
      if (t < 1) return Math.pow(2, 10 * (t - 1)) / 2;
      t--;
      return (-Math.pow(2, -10 * t) + 2) / 2;
    },

    easeInCirc: function (t) {
      return -Math.sqrt(1 - t * t) - 1;
    },

    easeOutCirc: function (t) {
      t--;
      return Math.sqrt(1 - t * t);
    },

    easeInOutCirc: function (t) {
      t /= 0.5;
      if (t < 1) return -(Math.sqrt(1 - t * t) - 1) / 2;
      t -= 2;
      return (Math.sqrt(1 - t * t) + 1) / 2;
    }
  }

  appConfiguration.app = context;
  inject('appConfiguration', appConfiguration)
  inject('apiConstants', apiConstants)
}
