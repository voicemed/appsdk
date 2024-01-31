<!-- todo: ripristinare progress parziale con 5 secondi + send rest, nascondere il countdown, switch schermata solo dopo restApi response -->

<template>
  <fullpage-card class="center-title noise exercisecc" :hidefooter="true">
    <template v-slot:header>
      <v-row class="navigation" align-content="center" justify="center">
        <div class="exercise__title">
          <span>{{ $t('generic.soundcheck') }}</span>
        </div>
      </v-row>
      <!--
      <div class="text-center mintwoRows" style="display: none">
        <div class="exercise__title" v-if="getCurrentExercise">
          <span v-html="getCurrentExercise.title"></span>
        </div>
        <div class="" v-html="getTitle"></div>
      </div>
      -->
    </template>
    <template v-slot:body>
      <div class="exercises__container noisechecker" v-show="getCurrentExercise" :key="countdownrunning">
        <exerciseanimationprogress
          :key="countdownrunning"
          v-model="timer"
          :exerciseSteps="0"
          :startPercent="0"
          :maxPercent="0"
          class="finished"
          doneClass="doneNone"
          :runningPercent="currentPercent">
          <template v-slot:inside>
            <div class="timer text-center noise">
              <transition mode="out-in" name="exittop">
                <p v-html="$t('generic.noisestart')" v-if="timer<timerLength&&countdownrunning"
                   :key="finish&&loading&&countdownrunning"></p>
                <p v-if="!finish&&loading" v-html="$t('ml_exercise.almostdone')" :key="!finish&&loading"></p>
                <p v-if="finish&&!loading" v-html="$t('generic.noiseready')" :key="finish&&!loading"></p>
              </transition>
            </div>
          </template>
        </exerciseanimationprogress>
        <div style="display: none">
          <b>Debug</b><br/>
          <p>Peak dB:<b>{{ audioLevels.peakLevel }}</b></p><br/>
          <p>Average dB:<b>{{ audioLevels.averageLevel }}</b></p>

        </div>
      </div>
      <CountDownItem :timerLength="(timerLength*1000)" :interval="500" ref="noisecountdown" @progress="timerChange"
                     @end="timerEnd"></CountDownItem>
      <v-bottom-sheet v-model="bottomsheet.show||hasWarning" persistent :overlay-opacity="0.9">
        <div class="bottomsheet">
          <div class="text">
            {{ errorMessage || $t('generic.noisewarning') }}
          </div>
          <div class="actions">
            <v-btn
              color="leavevm"
              text
              nuxt
              outlined
              @click="nextStep">
              <div class="btncustomcontent" v-html="$t('generic.startanyway')"></div>
            </v-btn>
            <v-spacer/>
            <v-btn color="nextvm"
                   nuxt
                   @click="retryNoise">
              <span v-html="$t('generic.retry')"></span>&nbsp;<v-icon>mdi-reload</v-icon>
            </v-btn>
          </div>
        </div>
      </v-bottom-sheet>
    </template>
    <template v-slot:footer>
      <a href="#" id="downloader" style="display: none;">Download audio</a>
      <div :class="['leaveFab',!countdownrunning?'disabled':'']">
        <v-btn icon class="leavebtn" @click="leaveMe" :disabled="!countdownrunning">
          <v-icon x-small>mdi-window-close</v-icon>
        </v-btn>
      </div>
    </template>
  </fullpage-card>
</template>
<script>
import basepage from "~/mixins.js/basepage";
import CountDownItem from "~/components/countdown";
import {mapGetters} from 'vuex'

const timerMax = 5;

export default {
  name: 'ml_start',
  mixins: [basepage],
  components: {
    CountDownItem
  },
  beforeRouteLeave(to, from, next) {
    document.querySelector('.nextvm').classList.remove('pumpAnimation');
    this.$closeStream();
    next();
  },
  data() {
    return {
      audioLevels: {
        peakLevel: 0,
        averageLevel: 0
      },
      audioInput: {},
      exid: (this.$route.params.id),
      programid: (this.$route.params.fromprogram || false),
      withindex: (this.$route.params.withindex || false),
      backto: (this.$route.params.backto || false),
      "name": "ml_start",
      "deviceInfo": "",
      "hasBack": true,
      "hasNext": true,
      "timer": 0,
      "countdownrunning": false,
      "startTimer": false,
      'audio': {
        "audioContext": null,
        "audioInput": null,
        "realAudioInput": null,
        "inputPoint": null,
        "audioRecorder": null,
        "stereo": false
      },
      bottomsheet: {
        show: false
      },
      uploadProgress: 0,
      passed: false,
      hasWarning: false,
      errorMessage: "",
      loading: false,
      finish: false,
      intervals: []

    }
  },
  computed: {
    ...mapGetters({
      getExercises: 'getExercises',
      getCurrentExercise: 'getCurrentExercise',
      getAudioDevices: 'getAudioDevices'
    }),
    exercise() {
      return this.getCurrentExercise
    },

    currentUploadProgress: function () {
      const perc = (this.uploadProgress) * 100;
      if (perc > 100) {
        return 100;
      }
      return perc;
    },
    currentPercent() {
      const perc = ((this.timer / this.timerLength) * 100) * 75 / 100;
      const updPerc = this.currentUploadProgress * 25 / 100;
      const finalPerc = perc + updPerc
      if (finalPerc > 100) {
        return 100;
      }
      return finalPerc;
    },
    timerLength() {
      return timerMax
    },
    timerRest() {
      return timerMax - this.timer
    },
    getTitle() {
      let _title = this.$t(this.name + '.title')
      return _title.replace("%s", this.timer);
    }
  },
  methods: {
    exitStep() {
      if (document.querySelector('#__nuxt')) {
        document.querySelector('#__nuxt').classList.add('quit');
      }
      this.exerciseStepBack()
    },
    retryNoise() {
      this.bottomsheet.show = false;
      this.setupAll();
      return true;
    },
    leaveMe() {
      this.$refs.noisecountdown.abort();
      //Se stai registrando devi interrompere tutto.
      if (this.$capacitor.isNativePlatform()) {
        this.$nuxt.$loading.start();
        $nuxt.$airlyn.removeAllListeners();
        this.$airlyn.stopRecording().finally(() => {
          this.$nuxt.$loading.finish();
          if (document.querySelector('#__nuxt')) {
            document.querySelector('#__nuxt').classList.add('quit');
          }
          this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + ""));
        })
      } else {
        this.$closeStream();
        if (this.audio && this.audio.audioRecorder) {
          this.audio.audioRecorder.stop();
        }
        if (document.querySelector('#__nuxt')) {
          document.querySelector('#__nuxt').classList.add('quit');
        }
        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + ""));
      }

    },
    prevStep() {
      this.intervals.map((interval) => {
        try {
          clearTimeout(interval)
        } catch (e) {
        }
      })
      this.$refs.noisecountdown.abort();
      //Se stai registrando devi interrompere tutto.
      if (this.$capacitor.isNativePlatform()) {
        this.$nuxt.$loading.start();
        this.$airlyn.stopRecording().finally(() => {
          this.$nuxt.$loading.finish();
          this.$router.back();
        })
      } else {
        this.$closeStream();
        if (this.audio && this.audio.audioRecorder) {
          this.audio.audioRecorder.stop();
        }
        this.$router.back();
      }


    },
    nextStep() {
      let suffix = this.buildSuffix();
      if(suffix.length>0) {
        suffix = "/" + suffix
      }
      if (this.exercise.type === this.$exerciseManager.kindHOLD) {

        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + "/runnersilent" + suffix));
      } else {
        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + "/runner" + suffix));
      }
    },
    sendDataToRest(blob) {
      /*
            var url = (window.URL || window.webkitURL).createObjectURL(blob);
            var link = document.getElementById("downloader");
            link.href = url;
            link.download = 'output_noise.wav';
            link.click();
      */
      this.passed = false;
      this.loading = true;
      this.$nuxt.$loading.start()
      //Axios send rest API...
      const today = new Date();
      const _userID = this.$auth.user ? (this.$auth.user._id || this.$auth.user.userId) : today.getMilliseconds();
      const fileName = 'soundcheck_' + _userID + '.wav'

      const file = new File([blob], fileName, {type: 'audio/x-wav', lastModified: Date.now()})
      const params = new FormData();
      params.append('audio', file, file.name);
      params.append('device_code', this.deviceInfo)
      if (this.audioInput) {
        params.append('device_info', JSON.stringify(this.audioInput));
      }
      const headers = {
        Authorization: this.$auth.strategy.token.get(),
        timeout: this.$exerciseManager.longTaskTimeout,
        onUploadProgress: (progress) => {
          this.uploadProgress = progress.loaded / progress.total;
        }
      }
      this.$axios.$post($nuxt.$apiConstants.preNoiseCheck_v2,
        params,
        headers,
      ).then((r) => {
        console.log('noiseCheck result', r)
        this.uploadProgress = 1;
        this.passed = false;
        this.hasWarning = false;
        this.errorMessage = "";
        let errorTitle = "";
        let errorMessage = "";

        if (r && r.resultCode) {
          /*
          QUIET_STATUS_CODE = 308
          QUIET_MSG = 'Wonderful! Your recording environment sounds extremely quiet.'

          MODERATE_STATUS_CODE = 309
          MODERATE_MSG = 'Not bad! But your recording environment sounds like is becoming noisy, be careful.'

          NOISY_STATUS_CODE = 310
          NOISY_MSG = 'Too noisy! It\'s better for you to change the environment. Try also to close doors and windows.'
          Se l'analisi è andata a buon fine, altrimenti uno di questi:
          NO_SIGNAL_ERROR_CODE = 301
          NO_SIGNAL_MSG = 'No signal was detected.'

          EMPTY_FILE_ERROR_CODE = 307
          EMPTY_FILE_MSG = 'Your recording is empty! Please contact the assistance.'
           */
          if(r.resultCode>310) {
            this.passed = true;
          } else if(r.resultCode>307) {
            this.passed = true;
            this.hasWarning = true;
            this.errorMessage = r.message || this.$t('errors.noise.description');
          } else {
            this.passed = false;
            errorTitle = this.$t('errors.noise.title');
            this.errorMessage = r.message || this.$t('errors.noise.description');
          }
        } else {
          this.passed = false;
          errorTitle = this.$t('errors.noise.title');
          errorMessage = this.$t('errors.noise.description');
        }
        if (this.passed === false) {
          this.$root.$emit('showError', {
            hasretry: true,
            title: errorTitle,
            error: errorMessage,
            leaveBtn: this.$t('generic.startanyway'),
            click: () => {
              this.setupAll();
              this.$gtag('event', 'click', {
                'event_label': 'NoiseReCheck',
                'event_category': 'Exercises',
              })
              return true;
            },
            resetEvent: () => {
              this.passed = true;
              this.$gtag('event', 'click', {
                'event_label': 'NoiseStartAnyWay',
                'event_category': 'Exercises',
              })
              //this.$root.$emit('nextstep');
              this.bottomsheet.show = true;
              return true;
            }
          });
        }
      }).catch((e) => {
        console.log('noiseCheck error', e)
        console.error("Errore invio api [pre_noise_check]:", e);
        this.$analytics.logEvent("error", {
          "title":'noise check error'
        });
        this.$captureException(e);
        this.$root.$emit('showError', {
          hasretry: false,
          title: "An error has occurred",
          error: "Sorry an issue with the VoiceServer has occurred",
          click: () => {
            this.setupAll();
            this.$gtag('event', 'click', {
              'event_label': 'NoiseReCheck',
              'event_category': 'Exercises',
            })
            return true;
          },
          resetEvent: () => {
            this.passed = true;
            this.$gtag('event', 'click', {
              'event_label': 'NoiseStartAnyWay',
              'event_category': 'Exercises',
            })
            //this.$root.$emit('nextstep');
            this.bottomsheet.show = true;
            return true;
          }
        });
      }).finally(() => {
        if (this.passed) {
          //this.$root.$emit('nextstep'); > non emettere il next step.
          this.$root.$emit('disableNext', false);
          this.$nextTick(() => {
            document.querySelector('.nextvm').classList.add('pumpAnimation')
          });
        }
        this.loading = false;
        this.finish = true;
        this.$nuxt.$loading.finish();
      });
    },
    gotData(buffers) {
      console.log('got buffers');
      this.$nuxt.$loading.finish();
      this.audio.audioRecorder.exportMonoWAV((blob) => {
        this.$closeStream(); //Ferma gli stream di registrazione non servono più
        this.sendDataToRest(blob)
      });
    },
    gotDataNative(base64, mimetype) {
      console.log('ready to store file for sending...', mimetype);
      const blob = this.$base64ToBlob(base64, mimetype);
      this.sendDataToRest(blob)
    },
    stopRecording() {

      this.$nuxt.$loading.start();
      this.loading = true;
      if (this.$capacitor.isNativePlatform()) {
        console.log('request stop recording!')
        this.$airlyn.removeAllListeners();
        this.$airlyn.stopRecording().then((r) => {
          if (r && r.value) {
            this.gotDataNative(r.value.recordDataBase64, r.value.mimeType);
          } else {
            console.error('(catch)Errore stop :', e);
            this.manageMicError({"name": "Cannot retrieve Recording", error: e}, null, function () {
              this.exitStep()
              return true;
            });
          }
        }).catch((e) => {
          console.error('(catch)Errore stop :', e);
          this.manageMicError({"name": "Cannot retrieve Recording", error: e}, null, function () {
            this.exitStep()
            return true;
          });
        }).finally(() => {
          this.$nuxt.$loading.finish();
        })
      } else {
        console.log('request stop web')
        this.audio.audioRecorder.stop();
        console.log('retrieve buffers')
        this.audio.audioRecorder.getBuffers(this.gotData);
      }
    },
    timerChange(progress) {
      this.timer = this.timerLength - progress.totalSeconds;
    },
    timerEnd() {
      console.log('timer finito, ', this.timer);
      this.countdownrunning = false;
      this.loading = true;
      this.stopRecording();
    },
    countDownTimer() {
      if (this.countdownrunning === false) {
        this.intervals.push(setTimeout(() => {
          this.$nextTick(() => {
            console.log('avvia tutto');
            this.countdownrunning = true;
            console.log(this.$refs);
            this.$refs.noisecountdown.restart();
          });
        }, 1000));
        return;
      }
    },
    initCountDown() {
      this.timer = 0;
      this.uploadProgress = 0;
      this.countdownrunning = false;
      this.startTimer = true;
      this.audio.audioRecorder.clear();
      this.audio.audioRecorder.record();
      this.countDownTimer();
    },
    initCountDownNative() {
      this.timer = 0;
      this.uploadProgress = 0;
      this.countdownrunning = false;
      this.startTimer = true;
      $nuxt.$airlyn.addListener('airlynUpdateMeters', (info) => {
//console.log('got meters',/*info.peakPowers, */ $nuxt.$normalizeLevels(info.peakPowers));
        //console.log('got meters', info);
        if (info) {
          if (info.peakPower) {
            this.audioLevels.peakLevel = info.peakPower
          }
          if (info.averagePower) {
            this.audioLevels.averageLevel = info.averagePower
          }
        }

      });
      $nuxt.$airlyn.addListener('airlynUpdateMic', (info) => {
        console.log('got mic INFO', info);
        this.audioInput = info;
      });

      this.$airlyn.startRecording({useAGC: true}).then((r) => {
        console.log('start recording...', r);
        if (r && r.value === true) {
          this.countDownTimer();
        } else {
          console.error('(then)Errore start :', r);
          this.manageMicError({"name": "Cannot start Recording"}, null, function () {
            this.exitStep()
            return true;
          });
        }
      }).catch((e) => {
        console.error('(catch)Errore start :', e);
        this.manageMicError({"name": "Cannot start Recording", error: e}, null, function () {
          this.exitStep()
          return true;
        });
      });

    },
    initMicrophone(stream) {
      this.audio.inputPoint = this.audio.audioContext.createGain();
      this.audio.realAudioInput = this.audio.audioContext.createMediaStreamSource(stream);
      this.audio.audioInput = this.audio.realAudioInput;
      this.audio.audioInput.connect(this.audio.inputPoint);
      this.audio.realAudioInput.disconnect();
      this.audio.audioInput = this.convertToMono(this.audio.realAudioInput);
      this.audio.audioInput.connect(this.audio.inputPoint);
      this.audio.audioRecorder = new this.$Recorder(this.audio.inputPoint, {worker: this.$worker.createRecorderWorker()});

      /*
      this.audio.audioRecorder.clear();
      this.audio.audioRecorder.record();
      */
      this.initCountDown()
    },
    convertToMono(input) {
      var splitter = this.audio.audioContext.createChannelSplitter(2);
      var merger = this.audio.audioContext.createChannelMerger(2);
      input.connect(splitter);
      splitter.connect(merger, 0, 0);
      splitter.connect(merger, 0, 1);
      return merger;
    },
    setupAll() {
      this.loading = false;
      this.finish = false;
      this.$closeStream();
      if (this.$capacitor.isNativePlatform()) {
        this.timer = 0
        this.countdownrunning = false;
        this.initCountDownNative();
      } else {
        let message = [];
        console.log(JSON.stringify(this.getAudioDevices));
        console.log(navigator.mediaDevices.getSupportedConstraints());
        message.push("Ready to record Audio");
        message.push(JSON.stringify(this.getAudioDevices));
        message.push("Supported Constraints:");
        message.push(JSON.stringify(navigator.mediaDevices.getSupportedConstraints()));
        if (null == this.audio.audioContext) {
          this.audio.audioContext = new AudioContext();
        }
        this.$captureMessage(message.join("\n "));
        //Debug mode - enumerate device and store info on Sentry:
        this.$enumerateMediaDevices().then((mediaDevices) => {
          console.log('got devices', mediaDevices);
          return this.$initAudio(mediaDevices).then((stream) => {
            console.log(stream);
            window.stream = stream;
            if (null == this.audio.audioContext) {
              this.audio.audioContext = new AudioContext();
            }
            this.timer = 0
            this.countdownrunning = false;
            this.initMicrophone(stream)
          });
        }).catch((e) => {
          console.error('errore init microfono non gestito', e);
          this.$captureException(e);
          this.manageMicError(e, null, function () {
            this.exitStep()
            return true;
          });

        })
      }
    }
  },
  mounted() {
    this.$root.$emit('showPager', {"show": true});
    this.$deviceInfo.getInfo().then((r) => {
      this.deviceInfo = r;
      this.$exerciseManager.setDeviceCode(r);
    });
    if (this.$capacitor.isNativePlatform()) {
      this.$closeStream();
      this.$airlyn.checkMicPerm().then((r) => {
        console.log('Permessi al microfono garantiti?', r, JSON.stringify(r));
        if (r && r.result === true) {
          console.log('permessi OK!');
        } else {
          const e = {
            "name": "NotAllowedError",
            exception: r
          }
          this.manageMicError(e, null, function () {
            this.exitStep()
            return true;
          });
        }
      }).catch((e) => {
        console.error("Permission request fails", e)
        this.manageMicError({
          "name": "NotAllowedError",
          exception: e
        }, null, function () {
          this.exitStep()
          return true;
        });
      });
    }
    this.$nextTick(() => {
      this.$root.$emit('showPager', {"show": true});
      this.$root.$emit('setNextText', this.$t('generic.start_chevron'));
      this.$root.$emit('disableNext', true);
    })
    this.intervals.push(setTimeout(() => {
      this.$nextTick(() => {
        this.setupAll();
      });
    }, 700));
  }
}
</script>
