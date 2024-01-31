<template>
  <!--<fullpage-card :class="[step==stepLast?'no-header':'']" :hidefooter="(step==stepLast-1)?false:true" v-if="animate">-->
  <fullpage-card :class="[needsToShowHeader,'setupPage','with-tutorial']"
                 data-swipe-enable="true"
                 :hidefooter="true" v-if="animate&&loading">
    <template v-slot:header v-if="step!=stepBreak">
      <v-row class="navigation" align-content="center" justify="space-between">
        <v-btn icon @click="exitStep">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <div class="exercise__title" v-if="getCurrentExercise">
          <span>{{ $t("setup.title") }}</span>
        </div>
        <v-btn icon style="opacity: 0"> <!-- Hide the info button during setup -->
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </v-row>
      <div class="text-center" v-if="step>stepBreak&&(step<stepLast||(hasVideoTutorial==false&&step<=stepLast))">
        <div class="" v-html="getTutorialTitle(name,step)">
        </div>
      </div>

    </template>
    <template v-slot:body>
      <transition appear name="fade">
        <v-flex align-self-center class="text-center exercise__body"
                v-if="step>stepBreak&&(step<stepLast||(hasVideoTutorial==false&&step<=stepLast))">
          <img :src="getTutorialImage(name,step)">
          <p class="pt-10" v-html="getTutorialText(name,step)"></p>
          <div class="skip_tutorial">
            <v-btn plain text class="skip--btn" @click="skipAll">{{ $t("generic.skiptutorial") }}
              <v-icon>$skip</v-icon>
            </v-btn>
          </div>
        </v-flex>
        <div class="playerArea video tutorial" v-if="step>=stepLast&&hasVideoTutorial!==false"
             id="playerAreaTutorial">
          <video v-bind:id="playerId"
                 :loop="false"
                 controls
                 ref="videofile"
                 :class="['videoplayer',(video&&video.readyState>=2)?'':'hide']"
                 playsinline
                 :poster="getCurrentExercise.tutorialVideoThumbnail?getCurrentExercise.tutorialVideoThumbnail:''"
                 :src="hasVideoTutorial"
                 preload="auto">
          </video>
        </div>
        <div class="tutorial_info"
             v-if="(step==stepBreak)">
          <div class="tutorial__header header">
            <div class="header_wrapper">
              <div v-for="(tutorialSteps,idx) in getCurrentExercise.steps" :key="'tstep_'+idx"
                   v-if="tutorialSteps.showInTutorial">
                <div class="step_title">{{ tutorialSteps.mainText || ' ' }}</div>
                <div class="step_image" v-if="tutorialSteps.image">
                  <v-img :src="tutorialSteps.image || ''" max-width="90" max-height="90"
                  ></v-img>
                </div>
                <div class="step_time" v-if="tutorialSteps.duration>0&&!tutorialSteps.hold">{{
                    (tutorialSteps.duration)
                  }}<span>s</span>
                </div>
              </div>
            </div>
            <div class="header_cycles" v-if="getCurrentExercise.subtype!='dob'&&getCurrentExercise.subtype!='voice'">
              <v-icon>mdi-sync</v-icon>&nbsp;{{ getCurrentExercise.cycles }} {{ $nuxt.$t("setup.cycles") }}
            </div>
          </div>
          <div class="tutorial__body body">
            <div class="tutorial__title">{{ getCurrentExercise.title }}</div>
            <div class="tutorial_exinfo" v-if="getCurrentExercise.duration&&getCurrentExercise.duration>0">
              <v-icon>mdi-clock-time-four-outline</v-icon>&nbsp;
              {{ $humanizeTime(getCurrentExercise.duration) }}
            </div>
            <div class="tutorial__medicalrisks"
                 v-if="getCurrentExercise.medicalRisks && getCurrentExercise.medicalRisks.length>0"
                 @click="openMedicalRisks"
            >
              <v-icon class="warn">$custom_warning</v-icon>
              <div class="tutorial__medicalrisks__content">{{ $t('setup.onlyproceedwithdoctorok') }}</div>
              <v-icon>mdi-chevron-right</v-icon>
            </div>
            <v-divider class="tutorial__divider"></v-divider>
            <div class="tutorial__content" v-html="getCurrentExercise.about||''"></div>
          </div>
        </div>

      </transition>

      <infodialog v-if="getCurrentExercise"
                  :show="about.show"
                  contentclasses="infoContent"
                  @close="closeInfo"
                  :title="getCurrentExercise.title"
                  :description="getCurrentExercise.about||''"
                  :infoImage="getCurrentExercise.aboutImage||getCurrentExercise.thumbnail">
        <template v-slot:closebtn>Alright</template>
      </infodialog>

      <permissionpopup
          :show="permissionPopup.show"
          @close="closePermissionPopup"
          @next="nextPermissionPopup">
      </permissionpopup>

      <v-dialog
          v-if="getCurrentExercise"
          v-model="medicalrisks.show"
          fullscreen
          hide-overlay
          transition="slide-x-reverse-transition-slow"
          content-class="customDialog medicalRisks"
          scrollable
      >
        <fullpage-card :hidefooter="true">
          <template v-slot:header>
            <v-btn icon @click="closeMdRisks" class="closebtn">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <div :class="['without'+'__supertitle','without'+'__thumbInTitle']">

              <div class="text-center infodialog__title">{{ $t('setup.always_remember') }}</div>
            </div>
            <v-btn icon @click="closeMdRisks" class="closebtn" style="opacity: 0">
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </template>
          <template v-slot:body class="text-center">
            <div class="text-center content">
              <div v-html="getCurrentExercise.medicalRisks||''" class="infoContent"></div>
            </div>
          </template>

        </fullpage-card>
      </v-dialog>

    </template>

  </fullpage-card>
</template>
<script>
import basepage from "~/mixins.js/exercisepage";
import {mapActions, mapGetters} from 'vuex'

const setup1 = require('~/assets/images/setup_phone_1.png');
const setup2 = require('~/assets/images/setup_phone_2.png');
const custom_setup2 = require('~/assets/images/custom_setup_phone_1.png');
const dob_setup1 = require('~/assets/images/voice_setup_phone_1.png');
const dob_setup2 = require('~/assets/images/voice_setup_phone_2.png');



export default {
  name: 'setup',
  mixins: [basepage],
  data() {
    return {
      exid: (this.$route.params.id),
      programid: (this.$route.params.fromprogram || false),
      withindex: (this.$route.params.withindex || false),
      backto: (this.$route.params.backto || false),
      "name": "setup",
      "step": 0,
      "stepLast": 3,
      "stepBreak": 2,
      "hasVideoTutorial": false,
      "animate": true,
      "loading": false,
      "hasBack": true,
      "hasInfo": false,
      "grantAsked": false,
      "computeVideOverlayHeight": null,
      skipPermissions: false,
      hasNext: true,
      uuid: '0',
      video: null,
      about: {
        show: false
      },
      medicalrisks: {
        show: false
      },
      permissionPopup: {
        show: false
      }
    }
  },
  transition: {
    name: 'fade',
    mode: 'out-in',
    css: false,
    beforeEnter(el) {
      this.$anime.set(el, {
        scale: 1,
        opacity: 0
      })
    },
    enter(el, done) {
      this.$anime({
        targets: el,
        opacity: [0, 1],
        duration: 500,
        easing: 'easeInOutSine',
        complete: done
      })
    },
    leave(el, done) {
      this.$anime({
        targets: el,
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInOutSine',
        complete: done
      });
      document.body.classList.remove('bodyblock')
    }
  },
  beforeRouteLeave(_to, _from, next) {
    if (window.stream != null) {
      window.stream.getTracks().forEach((track) => {
        track.stop()
      })
    }
    this.$root.$emit('showPager', {"show": true});
    window.stream = null // make stream available to console
    next()
  },
  computed: {
    ...mapGetters({
      getExercises: 'getExercises',
      getCurrentExercise: 'getCurrentExercise',
    }),
    useCustomTutorial() {
      if (this.programid) {
        return this.$exerciseManager.programHasCustomTutorialByProgramId(this.programid)
      }
      return false;
    },
    needsToShowHeader() {
      if (this.step === this.stepBreak) {
        return "no-header";
      }
      //(?'no-header':'')
      return "";
    },
    exercise() {
      return this.getCurrentExercise
    },
    playerId: function () {
      return 'player-' + this.uuid
    }
  },
  watch: {
    'step': function () {
      this.$root.$emit('showPager', {"show": true});
    },
    'grantAsked': function () {
      if (this.step > 1) {
        this.hasNext = this.grantAsked
      } else {
        this.hasNext = true;
      }
    }
  },
  methods: {
    ...mapActions({
      setCurrentExerciseIndex: 'setCurrentExerciseIndex',
      setCurrentExerciseById: 'setCurrentExerciseById'
    }),
    skipAll() {
      this.startExercise();
    },
    openMedicalRisks() {
      this.medicalrisks.show = true;
    },
    fixVideoHeight(videoW, videoH) {
      const videoRatio = videoW / videoH;
      const _videoContainer = document.getElementById('playerAreaTutorial')
      if (_videoContainer) {
        let _maxHeight = document.body.clientHeight;
        let _maxWidth = document.body.clientWidth;
        const _page = _videoContainer.closest('.fullPageCard');
        const _header = _page.querySelector('div.header');
        const _footer = _page.querySelector('div.footer');
        const _mainPager = document.querySelector('.pager');
        if (_header) {
          _maxHeight = _maxHeight - _header.scrollHeight;
        }
        if (_footer) {
          _maxHeight = _maxHeight - _footer.scrollHeight;
        }
        if (_mainPager) {
          _maxHeight = _maxHeight - _mainPager.scrollHeight;
        }

        const _bodyHeight =
            Math.min(
                _maxHeight,
                _page.scrollHeight - ((_header ? _header.scrollHeight : 0) + (_footer ? _footer.scrollHeight : 0))
            );
        _videoContainer.style.height = _bodyHeight + "px";
        _videoContainer.style.width = _bodyHeight * videoRatio + "px";
        console.log('found H & W', _bodyHeight, _bodyHeight * videoRatio);
        _page.querySelector('div.body').style.height = (_bodyHeight - 4) + "px";
        _page.querySelector('div.body').style.overflow = 'hidden';
        _page.querySelector('div.body').classList.remove('horizontal');
        if (_bodyHeight * videoRatio > _maxWidth) {
          _page.querySelector('div.body').classList.add('horizontal');
          _videoContainer.style.width = _maxWidth + "px";
          _videoContainer.style.height = (_maxWidth / videoRatio) + "px";
        }
        if (videoRatio > 0.9 && videoRatio < 1.1) {
          /* is it squared? */
          this.video.style.width = _maxWidth + "px";
          this.video.style.height = (_maxWidth / videoRatio) + "px";
        }
      }
    },
    getTutorialImage(name, step) {
      if (this.getCurrentExercise.subtype == 'dob') {
        return this.getImage(this.$t(name + '.voice_image_' + step))
      }
      if (!this.useCustomTutorial) {
        return this.getImage(this.$t(name + '.image_' + step))
      }
      return this.getImage(this.$t("custom_setup" + '.image_' + step))
    },
    getTutorialTitle(name, step) {
      if (this.getCurrentExercise.subtype == 'dob') {
        return this.$t(name + '.voice_title_' + step);
      }
      if (!this.useCustomTutorial) {
        return this.$t(name + '.title_' + step);
      }
      return this.$t("custom_setup" + '.title_' + step);
    },

    getTutorialText(name, step) {
      if (this.getCurrentExercise.subtype == 'dob') {
        return this.$t(name + '.voice_description_' + step);
      }
      if (!this.useCustomTutorial) {
        return this.$t(name + '.description_' + step);
      }
      return this.$t("custom_setup" + '.description_' + step);
    },
    getImage(source) {
      if (source.indexOf('~/assets') !== -1) {
        return require(source);
      }
      return source
    },
    closeInfo() {
      this.about.show = false;
    },
    closeMdRisks() {
      this.medicalrisks.show = false;
    },
    infoStep() {
      console.log('got info click method [ex]')
      this.about.show = true;
    },
    oncameraupdate(event) {
      console.log('got event from camera', event);
      if (event.event === 'initVideoCapture') {
        this.hasNext = false;
      }
      if (event.event === 'finishinitStream') {
        this.hasNext = true;
      }
    },
    blockClick() {
      this.exerciseStepBack()
      return true;
    },
    moveToNext() {
      if (this.$capacitor.isNativePlatform()) {
        this.$airlyn.checkMicPerm().then((r) => {
          console.log('Permessi al microfono garantiti?', r);
          if (r && r.result === true) {
            this.startExercise()
          } else {
            const e = {
              "name": $nuxt.$t('errors.global.msg_notallowed'),
              exception: r
            }
            this.manageMicError(e, null, function () {
              this.exerciseStepBack()
              return true;
            });
          }
        }).catch((e) => {
          console.error("Permission request fails", e)
          this.manageMicError({
            "name": $nuxt.$t('errors.global.msg_notallowed'),
            exception: e
          }, null, function () {
            this.exerciseStepBack()
            return true;
          });
        });
      } else {
        this.$checkPermissions().then((res) => {
          window.stream = res; //Prevent stream started but non cleared...
          this.startExercise()
        }).catch((e) => {
          console.error('[checkPermissions] allow error', e);
          this.$captureException(e);
          this.manageMicCamError(e, null, function () {
            this.exerciseStepBack()
            return true;
          });
        }).finally(() => {
          this.$nuxt.$loading.finish();
          this.$closeStream(); //Finito di giocare svuota
        })
      }
    },
    allowClickSecond() {
      this.$nuxt.$loading.start();
      this.grantAsked = true;
      if (this.$capacitor.isNativePlatform()) {
        this.$airlyn.requestWholePermissions().then((r) => {
          console.log('Permessi garantiti?', r);
          if (r && /*r.camera === true &&*/ r.storage === true && (r["voice recording"] === true || r["microphone"] === true)) {

          } else {
            console.error('[checkPermissions] allow error');
            this.manageMicCamError({
              "name": $nuxt.$t('errors.global.msg_notallowed')
            }, null, function () {
              this.exerciseStepBack()
              return true;
            });
          }
        }).catch((e) => {
          console.error('[checkPermissions] allow error', e);
          this.$captureException(e);
          this.manageMicCamError(e, null, function () {
            this.exerciseStepBack()
            return true;
          });
        }).finally(() => {
          this.$nuxt.$loading.finish();
          console.log('Close permission popup - native')
          this.permissionPopup.show = false;
          this.nextStep();
        });
      } else {
        this.$checkPermissions().then((res) => {
          window.stream = res; //Prevent stream started but non cleared...
        }).catch((e) => {
          console.error('[checkPermissions] allow error', e);
          this.$captureException(e);
          this.manageMicCamError(e, null, function () {
            this.exerciseStepBack()
            return true;
          });
        }).finally(() => {
          this.$nuxt.$loading.finish();
          this.$closeStream(); //Finito di giocare svuota
          console.log('Close permission popup - web')
          this.permissionPopup.show = false;
          this.nextStep();
        })
      }
    },
    allowClick() {
      //Richiedi permessi webCam
      //Richiedi permessi Audio
      this.$closeStream();
      console.log('pre', this.permissionPopup.show);
      this.permissionPopup.show = true;
      console.log('post', this.permissionPopup.show);
    },
    closePermissionPopup() {
      this.grantAsked = true;
      this.permissionPopup.show = false;
      this.$analytics.logEvent('exercise_tutorial_quit', {
        "id": this.getCurrentExercise.id,
        "name": this.getCurrentExercise.title,
        "program_id": this.getCurrentExercise.program_id || null,
        "type": this.getCurrentExercise.type,
      })
      this.$analytics.logEvent('exercise_tutorial_nopermissions_quit', {
        "id": this.getCurrentExercise.id,
        "name": this.getCurrentExercise.title,
        "program_id": this.getCurrentExercise.program_id || null,
        "type": this.getCurrentExercise.type,
      })
      if (document.querySelector('#__nuxt')) {
        document.querySelector('#__nuxt').classList.add('quit');
      }
      this.exerciseStepBack()
    },
    nextPermissionPopup() {
      this.allowClickSecond();
    },
    exitStep() {

      this.$analytics.logEvent('exercise_tutorial_quit', {
        "id": this.getCurrentExercise.id,
        "name": this.getCurrentExercise.title,
        "program_id": this.getCurrentExercise.program_id || null,
        "type": this.getCurrentExercise.type,
      })
      if (document.querySelector('#__nuxt')) {
        document.querySelector('#__nuxt').classList.add('quit');
      }
      this.exerciseStepBack()
    },
    prevStep() {
      if (this.video) {
        this.video.pause();
      }
      if (this.about.show === true) {
        this.closeInfo();
        return;
      }
      if (this.permissionPopup.show === true) {
        this.closePermissionPopup()
        return;
      }
      this.$el.classList.add('back');
      this.animate = false;
      if (this.getCurrentExercise.type === $nuxt.$exerciseManager.kindHOLD && this.step <= 2) {
        /*this.$analytics.logEvent('exercise_tutorial_' + this.step + "_quit", {
          "id": this.getCurrentExercise.id,
          "name": this.getCurrentExercise.title,
          "program_id": this.getCurrentExercise.program_id || null,
          "type": this.getCurrentExercise.type,
        })
        this.$analytics.logEvent('exercise_tutorial_quit', {
          "id": this.getCurrentExercise.id,
          "name": this.getCurrentExercise.title,
          "program_id": this.getCurrentExercise.program_id || null,
          "type": this.getCurrentExercise.type,
        })
        this.exerciseStepBack()
        return;
         */
      }
      //Prevent step 2
      if(this.step===3 && this.getCurrentExercise && this.getCurrentExercise.subtype==='dob') {
        this.step=2;
      }
      if (this.step <= 0) {
        //this.$router.back();
        this.$analytics.logEvent('exercise_tutorial_' + this.step + "_quit", {
          "id": this.getCurrentExercise.id,
          "name": this.getCurrentExercise.title,
          "program_id": this.getCurrentExercise.program_id || null,
          "type": this.getCurrentExercise.type,
        })
        this.$analytics.logEvent('exercise_tutorial_quit', {
          "id": this.getCurrentExercise.id,
          "name": this.getCurrentExercise.title,
          "program_id": this.getCurrentExercise.program_id || null,
          "type": this.getCurrentExercise.type,
        })
        this.exerciseStepBack()
        return;
      }
      this.step -= (this.step === 0 ? 0 : 1);
      this.$nextTick(() => {
        this.animate = true;
        console.log('remove hide from video?', this.video)
        this.$forceNextTick(() => {
          [...this.$el.querySelectorAll('.hide')].map((i) => i.classList.remove('hide'));
        })
      });
    },
    startExercise() {
      this.$analytics.logEvent('exercise_tutorial_finished', {
        "id": this.getCurrentExercise.id,
        "name": this.getCurrentExercise.title,
        "program_id": this.getCurrentExercise.program_id || null,
        "type": this.getCurrentExercise.type,
      })

      //Ensure video is stopped.
      if (this.video) {
        this.video.pause();
      } else {
        [...document.querySelectorAll('video')].forEach((videoTag) => {
          videoTag.pause();
        })
      }
      let suffix = this.buildSuffix();
      if (suffix.length > 0) {
        suffix = "/" + suffix
      }
      if (this.exercise.type === this.$exerciseManager.kindHOLD) {
        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + "/runnersilent" + suffix));
      } else {
        // TODO TASK SUPPRESS NOISE-CHECK -
        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + "/runner" + suffix));
        //this.$router.push("/ml/exercises/" + this.exid + "/noise-check" + suffix);
      }
    },
    nextStep() {
      if (this.video) {
        this.video.pause();
      }
      if (this.$el && this.$el.classList) {
        this.$el.classList.remove('back');
      }
      this.animate = false;
      console.log('check steps', this.step, this.grantAsked)
      if ((this.getCurrentExercise.type === 'hold' || this.step == 2) && this.grantAsked === false) {
        console.log('load permissions popup');
        this.animate = true;
        this.allowClick();
        return; //Previene il cambio di pagina (potrebbe essere video o start exercise.
      }
      //Prevent step 2
      if(this.step===1 && this.getCurrentExercise && this.getCurrentExercise.subtype==='dob') {
        this.step=2;
      }

      console.log('Step:', this.step, this.hasVideoTutorial, this.exercise.type, this.stepLast);
      if (this.step >= this.stepLast && this.grantAsked === false && this.hasVideoTutorial == false) {
        this.animate = true;
        this.allowClick();
        return; //Previene il cambio di pagina (potrebbe essere video o start exercise.
      } else{
        this.step += 1;
      }

      if (this.step >= this.stepLast && this.hasVideoTutorial == true) {
        //Do something if needed
        console.log('checkif grantAsked')
        this.hasNext = this.grantAsked;
        //if (this.exercise.type === this.$exerciseManager.kindHOLD) {
        //  this.step += 1;
        //}
      } else if (this.step > this.stepLast && this.hasVideoTutorial == false) {
        this.hasNext = this.grantAsked;
      }
      this.$analytics.logEvent('exercise_tutorial_' + this.step, {
        "id": this.getCurrentExercise.id,
        "name": this.getCurrentExercise.title,
        "program_id": this.getCurrentExercise.program_id || null,
        "type": this.getCurrentExercise.type,
      })
      this.$analytics.setScreenName(this.getCurrentExercise.title + " " + this.getCurrentExercise.type + " Tutorial Step " + this.step);
      if (this.step === (this.stepLast)) {
        this.$root.$emit('setNextText', this.$t('generic.start_arrow'));
      }

      if (this.step > this.stepLast) {
        this.startExercise()
      }

      this.$nextTick(() => {
        this.initVideoEvents();
        this.animate = true;
      });


    },
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function (c) {
        let v, r
        r = Math.random() * 16 | 0;
        v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    _handleError: function (e) {
      console.log('got error during video Stream', e);
      this.$root.$emit('showToast', $nuxt.$t('errors.toasts.cannot_reproduce_tutorial'), 'error');
      this.nextStep();
    },
    _handleLoaded: function () {
      console.log('gestisci video carico!')
      if (this.video.readyState >= 2) {
        this.$nextTick(() => {

          this.fixVideoHeight(this.video.videoWidth, this.video.videoHeight);
        });
        this.video.classList.remove('hide');
        console.log('video loaded', this.step);
        if (this.step > 1 && this.video) {
          this.video.play();
        }
      } else {
        this.$root.$emit('showToast', $nuxt.$t('errors.toasts.cannot_reproduce_tutorial'), 'error');
        this.nextStep();
      }
    },
    _handleEnd: function () {
      this.nextStep();
    },
    initVideoEvents() {
      if (!this.video && this.hasVideoTutorial !== false) {
        setTimeout(() => {
          console.log('check video item', document.querySelector('video.videoplayer'));
          this.video = document.querySelector('video.videoplayer'); //this.$el.querySelectorAll('video')[0];
          if (this.video) {
            this.$root.$emit('showToast', $nuxt.$t('errors.toasts.adjust_volume'), 'info', 'mdi-volume-high');
            this.video.addEventListener('error', this._handleError)
            this.video.addEventListener('loadeddata', this._handleLoaded)
            this.video.addEventListener('ended', this._handleEnd)
            this.video.load()
          }
        }, 200)
      }
      if (this.step === this.stepLast && this.hasVideoTutorial !== false) {
        setTimeout(() => {
          if (this.video && this.video.readyState >= 2) {
            console.log('request plya...');
            this.video.load();
            this.video.play();
          }
        }, 200);
      }
    },
    trackExerciseOpening() {
      return new Promise((resolve, reject) => {
        try {
          this.$analytics.logEvent('exercise_tutorial_' + this.step, {
            "id": this.getCurrentExercise.id,
            "name": this.getCurrentExercise.title,
            "program_id": this.getCurrentExercise.program_id || null,
            "type": this.getCurrentExercise.type,
          })
          this.$analytics.setScreenName(this.getCurrentExercise.title + " " + this.getCurrentExercise.type + " Tutorial Step " + this.step);
        } catch (e) {
          console.error("Errore in analytics:", e)
        }
        resolve(true)
      });

    },
    innerStart() {
      console.log('start tutorial:', this.getCurrentExercise)
      this.$nextTick(() => {
        this.$root.$emit('setNextText', this.$t('generic.next'));
        this.$root.$emit('disableNext', false);
        /*
        if (this.getCurrentExercise.type === $nuxt.$exerciseManager.kindHOLD) {
          this.step = 1;
          this.nextStep();
        }
        */
        this.trackExerciseOpening().then((r) => {

        }).finally(() => {
          this.loading = true;
        })
      })
    },
    handleBack() {
      this.prevStep();
    },
    disableSwipeEvent() {
      console.log('disable tutorial Swipe');
      this.$root.$off('swipe', this.swipeEvent); //Ricordati di spegnere il listener
    },
    swipeEvent(e) {
      if (this.permissionPopup.show) {
        return;
      }
      console.log('LISTEN some one is swiping', e.target, e.detail)
      if (e.detail && e.detail.dir) {
        if (e.detail.dir === 'right') {
          this.handleBack()
        }
        if (e.detail.dir === 'left') {
          this.nextStep()
        }
      }
    }
  },
  mounted() {
    //Enable swipe listeners:
    this.$root.$on('swipe', this.swipeEvent);
    if (this.$capacitor && this.$capacitor.isNativePlatform()) {
      this.$backEmitter.callback = this.handleBack;
    }
    //Needs to request permission:
    this.stepBreak = 0;

    if (this.getCurrentExercise && this.getCurrentExercise.tutorialVideo && (this.getCurrentExercise.tutorialVideo + "").length > 0) {
      this.uuid = this.generateUUID();
      this.hasVideoTutorial = this.getCurrentExercise.tutorialVideo;
    }
    if (this.skipPermissions) {
      this.stepLast = this.hasVideoTutorial !== false ? 3 : 2
    } else {
      this.stepLast = this.hasVideoTutorial !== false ? 3 : 2
    }

    if (this.getCurrentExercise && this.getCurrentExercise.type === 'hold') {
      this.stepLast = this.hasVideoTutorial !== false ? 1 : 0;
    }

    if (this.$capacitor.isNativePlatform()) {
      this.$airlyn.checkWholePermissions().then((r) => {
        console.log('got whole permission check result', r);
        const validValues = ["granted", true];
        const availablePermissions = [
          /*"camera",*/
          "storage",
          "voice recording"
        ];
        let valid = false;
        availablePermissions.map((k) => {
          if (validValues.indexOf(r[k]) !== -1) {
            valid = true;
          } else {
            valid = false;
          }
        });
        console.log('checked permissions', valid);
        this.skipPermissions = valid;
        this.grantAsked = valid;
        //this.stepBreak = valid ? 2 : this.stepBreak;
      }).finally(() => {
        this.innerStart();
      })
    } else {
      this.innerStart();
    }

  },
  beforeDestroy: function () {
    if (this.video) {
      this.video.removeEventListener('loadeddata', this._handleLoaded)
      this.video.removeEventListener('error', this._handleError)
      this.video.removeEventListener('ended', this._handleEnd)
    }
    this.disableSwipeEvent();
  }

}
</script>
