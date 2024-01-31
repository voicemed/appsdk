<template>
  <!--<fullpage-card :class="[step==stepLast?'no-header':'']" :hidefooter="(step==stepLast-1)?false:true" v-if="animate">-->
  <fullpage-card :class="[(step==stepLast?'no-header':''),'setupPage',step!=2&&hasTutorial!==false?'with-tutorial':'']"
                 :hidefooter="true" v-if="animate">
    <template v-slot:header v-if="step<stepLast">
      <v-row class="navigation" align-content="center" justify="space-between">
        <v-btn icon @click="exitStep">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <div class="exercise__title" v-if="getCurrentExercise">
          <span v-if="hasTutorial!==false&&step===0">How it works</span>
          <span v-html="getCurrentExercise.title" v-else></span>
        </div>
        <v-btn icon style="opacity: 0"> <!-- Hide the info button during setup -->
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </v-row>
      <div class="text-center" v-if="hasTutorial===false">
        <div class="" v-html="$t(name + '.title_' + step)">
        </div>
      </div>

    </template>
    <template v-slot:body>
      <transition appear name="fade">
        <v-flex align-self-center class="text-center exercise__body"
                v-if="step<stepLast&&(hasTutorial===false||step===2)">
          <img :src="getImage($t(name + '.image_'+step))">
          <p class="pt-10" v-html="$t(name + '.description_' + step)"></p>
          <div class="text-center skipcnt" v-if="step===0">
            <v-checkbox
              color="primary"
              v-model="useTutorial"
              :label="$t('setup.skip')"
            ></v-checkbox>
          </div>
        </v-flex>
        <div class="playerArea video tutorial" v-if="step!=2&&step<stepLast&&hasTutorial!==false"
             id="playerAreaTutorial">
          <video v-bind:id="playerId"
                 :loop="false"
                 controls
                 ref="videofile"
                 class="hide"
                 playsinline
                 :poster="getCurrentExercise.tutorialVideoThumbnail?getCurrentExercise.tutorialVideoThumbnail:''"
                 :src="hasTutorial"
                 preload="auto">
          </video>
        </div>
        <div v-if="step==stepLast" class="video__container">
          <camtester @postmessage="oncameraupdate"/>
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
    </template>
    <!--
    <template v-slot:footer>
      <div v-if="(step==stepLast-1)" class="allowAdvice">
        <div class="__title">{{$t('generic.allowmicrophone.title')}}</div>
        <div class="__content">{{$t('generic.allowmicrophone.text')}}</div>
        <div class="__footer">
          <v-btn text @click="blockClick">{{$t('generic.allowmicrophone.block')}}</v-btn> | <v-btn text @click="allowClick">{{$t('generic.allowmicrophone.allow')}}</v-btn>
        </div>
      </div>
    </template>
    -->
  </fullpage-card>
</template>
<script>
import basepage from "~/mixins.js/exercisepage";
import {mapActions, mapGetters} from 'vuex'

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
      "useTutorial": false,
      "hasTutorial": false,
      "animate": true,
      "hasBack": true,
      "hasInfo": false,
      "grantAsked": false,
      "computeVideOverlayHeight": null,
      skipPermissions: false,
      hasNext: true,
      uuid: '0',
      about: {
        show: false
      }
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
      skipTutorial: 'skipTutorial'
    }),
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
    }
  },
  methods: {
    ...mapActions({
      setSkipTutorial: 'setSkipTutorial',
      setCurrentExerciseIndex: 'setCurrentExerciseIndex',
      setCurrentExerciseById: 'setCurrentExerciseById'
    }),
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
        _page.querySelector('div.body').style.height = (_bodyHeight - 4) + "px";
        _page.querySelector('div.body').style.overflow = 'hidden';
        _page.querySelector('div.body').classList.remove('horizontal');
        if (_bodyHeight * videoRatio > _maxWidth) {
          _page.querySelector('div.body').classList.add('horizontal');
          _videoContainer.style.width = _maxWidth + "px";
          _videoContainer.style.height = (_maxWidth / videoRatio) + "px";
        }
      }
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
              "name": "NotAllowedError",
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
            "name": "NotAllowedError",
            exception:e
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
    allowClick() {
      //Richiedi permessi webCam
      //Richiedi permessi Audio
      this.$closeStream();
      this.$nuxt.$loading.start();
      this.grantAsked = true;
      if (this.$capacitor.isNativePlatform()) {
        this.$airlyn.requestWholePermissions().then((r) => {
          console.log('Permessi garantiti?', r);
          if (r && /*r.camera === true && */ r.storage === true && (r["voice recording"] === true || r["microphone"] === true)) {
            this.nextStep();
          } else {
            console.error('[checkPermissions] allow error');
            this.manageMicCamError({
              "name": "NotAllowedError"
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
        });
      } else {
        this.$checkPermissions().then((res) => {
          window.stream = res; //Prevent stream started but non cleared...
          this.nextStep();
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
    exitStep() {
      if (document.querySelector('#__nuxt')) {
        document.querySelector('#__nuxt').classList.add('quit');
      }

      this.exerciseStepBack()
    },
    prevStep() {
      if (this.about.show === true) {
        this.closeInfo();
        return;
      }
      this.$el.classList.add('back');
      this.animate = false;
      if (this.step <= 0) {
        this.$router.back();
      }
      if (this.step === 2 && this.hasTutorial !== false) {
        this.step = 0;
      } else {

        this.step -= (this.step === 0 ? 0 : 1);
      }
      this.$nextTick(() => {
        this.animate = true;
        console.log('remove hide from video?', this.video)
        this.$forceNextTick(() => {
          [...this.$el.querySelectorAll('.hide')].map((i) => i.classList.remove('hide'));
        })
      });
    },
    startExercise() {
      let suffix = this.buildSuffix();
      if(suffix.length>0) {
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
      if (this.$el && this.$el.classList) {
        this.$el.classList.remove('back');
      }
      this.setSkipTutorial(this.useTutorial);
      this.animate = false;
      if (this.step == (this.stepLast - 1) && this.grantAsked === false) {
        this.allowClick();
        return;
      }

      console.log('Start Step:', this.step, this.hasTutorial !== false, this.stepLast);
      if (this.step < 2 && this.hasTutorial !== false) {
        this.moveToNext();
        return
      } else if (this.step !== this.stepLast && this.skipPermissions) {
        this.step = this.stepLast;
      } else {
        this.step += 1;
      }
      console.log('Step:', this.step, this.hasTutorial, this.exercise.type, this.stepLast);
      if (this.step == this.stepLast) {
        //Do something if needed
        this.hasNext = false;
        if (this.exercise.type === this.$exerciseManager.kindHOLD) {
          this.step += 1;
        }
      }

      if (this.step > this.stepLast) {
        this.startExercise()
      }

      this.$nextTick(() => {
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
    _handleLoaded: function () {

      if (this.video.readyState >= 2) {
        this.$nextTick(() => {
          this.fixVideoHeight(this.video.videoWidth, this.video.videoHeight);
        });
        this.video.classList.remove('hide');

        console.log('video loaded', this.step);
        if (this.step < 2) {
          this.video.play();
        }
      } else {
        this.$root.$emit('showToast', "Cannot reproduce tutorial", 'error');
        this.nextStep();
      }
    },
    _handleEnd: function () {
      this.nextStep();
    }
  },
  mounted() {
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
      })
    }


    this.useTutorial = this.skipTutorial;
    if (this.getCurrentExercise && this.getCurrentExercise.type === this.$exerciseManager.kindHOLD) {
      this.stepLast = 2;
    }
    if (this.getCurrentExercise && this.getCurrentExercise.tutorialVideo) {
      this.uuid = this.generateUUID();
      this.hasTutorial = this.getCurrentExercise.tutorialVideo;
      this.$nextTick(() => {
        this.video = this.$el.querySelectorAll('video')[0];
        this.$root.$emit('setNextText', this.$t('generic.next'));
        this.video.addEventListener('loadeddata', this._handleLoaded)
        this.video.addEventListener('ended', this._handleEnd)
        this.$root.$emit('disableNext', false);
        this.video.load()
      })
    } else if (this.useTutorial) {
      this.step = 2;
    }
  },
  beforeDestroy: function () {
    if (this.video) {
      this.video.removeEventListener('loadeddata', this._handleLoaded)
      this.video.removeEventListener('ended', this._handleEnd)
    }
  }

}
</script>
