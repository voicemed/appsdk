<template>
  <v-app :class="['app_'+currentRouteClean,deviceClass,currentApp]">
    <v-main data-swipe-threshold="100"
            :class="['mainApp',hasPager?'with__pager':'',withBottom?'with__bottom':'', currentRoute, currentRouteClean, (withKeyboard?'hasKeyboard':''),deviceClass,currentApp]">
      <Nuxt class="navpages"/>
      <transition name="fade">
        <Pager v-if="hasPager"/>
      </transition>
      <v-bottom-navigation v-if="withBottom&&loggedIn" fixed color="colorsecondary" height="15vh"
                           v-model="currentRouteClean"
                           class="mainBottom">
        <v-btn @click="gotoUrl($nuxt.localePath('/user/today'),'today_cta')" nuxt value="today">
          <span>{{ $t('generic.today') }}</span>
          <v-icon>$today</v-icon>
        </v-btn>
        <v-btn @click="gotoUrl($nuxt.localePath('/home'),'discovery_cta')" nuxt value="index">
          <span>{{ $t('generic.home') }}</span>
          <v-icon>$discovery</v-icon>
        </v-btn>

        <v-btn
            @click="gotoUrl($nuxt.localePath('/user/me'),'me_cta')" nuxt value="me">
          <span>{{ $t('generic.me') }}</span>
          <v-icon>$me</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-main>
    <v-overlay :opacity="1" light color="#ffffff" :z-index="9999" :value="showOverlay" class="mainOverlay">
      <v-img :src="airlynlogo" max-width="23vw"></v-img>
      <div class="logo_overlay"></div>
    </v-overlay>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :bottom="true">
      <v-icon v-if="snackbar.icon">{{ snackbar.icon }}</v-icon>
      <span v-html="snackbar.text"></span>
    </v-snackbar>
    <errordialog
        :hasretry="error.hasretry"
        :title="error.title"
        :error="error.message"
        :show="error.show"
        @click="errorAction"
        @close="errorResetAction">
      <template v-if="error.retryBtn" v-slot:retrybtn>
        <div class="btncustomcontent" v-html="error.retryBtn"></div>
      </template>
      <template v-if="error.leaveBtn" v-slot:leavebtn>
        <div class="btncustomcontent" v-html="error.leaveBtn"></div>
      </template>
    </errordialog>
    <permissionpopup
        :show="permissionerror.show"
        :warning="true"
        @close="closePermissionPopup"
        @next="nextPermissionPopup">
    </permissionpopup>
    <v-dialog
        v-model="dyn.appDialog"
        fullscreen
        hide-overlay
        persistent
        content-class="customDialog versiondialog"
        scrollable>
      <fullpage-card>
        <template v-slot:header>

        </template>
        <template v-slot:body class="text-center">
          <div class="program_page versionpage withdynamicTexts">

            <div class="content__block">
              <div class="logo">
                <img :src="airlynlogo"/>
              </div>
              <img :src="cloudsImage" class="clouds"/>
              <div class="wrapper">
                <h3>New update is available</h3>
                <div class="withdynamicTexts" v-html="dyn.appVersionText"></div>
              </div>

            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div class="pager">
            <v-btn
                color="nextvm"
                @click="updateAction"
                class="nextvm"
            >
              <span>{{ $t('generic.update') }}</span>
            </v-btn>
            <v-btn
                color="backvm"
                @click="forceHideVersionPopup"
                class="backvm"
            >
              <span>{{ $t('generic.skip_login') }}</span>
            </v-btn>
          </div>
        </template>
      </fullpage-card>
    </v-dialog>
  </v-app>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

const baseAirlynLogo = require('~/assets/images/airlyn_logo_white.svg');
const rocketLogo = require('~/assets/images/rocket.svg');
const cloudsRef = require('~/assets/images/clouds.png');

const disclosureAnimation = {
  targets: ".logo_overlay",
  top: ['100%', '0'],
  easing: 'easeInOutQuad',
  duration: 500
}

export default {
  name: 'DefaultLayout',
  data() {
    return {
      currentRouteClean: '',
      loggedIn: false,
      withKeyboard: false,
      withBottom: false,
      title: 'Airlyn',
      hasPager: true,
      showOverlay: false,
      snackbar: {
        show: false,
        text: "",
        color: "",
        icon: false
      },
      dyn: {
        appVersion: null,
        appVersionText: null,
        appDialog: false,
        downloadcountersent: false
      },
      error: {
        show: false,
        hasretry: true,
        title: "An error has occurred",
        message: "Ops try again later.",
        clickAction: null,
        resetAction: null,
        retryBtn: null,
        leaveBtn: null
      },
      permissionerror: {
        show: false
      },
      swipeEvents: {
        isSwiping: null,
        direction: null
      }
    }
  },
  watch: {
    '$route.name': function () {

      this.checkCurrentRoute()
    },
    'swipeEvents.isSwiping': function () {
      consoe.log('someone swipe me', this.swipeEvents.isSwiping, this.swipeEvents.direction);
    }
  },
  computed: {
    ...mapGetters({
      isCurrentUserGuest: 'isCurrentUserGuest',
      getCurrentPage: 'getCurrentPage',
      getExercises: 'getExercises',
      getPrograms: 'getPrograms'
    }),
    cloudsImage() {
      return cloudsRef;
    },
    currentApp() {
      if (this.isAirlyn) {
        return 'airlyn-app';
      }
      if (this.isVoicemed) {
        return 'voicemed-app';
      }
      return "mvapp";
    },
    deviceClass() {
      let deviceClasses = [];
      if ($nuxt.$device.isMobile) {
        deviceClasses.push("mobile");
      }
      if ($nuxt.$device.isIos) {
        deviceClasses.push("ios");
      }
      if ($nuxt.$device.isApple) {
        deviceClasses.push("apple");
      }
      if ($nuxt.$device.isChrome) {
        deviceClasses.push("chrome");
      }
      if ($nuxt.$device.isAndroid) {
        deviceClasses.push("android");
      }
      if (this.$capacitor && this.$capacitor.isNativePlatform()) {
        deviceClasses.push(this.$capacitor.getPlatform());
      }
      return deviceClasses.join(" ");
    },
    deviceFamily() {
      if ($nuxt.$device.isIos) {
        return "ios";
      }

      if ($nuxt.$device.isAndroid) {
        return "android";
      }
      return "other";
    },
    rocketImage() {
      return rocketLogo
    },
    airlynlogo() {
      return baseAirlynLogo
    },
    currentPage() {
      return this.getCurrentPage
    },
    currentRoute() {
      if (this.$route && this.$route.name) {
        if (this.$route.name.indexOf("home") !== -1) {
          return 'home';
        }
        //console.log('current route?', this.$route.name);
        return this.$route.name;
      }
      console.warn('current route unknow');
      return 'unknown';
    },
    isVoicemed() {
      return $nuxt.$config.env.environment.indexOf('voicemed_') > -1
    },
    isAirlyn() {
      return $nuxt.$config.env.environment.indexOf('voicemed_') < 0
    },

    hasRunningPrograms() {
      return this.hasJoinedPrograms;
    }
  },
  methods: {
    ...mapActions({
      addDoneExercise: 'addDoneExercise',
      updateExercise: 'updateExercise',
      setPerformed: 'setPerformed',
      addJoinedProgram: 'addJoinedProgram',
      setJoinedProgram: 'setJoinedProgram',
      setJoinedProgramExercise: 'setJoinedProgramExercise'
    }),
    checkLoggedStatus(value) {
      console.debug('got change login status', value);
      this.loggedIn = this.$auth.loggedIn;
    },
    gotoUrl(url, event) {
      this.$analytics.logEvent(event, {})
      this.$nuxt.$router.push(url)
    },
    hasJoinedPrograms() {
      return Object.keys(this.$nuxt.$store.getters.getJoinedPrograms)
    },
    hasJoinedProgramById(id) {
      return this.$nuxt.$store.getters.hasJoinedProgramById(id)
    },
    getJoinedProgramById(id) {
      return this.$nuxt.$store.getters.getProgramById(id)
    },
    closePermissionPopup() {
      this.permissionerror.show = false;
      $nuxt.$router.replace($nuxt.localePath("/home"));

    },
    nextPermissionPopup() {
      $nuxt.$airlyn.openPermissionPanel().then((r) => {
        console.log('got openPermission Panel then', r, JSON.stringify(r))
      }).catch((e) => {
        console.log('got openPermission Panel catch', e, JSON.stringify(e))
      }).finally(() => {
        this.permissionerror.show = false;
        $nuxt.$router.replace($nuxt.localePath("/home"));
      })
    },
    updateAction() {
      this.$airlyn.openAppStore().then((r) => {
        console.log('app store opened!');
      }).finally(() => {
        console.log('end!');
      })
    },
    initDownloadCounter() {
      //Sent :
      const key = "sentdownloadcounter_v1";
      this.downloadcountersent = false;
      this.$airlyn.preferenceGet({'key': key}).then((r) => {
        console.log('preference read (' + key + ')!', r);
        if (r && r.value && (r.value === 1 || r.value == '1')) {
          console.log('got preferece for ', key, r.value);
          this.downloadcountersent = true;
        }
      }).finally(() => {
        console.log('check download counter sending:', this.downloadcountersent)
        if (this.downloadcountersent === false) {
          this.$deviceInfo.getInfoObject().then((r) => {
            console.log("got device info", r);
            const _uuid = this.$deviceInfo.currentUUID;
            const params = {
              deviceId: _uuid,
              deviceFamily: r.platform || "",
              osVersion: r.osVersion || "",
              manufacturer: r.manufacturer || ""
            };
            const headers = {
              useCache: false
            }
            console.log('ready to send download counter:', params)
            return this.$axios.$post($nuxt.$apiConstants.installCounter, params, headers).then((r) => {
              console.log('Download load counter sent');
              this.$airlyn.preferenceSet({'key': key, 'value': "1"}).finally(() => {
                console.log('preference stored for!', key);
              });
              this.downloadcountersent = true
            });
          }).catch((e) => {
            console.error("Cannot send download counter", e)
          }).finally(() => {
            console.log("Download counter sent?  ")
          })
        }
      });
    },
    setDownloadCounter() {

      if (!this.$capacitor) {
        return;
      }
      if (!this.$capacitor.isNativePlatform()) {
        return;
      }

      this.$airlyn.preferenceConfigure({'group': 'airlyn'}).finally(() => {
        console.log('preferences ready');
        this.initDownloadCounter();
      });
    },
    checkCurrentVersion() {
      const currentAppVersion = $nuxt.$config.env.version;
      this.$appConfiguration.getTexts().finally(() => {
        this.$appConfiguration.getText('app_version').then((r) => {
          this.dyn.appVersion = r;
          return this.$appConfiguration.getText('app_version_message').then((r) => {
            this.dyn.appVersionText = r;
          })
        }).finally(() => {
          console.log('check current Version | ', currentAppVersion, this.dyn.appVersion)
          if (currentAppVersion !== this.dyn.appVersion) {
            //Show change version popup...
            console.log('request show v Popup')
            this.dyn.appDialog = true;
          }

        });
      });
    },
    retrieveRouteName() {
      if (this.$route && this.$route.name) {
        return this.$route.name;
      }
      return 'unknown';
    },
    setCurrentClean() {
      const routeName = this.retrieveRouteName()
      if (routeName.indexOf("home") !== -1) {
        this.currentRouteClean = 'index';
        return;
      }
      if (routeName.indexOf("user-today") !== -1) {
        this.currentRouteClean = 'today';
        return;
      }
      if (routeName.indexOf("today") !== -1) {
        this.currentRouteClean = 'today';
        return;
      }
      if (routeName.indexOf("user-me") !== -1) {
        this.currentRouteClean = 'me';
        return;
      }
      this.currentRouteClean = $nuxt.getRouteBaseName(this.$route);
    },
    forceCurrentCleanPage(e) {
      if (e.name) {
        this.currentRouteClean = e.name;
      }
    },
    checkCurrentRoute() {
      //console.log('retrieve route route', $nuxt.getRouteBaseName(), this.$route, this.$route.name);
      this.$analytics.setDeviceProperty(this.deviceFamily);
      const routeName = this.retrieveRouteName();
      if (this.$route && this.$route.name) {
        this.setCurrentClean();
        if (routeName.indexOf("home") !== -1) {
          this.$analytics.logScreen(routeName);
          this.withBottom = true;
          return;
        }
        if (routeName.indexOf("user-today") !== -1) {
          this.$analytics.logScreen(routeName);
          this.withBottom = true;
          return;
        }
        if (routeName.indexOf("today") !== -1) {
          this.$analytics.logScreen(routeName);
          this.withBottom = true;
          return;
        }
        if (routeName.indexOf("user-me") !== -1) {
          this.$analytics.logScreen(routeName);
          this.withBottom = true;
          return;
        }
        if (routeName.indexOf("settings") !== -1) {
          this.$analytics.logScreen(routeName);
          this.withBottom = true;
          return;
        }
        if (routeName.indexOf("entries") !== -1) {
          this.$analytics.logScreen(routeName);
          this.withBottom = true;
          return;
        }
        if (routeName.indexOf("welcome") !== -1) {
          this.$analytics.logScreen(routeName);
          this.withBottom = false;
          return;
        }
        this.withBottom = false;
        if (routeName.indexOf('ml-runexercise') !== -1 || routeName.indexOf('mlgreetings') !== -1) {
          let composeName = [];
          if (this.$route.params) {
            if (this.$route.params.fromprogram) {
              composeName.push("programs");
              composeName.push(this.$route.params.fromprogram);
            }
            if (this.$route.params.id) {
              composeName.push("exercises");
              composeName.push(this.$route.params.id);
            }
            if (this.$route.params.fromexercise) {
              composeName.push("exercises");
              composeName.push(this.$route.params.fromexercise);
            }
            if (routeName.indexOf('ml-runexercise-setup') !== -1) {
              composeName.push("tutorial")
            }
            if (routeName.indexOf('ml-runexercise-noise') !== -1) {
              composeName.push("noisecheck")
            }
            if (routeName.indexOf('mlgreetings') !== -1) {
              composeName.push("finish")
            }
          }
          this.$analytics.logScreen(composeName.join("/"));
        } else {
          this.$analytics.logScreen(routeName);
        }

      }
    },
    showSnackBar(text, type, icon) {
      if (typeof icon === 'undefined') {
        icon = false;
      }
      if (type === 'error') {
        this.snackbar.color = "red accent-2";
      } else if (type === 'success') {
        this.snackbar.color = "green accent-2";
      } else {
        this.snackbar.color = "";
      }
      this.snackbar.text = text;
      this.snackbar.show = true;
      this.snackbar.icon = icon;
    },
    hideError() {
      this.$gtag('event', 'error', {
        'event_label': 'Close',
        'event_category': 'Errors',
      })
      this.error.clickAction = null;
      this.error.resetAction = null;
      this.error.show = false;
    },
    errorAction() {
      let executeLeave = true;
      if (typeof this.error.clickAction === 'function') {
        executeLeave = this.error.clickAction();
      }
      if (executeLeave === true) {
        this.hideError();
      }
      this.$gtag('event', 'error', {
        'event_label': 'ErrorAction',
        'event_category': 'Errors',
      })
    },
    errorResetAction() {
      this.$gtag('event', 'error', {
        'event_label': 'Reset',
        'event_category': 'Errors',
      })
      let executeLeave = true;
      if (typeof this.error.resetAction === 'function') {
        executeLeave = this.error.resetAction();
      }
      if (executeLeave === true) {
        this.hideError();
      }
    },
    showPager(e) {
      if (typeof e.show == 'boolean') {
        this.hasPager = e.show;
      }
    },
    showPermissionError(e) {
      this.permissionerror.show = true;
    },
    showErrors(e) {
      const baseError = Object.assign({
        hasretry: false,
        title: "An error has occurred",
        error: "Ops try again later.",
        click: null,
        resetEvent: null,
        leaveBtn: null,
        retryBtn: null
      }, e);
      this.error.hasretry = baseError.hasretry;
      this.error.title = baseError.title;
      this.error.message = baseError.error;
      this.error.clickAction = baseError.click;
      this.error.resetAction = baseError.resetEvent;
      this.error.leaveBtn = baseError.leaveBtn;
      this.error.retryBtn = baseError.retryBtn;
      this.error.show = true;
      this.$gtag('event', 'error', {
        'event_label': baseError.title,
        'event_category': 'Errors',
      })
      this.$analytics.logEvent("error", {
        "title": baseError.title
      });
    },
    showOverlayEvent(e) {
      if (typeof e.show == 'boolean') {
        if (e.show === false) {
          let dAnim = disclosureAnimation;
          dAnim.complete = (anim) => {
            this.showOverlay = false;
          }
          this.$anime(dAnim);
        } else {
          this.showOverlay = e.show;
        }

      }
    },
    forceHideVersionPopup() {
      console.log('request close v Popup')
      this.dyn.appDialog = false;
    },
    completedExercise(exercise) {
      console.log('someone completed an exercise', exercise);
      if (exercise.completed) {
        this.$analytics.logEvent("exercise_completed", {
          "id": exercise.id,
          "program_id": typeof exercise['program_id'] !== 'undefined' ? exercise.program_id : null,
          "type": exercise.type
        });
        this.addDoneExercise(1);
        this.updateExercise(exercise);
        const headers = {
          Authorization: this.$auth.strategy.token.get()
        }
        if (typeof exercise['program_id'] !== 'undefined' && typeof exercise['program_index'] !== 'undefined') {
          //Update program status .
          this.$exerciseManager.clearProgramCurrentJoinedCache();
          this.$exerciseManager.clearProgramStatus(exercise.program_id)
          if (this.hasRunningPrograms && this.hasJoinedProgramById(exercise.program_id)) {
            this.setJoinedProgramExercise(exercise)
            this.$exerciseManager.fillProgram(this.getJoinedProgramById(exercise.program_id), false);
          }
        } else {
          this.$axios.$get($nuxt.$apiConstants.userPerformedExercises, headers).then((r) => {
            if (r && Array.isArray(r)) {
              r.map((item) => {
                const _upd = item.createdAt;
                item.isplaying = false;
                item.playtime = 0;
                if (_upd) {
                  item.month = _upd.substr(0, 7);
                }
              });
              this.setPerformed(r);
            }
          })
        }
      }
    },
    consumeNotification(notification) {
      console.log('got tap for notification', notification);
      if (notification.id && notification.program) {
        this.$exerciseManager.fillProgramById(notification.id).then((program) => {
          $nuxt.$router.push($nuxt.localePath("/ml/programs/" + program.id));
        });
      }
      if (notification.id && notification.open) {
        //Open page address included in open function
        $nuxt.$router.push($nuxt.localePath(notification.open));
      }
    }
  },
  beforeDestroy() {
    this.$keyboard.removeAllListeners();
  },
  beforeMount() {
    //console.log('has device info?', $nuxt.$deviceInfo)
    if ($nuxt.$deviceInfo.currentUUID === null) {
      $nuxt.$deviceInfo.fillUUID().finally(() => {
        console.log('got device uuid', $nuxt.$deviceInfo.currentUUID)
      })
    }
  },
  mounted() {

    this.loggedIn = this.$auth.loggedIn;
    this.$auth.$storage.watchState('loggedIn', this.checkLoggedStatus)
    this.checkCurrentRoute();
    this.setDownloadCounter();
    this.$root.$on('showError', this.showErrors);
    this.$root.$on('showPermssionError', this.showPermissionError);
    this.$root.$on('showToast', this.showSnackBar);
    this.$root.$on('showPager', this.showPager);
    this.$root.$on('showOverlay', this.showOverlayEvent);
    this.$root.$on('completedExercise', this.completedExercise);
    this.$root.$on('hideVersionPopup', this.forceHideVersionPopup);
    this.$root.$on('currentPageChanged', this.forceCurrentCleanPage);
    this.$nuxt.$on('notification_open', this.consumeNotification)
    this.$splashscreen.hide().then((e)=>{
      console.warn('Splash screen off');
    }).catch((e)=>{
      console.error('cannot hide splash screen');
    })

    if (this.$capacitor && this.$capacitor.isNativePlatform()) {
      if (this.$keyboard) {
        this.$keyboard.addListener('keyboardWillShow', info => {
          this.$root.$emit('keyboardWillShow', info);
          this.withKeyboard = true;
        });

        this.$keyboard.addListener('keyboardDidShow', info => {
          this.$root.$emit('keyboardDidShow', info);
          this.withKeyboard = true;
        });

        this.$keyboard.addListener('keyboardWillHide', () => {
          this.$root.$emit('keyboardWillHide', {});
        });

        this.$keyboard.addListener('keyboardDidHide', () => {
          this.$root.$emit('keyboardDidHide', {});
          this.withKeyboard = false;
        });
      }
    }
    this.$nextTick(() => {
      this.checkCurrentVersion()
    })
  }
}
</script>
