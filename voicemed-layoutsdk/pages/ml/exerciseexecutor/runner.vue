<template>
  <fullpage-card class="runner exercisecc exerciseRecording " :hidefooter="true">
    <template v-slot:header>
      <v-row class="navigation" align-content="center" justify="space-between">
        <v-btn icon @click="leaveMe">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <div class="exercise__title" v-if="getCurrentExercise">
          <span v-html="getCurrentExercise.title"></span>
        </div>
        <div v-if="!finish&&currentExercise&&delay===false" class="sideBtn">
          <inputmicrophone
              :average="average"
              :amplitude="amplitude"></inputmicrophone>
        </div>
        <v-btn icon @click="leaveMe" v-else style="opacity: 0;">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-row>
      <div v-if="!finish&&delay===false" :class="['exerciseSpecs animated faded',(getCurrentExercise.subtype && getCurrentExercise.subtype=='dob')?'voice':'']">
        <v-img v-if="currentExercise.thumb" :src="currentExercise.thumb" width="20vw" contain></v-img>
        <p v-if="getCurrentExercise.subtype && getCurrentExercise.subtype=='dob'">{{currentExercise.title}}</p>
      </div>
      <div class="text-center mintwoRows" v-if="preload">
        <div class="fakeTitles text-center" v-for="ex in exercises">
          <span>{{ ex.title }}</span>
          <p class="exerciseSecText">{{ ex.description }}</p>
        </div>
      </div>
    </template>
    <template v-slot:body>
      <div :class="['exercises__container animated faded',getCurrentExercise.type]"
           v-if="currentExercise.pause===false">
        <div class="exercise_delay_info" v-if="delay" :key="delayTime">
          <div class="timer text-center">
            <p v-html="$t('generic.exercisestart')"></p>
            <p class="timer__numbers">{{ Math.ceil(delayTime / 1000) }}</p>
          </div>
        </div>
        <transition name="fade">
          <div v-if="getCurrentExercise.subtype==='dob'&&currentExercise.pause===false&&!finish&&delay===false" class="voicepickerContainer">
              <inputmicrophonebig
                  :average="average"
                  :amplitude="amplitude"></inputmicrophonebig>
          </div>
        </transition>
        <exerciseanimationprogress
            :key="delay"
            v-if="(finish||currentExercise)&&delay===false&&(finish==false&&getCurrentExercise.subtype!=='dob')"
            v-model="current"
            :exerciseSteps="(finish?0:getCurrentExercise.cycles)"
            :startPercent="0"
            :maxPercent="0"
            :class="currentExercise.animationType+' '+(finish?'finished':'')"
            doneClass="doneNone"
            :runningPercent="(finish?currentUploadProgress:currentPercent)">
          <template v-slot:inside>
            <div class="breath_item" v-if="!finish"></div>
            <div class="action" v-if="currentExercise">
              <transition mode="out-in" name="exittop">
                <div v-if="!finish" :key="current">
                  {{ currentExercise.title || "" }}
                </div>
                <div v-else v-html="$t('ml_exercise.almostdone')">
                </div>
              </transition>
            </div>
          </template>
        </exerciseanimationprogress>

        <div :class="['timer text-center animated',finish?'faded':'']" v-if="delay===false&&getCurrentExercise.subtype!=='dob'">
          <v-progress-linear v-model="overallProgress"></v-progress-linear>
          <small>
            <template v-if="getCurrentExercise.cycles>1">{{ currentExercise.iteration }} of {{
                getCurrentExercise.cycles
              }}&nbsp;|&nbsp;
            </template>
            {{ overallRemainingString }}
          </small>
        </div>
        <div :class="['timer text-center animated type-voice',finish?'faded':'']" v-if="delay===false&&getCurrentExercise.subtype==='dob'">
          <small>{{convertMsHHMMSS($refs.stepcountdown.getElapsed())}}</small>
        </div>
        <div style="display:none;">
          <b>Debug</b><br/>
          <p>Peak dB:<b>{{ audioLevels.peakLevel }}</b></p>
          <p>Average dB:<b>{{ audioLevels.averageLevel }}</b></p>
        </div>
      </div>
      <div v-else :class="['exercises__waiting animated',(currentRemaining% 2 === 1?'odd':'even')]">
        <small v-html="$t('generic.startagain')"></small>
        {{ currentRemaining }}
      </div>

      <transition name="fade">
        <div v-if="getCurrentExercise.subtype==='dob'&&currentExercise.pause===false&&delay===false" class="holdcontainer voice">
          <v-btn @click="holdEnd" class="nextvm">
            <v-icon>mdi-square</v-icon>
          </v-btn>
          <p>{{ $t('ml_exercise.voice.stop_hold_phase_cta') }}</p>
        </div>
      </transition>

      <a href="#" id="downloader" style="display: none;">Download audio</a>
      <CountDownItem
          :timerLength="delay===true?delayBreathTime:((getExercisePhaseDuration(true))+5)"
          :interval="interval"
          ref="stepcountdown"
          @progress="timerChange"
          @end="timerEnd">
      </CountDownItem>

      <infodialog v-if="getCurrentExercise"
                  :show="about.show"
                  contentclasses="infoContent"
                  @close="closeInfo"
                  :title="getCurrentExercise.title"
                  :description="getCurrentExercise.about||''"
                  :infoImage="getCurrentExercise.aboutImage||getCurrentExercise.thumbnail">
        <template v-slot:closebtn>{{ $t('generic.alright') }}</template>
      </infodialog>

      <completitionfailed :show="showError" :tries="errorTries" @retry="completeRetry"
                          @blobdownload="downloadLastRecord"
                          @close="showError=false"></completitionfailed>
    </template>
  </fullpage-card>
</template>
<style>
.sine_merger {
  background-image: url('~/assets/images/sine.svg');
}
</style>
<script>
import basepage from "~/mixins.js/basepage";
import CountDownItem from "~/components/countdown";
import {mapActions, mapGetters} from 'vuex'

const breathInDelay = 3000;

const titleFromCenter = {
  targets: "#exerciseTitle",
  translateY: ['+200%', '0%'],
  opacity: [0, 1],
  easing: 'easeInOutQuad',
  duration: 500
};
const titleExit = {
  targets: "#exerciseTitle",
  opacity: [1, 0],
  easing: 'easeInOutQuad',
  duration: 100
};

export default {
  name: 'ml_exercise',
  mixins: [basepage],
  components: {
    CountDownItem
  },
  beforeRouteLeave(to, from, next) {
    this.$closeStream();
    next();
  },
  data() {
    return {
      audioLevels: {
        peakLevel: 0,
        averageLevel: 0
      },
      showError: false,
      errorTries: 0,
      amplitude: 0,
      average: 0,
      audioInput: {},
      intervals: [],
      delay: true,
      delayTime: 0,
      preload: true,
      exid: (this.$route.params.id),
      programid: (this.$route.params.fromprogram || false),
      withindex: (this.$route.params.withindex || false),
      backto: (this.$route.params.backto || false),
      "name": "ml_exercise",
      "hasBack": true,
      "hasNext": false,
      "current": -1,
      "realCurrent": -1,
      "timer": 0,
      "startCountdown": 3,
      "finish": false,
      "uploadProgress": 0,
      "currentTime": 0,
      "currentRemaining": 0,
      "overallRemaining": 0,
      "currentProgress": 0,
      currentExerciseTime: 0,
      "overallProgress": 0,
      "totalRunningTime": 0,
      "timeStart": 0,
      "timeEnd": 0,
      "timePauseStart": 0,
      "timePauseGap": 0,
      "estimatedDuration": 0,
      'audio': {
        "audioContext": null,
        "audioInput": null,
        "realAudioInput": null,
        "inputPoint": null,
        "audioRecorder": null,
        "stereo": false
      },
      sendHistory: {
        blob: null,
        summary: null,
      },
      'cycle': {
        current: -1,
        duration: 0,
        elapsed: 0,
      },
      'recordingPhasesDuration': {},
      'interval': 250,
      about: {
        show: false
      },
    }
  },
  computed: {
    ...mapGetters({
      getExercises: 'getExercises',
      getCurrentExercise: 'getCurrentExercise',
      isCurrentUserGuest: 'isCurrentUserGuest'
    }),
    delayBreathTime() {
      return breathInDelay
    },
    exercise() {
      return this.getCurrentExercise
    },
    exercises() {
      if (this.exercise) {
        return this.exercise.exercises;
      }
      return [];
    },
    computedDuration() {
      if (this.getCurrentExercise && Array.isArray(this.getCurrentExercise.exercises)) {
        return this.getCurrentExercise.exercises.reduce((carry, exe) => {
          return 0 + (exe.duration || 0);
        }, 0);
      }
      return false;
    },
    /*
    estimatedDuration() {
      if (this.getCurrentExercise && this.getCurrentExercise.duration) {
        return this.getCurrentExercise.duration;
      }
      if (this.getCurrentExercise && Array.isArray(this.getCurrentExercise.exercises)) {
        return this.computedDuration;
      }
      return false
    },
    */
    exercisescount: function () {
      if (this.exercise) {
        return this.exercise.exercises.length;
      }
      return 0;
    },
    exercisescountReal: function () {
      if (this.exercise) {
        return this.exercise.exercises.filter((e) => e.pause === false).length;
      }
      return 0;
    },
    currentExercise: function () {
      if (this.current >= 0 && this.current < this.exercisescount) {
        return this.exercise.exercises[this.current];
      }
      if (this.exercisescount > 0) {
        return this.exercise.exercises[0];
      }
      return false;
    },
    nextExercise: function () {
      if ((this.current + 1) >= 0 && (this.current + 1) < this.exercisescount) {
        return this.exercise.exercises[this.current + 1];
      }
      return false;
    },
    timestring: function () {
      return new Date(this.totalRunningTime).toISOString().substr(14, 5)
    },
    remainingString: function () {
      const _ret = (this.estimatedDuration * 1000) - this.totalRunningTime;
      return "-" + new Date(_ret).toISOString().substr(14, 5)
    },
    overallRemainingString: function () {
      const _ret = (this.totalTimeMs) - (this.totalRunningTime + this.currentExerciseTime);
      return "-" + new Date(_ret).toISOString().substr(14, 5)
    },
    currentPercent: function () {
      /* CurrentCycle version */
      if (this.cycle.duration <= 0) {
        return 0;
      }
      if (this.cycle.elapsed + this.currentExerciseTime <= 0) {
        return 0;
      }
      const perc = (this.cycle.elapsed + this.currentExerciseTime) / this.cycle.duration * 100;
      if (perc > 100) {
        return 100;
      }
      return perc;
    },
    /* Single exercise time
    currentPercent: function () {
      if (this.current < 0) {
        return 0;
      }
      if (this.currentExerciseTime <= 0) {
        return 0;
      }
      const perc = this.currentExerciseTime / this.currentExercise.durationMs * 100;
      if (perc > 100) {
        return 100;
      }
      return perc;
    },
    */
    currentUploadProgress: function () {
      const perc = (this.uploadProgress) * 100;
      if (perc > 100) {
        return 100;
      }
      return perc;
    },
    totalTime: function () {
      return this.exercises.reduce(function (carry, item) {
        return carry + item.duration;
      }, 0);
    },
    totalTimeMs: function () {
      return this.exercises.reduce(function (carry, item) {
        return carry + ((item.duration > 0 ? item.duration : 0) * 1000);
      }, 0);
    }
  },
  watch: {
    'current': function () {
      if (this.current >= 0) {
        //console.log('check cycle', this.cycle);
        const currentCycle = this.cycle.current;
        if (currentCycle !== this.currentExercise.iteration) {
          //console.log('new cycle', currentCycle);
          this.cycle.current = this.currentExercise.iteration;
          this.cycle.elapsed = 0;
          this.cycle.duration = this.getCurrentExercise.exercises.reduce((carry, exe) => {
            if (exe.iteration === this.cycle.current) {
              return carry + exe.durationMs;
            }
            return carry;
          }, 0);
          //console.log('cycle inited', this.cycle)
        }
      }
    }
  },
  methods: {
    ...mapActions({
      addDoneExercise: 'addDoneExercise',
      updateExercise: 'updateExercise'
    }),
    holdEnd() {
      //console.log('finish hold');
      //this.$refs.stepcountdown.end();
      this.$refs.stepcountdown.abort();
      this.currentProgress = 0;
      this.currentTime = 0;
      this.totalRunningTime += this.currentExercise.durationMs; //Aggiungi la dimensione dell'esercizio alla somma;
      this.cycle.elapsed += this.currentExercise.durationMs;
      //this.$anime.remove('#exerciseTitle');
      this.recordingPhasesDuration[this.current] = new Date().getTime() - this.recordingPhasesDuration[this.current];
      //console.log('END EXERCISE check seconds: ', new Date().getTime() / 1000, this.recordingPhasesDuration[this.current]);
      this.current++;
      this.currentExerciseTime = 0;
      if (this.currentExercise.pause === false) {
        this.realCurrent++;
      }

      this.currentRemaining = this.getExercisePhaseDuration(false);

      [...document.querySelectorAll('.faded')].forEach((item) => {
        item.classList.remove('faded');
      });
      if (this.current < this.exercisescount) {
        requestAnimationFrame(() => {
          this.manageExercise();
        })
      } else {
        this.uploadProgress = 0;
        this.finish = true;
        this.finishExercise();
      }

    },
    convertMsHHMMSS(val) {
      let hhmmss = new Date(val).toISOString().substr(11, 8)
      return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss
    },
    timerChange(progress) {

      const exDurationMs = this.getExercisePhaseDuration(true);
      const exDuration = this.getExercisePhaseDuration(false);

      if (this.delay === true) {
        this.delayTime -= progress.interval;

        if ((progress.elapsed + progress.interval) > exDurationMs) {
          //console.log('Durata esercizio corrente > di duration', this.currentTime, this.currentExercise.durationMs);
          //Invoke timer End?
          this.$forceNextTick(() => {
            this.$refs.stepcountdown.end();
          });
        }

        return
      }
      this.currentExerciseTime += progress.interval;
      /*console.log('check seconds: ', new Date().getTime() / 1000,
        this.currentExercise.durationMs,
        progress.totalMilliseconds,
        progress.elapsed,
        this.totalRunningTime,
        this.currentExerciseTime
      );
       */
      this.currentProgress = 100 - (progress.totalSeconds / exDuration * 100);
      this.currentRemaining = progress.totalSeconds;
      this.currentTime = (exDurationMs) - progress.totalMilliseconds; //Compute difference in ms since start
      if (this.currentExercise.pause === false) {
        //this.totalRunningTime += progress.interval; //sum interval step
        const _percent = ((this.totalRunningTime + this.currentExerciseTime) / this.totalTimeMs * 100);
        this.overallProgress = _percent > 100 ? 100 : _percent;
      }
      if ((progress.elapsed + progress.interval) > exDurationMs) {
        //console.log('Durata esercizio corrente > di duration', this.currentTime, this.currentExercise.durationMs);
        //Invoke timer End?
        this.$forceNextTick(() => {
          this.$refs.stepcountdown.end();
        });
      }
    },
    finishDelay() {
      this.$refs.stepcountdown.end();
      this.$anime({
        targets: '.exercise_delay_info',
        opacity: [1, 0],
        duration: 500,
        delay: 250,
        easing: 'easeInOutQuad',
        complete: () => {
          this.delay = false;
          this.$nextTick(() => {
            this.startRealExercise();
          });
        }
      });
    },
    timerEnd(enddata) {
      if (this.delay === true) {
        this.delayTime -= enddata.interval;
        this.$forceNextTick(() => {
          this.finishDelay();
        })
        return;
      }
      //console.log('check seconds: ', new Date().getTime() / 1000);
      this.currentProgress = 0;
      this.currentTime = 0;
      this.totalRunningTime += this.currentExercise.durationMs; //Aggiungi la dimensione dell'esercizio alla somma;
      this.cycle.elapsed += this.currentExercise.durationMs;
      //this.$anime.remove('#exerciseTitle');
      this.recordingPhasesDuration[this.current] = new Date().getTime() - this.recordingPhasesDuration[this.current];
      //console.log('END EXERCISE check seconds: ', new Date().getTime() / 1000, this.recordingPhasesDuration[this.current]);
      this.current++;
      this.currentExerciseTime = 0;
      if (this.currentExercise.pause === false) {
        this.realCurrent++;
      }

      this.currentRemaining = this.getExercisePhaseDuration(false);

      [...document.querySelectorAll('.faded')].forEach((item) => {
        item.classList.remove('faded');
      });
      if (this.current < this.exercisescount) {
        requestAnimationFrame(() => {
          this.manageExercise();
        })
      } else {
        this.uploadProgress = 0;
        this.finish = true;
        this.finishExercise();
      }
    },
    leaveMe() {
      this.intervals.map((interval) => {
        try {
          clearTimeout(interval)
        } catch (e) {
        }
      });

      this.$analytics.logEvent('exercise_quit', {
        "id": this.getCurrentExercise.id,
        "name": this.getCurrentExercise.title,
        "program_id": this.getCurrentExercise.program_id || null,
        "type": this.getCurrentExercise.type,
      })
      this.$refs.stepcountdown.abort();
      //Se stai registrando devi interrompere tutto.
      if (this.$capacitor.isNativePlatform()) {
        this.$nuxt.$loading.start();

        $nuxt.$airlyn.removeAllListeners();
        this.$airlyn.stopRecording().finally(() => {
          this.$nuxt.$loading.finish();
          this.$gtag('event', 'click', {
            'event_label': 'StopRecording',
            'event_category': 'Exercises',
            'non_interaction': true
          })
          if (document.querySelector('#__nuxt')) {
            document.querySelector('#__nuxt').classList.add('quit');
          }
          this.exerciseStepBack()
        })
      } else {
        this.$closeStream();
        if (this.audio && this.audio.audioRecorder) {
          this.audio.audioRecorder.stop();
        }
        this.$gtag('event', 'click', {
          'event_label': 'StopRecording',
          'event_category': 'Exercises',
          'non_interaction': true
        })
        if (document.querySelector('#__nuxt')) {
          document.querySelector('#__nuxt').classList.add('quit');
        }
        this.exerciseStepBack()
      }


    },
    getRotation(index) {
      if (index === 0) {
        return "transform:rotate(0deg);";
      }
      //Get deg for position
      const angles = 360 / (this.exercisescount) * (index);
      return "transform:rotate(" + angles + "deg);";
    },
    imageError() {
      this.phasebutton.phaseimage = require("~/assets/images/errorlogo.png");
    },
    prevStep() {

      if (this.about.show) {
        this.closeInfo();
        return;
      }

      this.intervals.map((interval) => {
        try {
          clearTimeout(interval)
        } catch (e) {
        }
      });

      this.$refs.stepcountdown.abort();
      //Se stai registrando devi interrompere tutto.
      if (this.$capacitor.isNativePlatform()) {
        this.$nuxt.$loading.start();
        this.$airlyn.stopRecording().finally(() => {
          this.$nuxt.$loading.finish();
          this.$router.back();
          this.$gtag('event', 'click', {
            'event_label': 'StopRecording',
            'event_category': 'Exercises',
            'non_interaction': true
          })
        })
      } else {
        this.$closeStream();
        if (this.audio && this.audio.audioRecorder) {
          this.audio.audioRecorder.stop();
        }
        this.$router.back();
        this.$gtag('event', 'click', {
          'event_label': 'StopRecording',
          'event_category': 'Exercises',
          'non_interaction': true
        })
      }


    },
    nextStep() {
      this.$root.$emit('showPager', {"show": false});
      let suffix = this.buildSuffix();
      if (suffix.length > 0) {
        suffix = "/" + suffix
      }
      this.$router.push($nuxt.localePath("/ml/greetings/" + this.exid + suffix));
    },
    finishExercise() {
      this.timeEnd = new Date().getTime();
      this.$anime.remove('.breath_item');
      if (document.querySelector("div.breath_item")) {
        document.querySelector("div.breath_item").classList.remove('animating');
      }
      //Stop recording
      this.stopRecording();
      this.$nextTick(() => {
        const mergeAnimation = Object.assign({
          targets: '.breath_item',
          loop: false,
          /*easing: 'easeInOutQuad',*/
          duration: 3000,
          begin: function () {
            if (document.querySelector("div.breath_item")) {
              document.querySelector("div.breath_item").classList.add('animating');
            }
          },
          complete: function () {
            if (document.querySelector("div.breath_item")) {
              document.querySelector("div.breath_item").classList.remove('animating');
            }
          }
        }, this.$animationHelper.pulse);
        this.$anime(mergeAnimation);
      });
    },
    completeError() {
      this.showError = true;
      this.$nextTick(() => {
        setTimeout(() => {
          console.log('Error downloader show');
          var link = document.getElementById("error_downloader");
          /*
          var url = (window.URL || window.webkitURL).createObjectURL(this.sendHistory.blob);
          link.href = url;
          link.download = 'output_exercise.wav';
           */
          if (link) {
            link.classList.remove("hidden");
          }
        }, 500);
      })
    },
    downloadLastRecord() {
      console.log('retry request download last blob....');
      //this.$root.$emit('showToast', this.$t('generic.registrationstoredindocuments'), 'success');
      try {
        const now = this.$exerciseManager.formatDateYmd(new Date());
        const fileName = 'recording_' + now + '.wav';
        this.$writePublicBlob(this.sendHistory.blob, fileName).then((r) => {
          console.warn("RES di download", r);
          this.$root.$emit('showToast', this.$t('generic.registrationstoredindocuments', {"file": fileName}), 'success');
        }).catch((e) => {
          console.error("Errore di download", e);
          this.$root.$emit('showToast', this.$t('generic.registrationstoredindocuments_error'), 'error');
        })
        console.log('download sent to instance');
      } catch (e) {
        console.error("Errore di download", e);
        this.$root.$emit('showToast', this.$t('generic.registrationstoredindocuments_error'), 'error');
      }
    },
    completeRetry() {
      this.errorTries += 1;
      this.showError = false;
      this.sendRecord(this.sendHistory.blob, this.sendHistory.summary);
    },
    sendRecord(blob, exerciseSummary) {
      this.sendHistory.blob = blob;
      this.sendHistory.summary = exerciseSummary;
      /*
       this.completeError();
       return;

             var url = (window.URL || window.webkitURL).createObjectURL(blob);
             var link = document.getElementById("downloader");
             link.href = url;
             link.download = 'output_exercise.wav';
             link.click();
      */
      this.uploadProgress = 0;
      //console.log('start sendRecord');
      this.loading = true;
      const today = new Date();
      const _userID = this.$auth.user ? (this.$auth.user._id || this.$auth.user.userId) : today.getMilliseconds();
      let passed = false;
      const fileName = this.exid + '_recording_' + _userID + '.wav';
      const file = new File([blob], fileName, {type: 'audio/x-wav', lastModified: Date.now()})
      this.$exerciseManager.completeExercise(
          this.getCurrentExercise,
          (progress) => {
            this.uploadProgress = (progress.loaded / progress.total) - 0.05;
          },
          file,
          (typeof exerciseSummary !== 'undefined' ? exerciseSummary : {})
      ).then((r) => {
        this.uploadProgress = 1;
        if (r.exercise && r.response && r.exercise.completed) {
          passed = true;
        } else {
          passed = $nuxt.$t("errors.global.msg_restapi");
        }
        //console.log('got record result', r);
      }).catch((e) => {
        console.error("Errore invio api [breathing_exercises]:", e);
        this.$analytics.logEvent("error", {
          "title": 'cannot send exercise'
        });
        this.$captureException(e);
        passed = $nuxt.$t("errors.global.title");
      }).finally(() => {

        if (passed === true) {
          if (this.isCurrentUserGuest) {
            this.addDoneExercise(1);
          }
          this.nextStep();
        } else {
          //Show Error?
          this.completeError();
          return;
          /*
          this.$root.$emit('showError', {
            hasretry: true,
            title: $nuxt.$t("errors.global.uhoh"),
            error: passed,
            click: () => {
              this.startExercises();
              return true;
            },
            resetEvent: function () {
              $nuxt.$router.replace("/user/today");
              return true;
            }
          });
          */
        }
      });
    },
    sendRecordOld(blob) {
      this.uploadProgress = 0;
      new Promise((resolve, reject) => {
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = document.getElementById("downloader");
        link.href = url;
        link.download = 'output_exercise.wav';
        link.click();

        this.intervals.push(setTimeout(() => {
          this.uploadProgress = 100;
          resolve();
        }, 8000))

      }).then(() => {
        //console.log('wrapped!');
        this.nextStep();
      }).catch((e) => {
        //show error in base al valore di E....
        //console.log('Fake finishe exercise error', e);
        this.$captureException(e);
      });
    },
    gotData(buffers) {
      this.audio.audioRecorder.exportMonoWAV((blob) => {
        this.$closeStream(); //Ferma gli stream di registrazione non servono più
        let exerciseValue = {
          exerciseStarts: this.timeStart / 1000,
          exerciseEnds: this.timeEnd / 1000,
          pauseTime: this.timePauseGap > 0 ? this.timePauseGap / 1000 : 0,
          totalComputedDuration: (this.timeEnd - this.timeStart) / 1000,
          estimatedDuration: this.estimatedDuration,
          /*apiDuration: this.getCurrentExercise.duration,*/
          clientPhases: this.recordingPhasesDuration,
          waveMime: "audio/wav",
          waveDuration: -1
        }
        this.sendRecord(blob, exerciseValue)
      });
    },
    closeInfo() {
      this.about.show = false;
      this.resumeRecording().then((r) => {
        this.$refs.stepcountdown.start();
        const elapsedTime = new Date().getTime() - this.timePauseStart;
        this.timePauseGap += elapsedTime;
        console.log('countdown resumed total Pause: ', this.timePauseGap);
      }).catch((e) => {
        this.$airlyn.stopRecording().then((r) => {
          console.log('azzera registrazione', r);
        }).catch((e) => {
          console.log('errore azzera registrazione', e);
        })
        console.log('non riesco a ripristinare esercizio...');
        this.$root.$emit('showError', {
          hasretry: true,
          title: $nuxt.$t("errors.global.uhoh"),
          error: $nuxt.$t("errors.global.msg_storeexercise"),
          click: () => {
            this.startExercises();
            return true;
          },
          resetEvent: function () {
            this.exerciseStepBack()
            return true;
          }
        });
      })
    },
    openInfoDialog() {
      return;
      //Verifica se siamo in registrazione:
      if (this.$capacitor.isNativePlatform()) {
        this.$airlyn.getCurrentStatus().then((r) => {
          console.log('got recording status', r);
          if (r && r.status === 0) {
            this.pauseRecording().then((r) => {
              this.$refs.stepcountdown.pause();
              this.timePauseStart = new Date().getTime();
              console.log('countdown paused');
              this.about.show = true;
            }).catch((e) => {
              console.log('non riesco a mettere in pausa...');
              alert('Cannot open info while exercise is running');
            })
          }
        }).catch((e) => {
          console.error("Cannot get status", e);
        });
      } else {
        alert('Cannot open info while exercise is running');
      }
    },
    pauseRecording() {
      return new Promise((resolve, reject) => {
        if (this.$capacitor.isNativePlatform()) {
          this.$airlyn.pauseRecording().then((r) => {
            if (r && r.value === true) {
              resolve(true);

            } else {
              reject(false)
            }
          }).catch((e) => {
            console.error("Cannot pause, ", e);
            reject(false)
          });
        }
      })
    },
    resumeRecording() {
      return new Promise((resolve, reject) => {
        if (this.$capacitor.isNativePlatform()) {
          this.$airlyn.resumeRecording().then((r) => {
            if (r && r.value === true) {
              resolve(true);
            } else {
              reject(false)
            }
          }).catch((e) => {
            console.error("Cannot resume, ", e);
            reject(false)
          });
        }
      })
    },
    stopRecording() {
      this.$gtag('event', 'click', {
        'event_label': 'FinishRecording',
        'event_category': 'Exercises',
        'non_interaction': true
      });
      Object.keys(this.recordingPhasesDuration).map((v) => {
        this.recordingPhasesDuration[v] = this.recordingPhasesDuration[v] > 0 ? this.recordingPhasesDuration[v] / 1000 : 0;
      });
      let exerciseValue = {
        exerciseStarts: this.timeStart / 1000,
        exerciseEnds: this.timeEnd / 1000,
        pauseTime: this.timePauseGap > 0 ? this.timePauseGap / 1000 : 0,
        totalComputedDuration: (this.timeEnd - this.timeStart) / 1000,
        estimatedDuration: this.estimatedDuration,
        /*apiDuration: this.getCurrentExercise.duration,*/
        clientPhases: this.recordingPhasesDuration
      }
      if (this.$capacitor.isNativePlatform()) {
        this.$airlyn.removeAllListeners();
        this.$airlyn.stopRecording().then((r) => {
          if (r && r.value) {
            exerciseValue.waveDuration = r.value.msDuration > 0 ? r.value.msDuration / 1000 : 0;
            exerciseValue.waveMime = r.value.mimeType;
            //console.log('ready to store file for sending...', r.value.mimeType, exerciseValue);
            const blob = this.$base64ToBlob(r.value.recordDataBase64, r.value.mimeType);
            this.sendRecord(blob, exerciseValue)
          } else {
            console.error('(catch)Errore stop :', e);
            this.manageMicError({"name": $nuxt.$t("errors.global.msg_retrieverecording"), error: e}, null, function () {
              this.exerciseStepBack()
              return true;
            });
          }
        }).catch((e) => {
          console.error('(catch)Errore stop :', e);
          this.manageMicError({"name": $nuxt.$t("errors.global.msg_retrieverecording"), error: e}, null, function () {
            this.exerciseStepBack()
            return true;
          });
        })
      } else {
        this.audio.audioRecorder.stop();
        this.audio.audioRecorder.getBuffers(this.gotData);
      }
    },
    getExercisePhaseDuration(isMs = false) {
      //console.log('richiesto max duration',this.getCurrentExercise,this.currentExercise);
      if(!this.getCurrentExercise) {
        return 0;
      }
      if (this.getCurrentExercise.subtype === 'dob'&& this.currentExercise) {
        return Math.min(this.currentExercise.maxSetDuration, 120) * (isMs ? 1000 : 1);
      }
      if(!this.currentExercise) {
        return 0;
      }
      if (isMs) {
        return this.currentExercise.durationMs;
      }
      return this.currentExercise.duration;
    },
    manageExercise() {
      //console.log('init exercise', this.current);

      this.$anime.remove('.breath_item');
      if (document.querySelector("div.breath_item")) {
        document.querySelector("div.breath_item").classList.remove('animating');
      }
      this.recordingPhasesDuration[this.current] = new Date().getTime();
      if (this.current >= 0) {
        this.estimatedDuration += this.getExercisePhaseDuration(false);
        //console.log('ready to start new Exercise', new Date().getTime() / 1000, this.currentExercise.durationMs, this.currentExercise.animationType);
        this.$refs.stepcountdown.restart();
        let currentExDuration = this.getExercisePhaseDuration(true);
        if (this.nextExercise) {
          if (this.nextExercise.animationType == 'hold') {
            currentExDuration += this.nextExercise.durationMs
          }
        }
        const mergeAnimation = Object.assign({
          targets: '.breath_item',
          loop: false,
          easing: 'easeOutSine',
          duration: (currentExDuration) - 50,
          begin: function () {
            if (document.querySelector("div.breath_item")) {
              document.querySelector("div.breath_item").classList.add('animating');
            }
          },
          complete: function () {
            if (document.querySelector("div.breath_item")) {
              document.querySelector("div.breath_item").classList.remove('animating');
            }
          }
        }, this.currentExercise.animation)


        if (this.currentExercise.pause === false) {
          requestAnimationFrame(() => {
            this.$anime(mergeAnimation);
          })
        }

      }
    },
    startTimer() {
      this.intervals.push(setTimeout(() => {
        this.timer++;
        if (this.finish === false) {
          this.startTimer();
        }
      }, 1000));
    },

    startExercises() {
      this.$analytics.logEvent('exercise_begin_recording', {
        "id": this.getCurrentExercise.id,
        "name": this.getCurrentExercise.title,
        "program_id": this.getCurrentExercise.program_id || null,
        "type": this.getCurrentExercise.type,
      })
      this.$analytics.setScreenName(this.getCurrentExercise.title + " " + this.getCurrentExercise.type + " page");
      this.$gtag('event', 'click', {
        'event_label': 'BeginRecording',
        'event_category': 'Exercises',
        'non_interaction': true
      })
      this.$exerciseManager.startExercise(this.getCurrentExercise);
      //compute height for all titles (prevent bounce):
      this.delay = true;
      this.delayTime = breathInDelay;
      this.current = 0;
      this.realCurrent = 0;
      this.overallProgress = 0;
      this.currentExerciseTime = 0;
      this.overallRemaining = this.totalTimeMs;
      this.finish = false;
      this.cycle.current = 0;
      this.cycle.duration = 0;
      this.cycle.elapsed = 0;
      this.$set(this, "recordingPhasesDuration", {});

      //console.log(this.getCurrentExercise, this.overallRemaining, this.estimatedDuration, this.totalTimeMs);
      [...document.querySelectorAll('.faded')].forEach((item) => {
        item.classList.remove('faded');
      });
      this.$forceNextTick(() => {
        this.$refs.stepcountdown.restart();
      })

    },
    startRealExercise() {
      if (this.$capacitor.isNativePlatform()) {
        this.$airlyn.checkMicPerm().then((r) => {
          if (r && r.result === true) {
            this.totalRunningTime = 0;
            this.current = 0;
            this.realCurrent = 0;
            this.setupAll();
          } else {
            const e = {
              "name": $nuxt.$t("errors.global.msg_notallowed"),
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
            "name": $nuxt.$t("errors.global.msg_notallowed"),
            exception: e
          }, null, function () {
            this.exerciseStepBack()
            return true;
          });
        });
      } else {
        this.intervals.push(setTimeout(() => {
          this.totalRunningTime = 0;
          this.current = 0;
          this.realCurrent = 0;
          this.setupAll();
        }, 1000));
      }
    },
    initMicrophone(stream) {
      this.audio.inputPoint = this.audio.audioContext.createGain();
      this.audio.realAudioInput = this.audio.audioContext.createMediaStreamSource(stream);
      this.audio.audioInput = this.audio.realAudioInput;
      this.audio.audioInput.connect(this.audio.inputPoint);
      this.audio.realAudioInput.disconnect();
      this.audio.audioInput = this.convertToMono(this.audio.realAudioInput);
      this.audio.audioInput.connect(this.audio.inputPoint);
      //Create recorder
      this.audio.audioRecorder = new this.$Recorder(this.audio.inputPoint, {worker: this.$worker.createRecorderWorker()});
      this.audio.audioRecorder.clear();
      this.audio.audioRecorder.record();
      this.currentTime = 0;
      this.timeStart = new Date().getTime();
      [...document.querySelectorAll('.faded')].forEach((item) => {
        item.classList.remove('faded');
      });
      this.manageExercise();
      //this.startTimer(); >> trovare soluzione più efficace per gestire tutto.
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
      this.$closeStream();
      /* resetta i contatori*/
      this.timeStart = 0;
      this.timeEnd = 0;
      this.estimatedDuration = 0;
      this.timePauseStart = 0;
      this.timePauseGap = 0;

      if (this.$capacitor.isNativePlatform()) {
        //console.log('request Start Recording', new Date().getTime() / 1000, this.estimatedDuration);
        $nuxt.$airlyn.addListener('airlynUpdateMeters', (info) => {
//console.log('got meters',/*info.peakPowers, */ $nuxt.$normalizeLevels(info.peakPowers));
          //console.warn('got meters', info);
          if (info) {
            if (info.peakPower) {
              this.audioLevels.peakLevel = info.peakPower
            }
            if (info.averagePower) {
              const deviceMicMultiplier = this.$capacitor.getPlatform() === 'ios' ? 200 : 150;
              this.audioLevels.averageLevel = info.averagePower
              this.amplitude = info.peakPower * deviceMicMultiplier //Fix issue percent in base 0.x
              this.average = info.averagePower * deviceMicMultiplier //Fix issue percent in base 0.x
            }
          }

        });
        $nuxt.$airlyn.addListener('airlynUpdateMic', (info) => {
          console.log('got mic INFO', info);
          if (info) {
            this.audioInput = info;
          }
        });
        this.$airlyn.startRecording().then((r) => {
          if (r && r.value === true) {
            this.currentTime = 0;
            this.timeStart = new Date().getTime();
            [...document.querySelectorAll('.faded')].forEach((item) => {
              item.classList.remove('faded');
            });
            //console.log('ready to Record', new Date().getTime() / 1000, this.estimatedDuration);
            this.manageExercise();
          } else {
            console.error('(then)Errore start :', r);
            this.manageMicError({"name": $nuxt.$t("errors.global.msg_startrecording")}, null, function () {
              this.exerciseStepBack()
              return true;
            });
          }
        }).catch((e) => {
          console.error('(catch)Errore start :', e);
          this.manageMicError({"name": $nuxt.$t("errors.global.msg_startrecording"), error: e}, null, function () {
            this.exerciseStepBack()
            return true;
          });
        });
      } else {
        this.$enumerateMediaDevices().then((mediaDevices) => {
          //console.log('got devices', mediaDevices);
          return this.$initAudio(mediaDevices).then((stream) => {
            window.stream = stream;
            if (null == this.audio.audioContext) {
              this.audio.audioContext = new AudioContext();
            }
            this.initMicrophone(stream);
          });
        }).catch((e) => {
          console.error('errore init microfono non gestito', e);
          this.$captureException(e);
          this.manageMicError(e);
          this.manageMicError(e, null, function () {
            this.exerciseStepBack()
            return true;
          });
        }).finally(() => {
          //console.log('audio ready, start!');
          this.$nuxt.$loading.finish();
        });
      }
    }
  },
  mounted() {
    this.delayTime = breathInDelay;
    this.delay = true;
    if (!this.exercise) {
      this.$router.replace($nuxt.localePath("/ml/exercises/" + this.exid));
    }
    this.interval = 250;
    //Start exercises...
    this.timer = 0;
    this.$root.$emit('showPager', {"show": false});
    let maxH = [...document.querySelectorAll('.fakeTitles')].reduce((carry, item) => {
      //console.log('nf', item, item.offsetHeight, item.clientHeight, item.scrollHeight, item.innerHTML);
      return Math.max(carry, Math.max(item.offsetHeight, item.clientHeight, item.scrollHeight));
    }, 0);
    if (document.querySelector('#exerciseTitle')) {
      document.querySelector('#exerciseTitle').style.height = maxH + 'px';
    }
    this.preload = false;
    this.$nextTick(() => {
      this.$root.$emit('setNextText', this.$t('generic.next'));
      this.startExercises();
    });

  }
}
</script>
