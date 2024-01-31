<template>
  <fullpage-card class="runner exercisecc exerciseRecording" :hidefooter="true">
    <template v-slot:header>
      <v-row class="navigation" align-content="center" justify="space-between">
        <v-btn icon @click="leaveMe">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <div class="exercise__title" v-if="getCurrentExercise">
          <span v-html="getCurrentExercise.title"></span>
        </div>
        <v-btn icon @click="openInfoDialog" style="opacity: 0;">
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </v-row>
      <div v-if="!finish&&delay===false" class="exerciseSpecs animated faded">
        <v-img v-if="currentExercise.thumb" :src="currentExercise.thumb" width="20vw" contain></v-img>
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
        <exerciseanimationprogress
          :key="delay"
          v-if="(finish||currentExercise)&&delay===false"
          v-model="current"
          :exerciseSteps="(finish?0:getCurrentExercise.cycles)"
          :startPercent="0"
          :maxPercent="0"
          :class="currentExercise.animationType+' '+(finish?'finished':'') + ' '+(currentExercise.hold?'holdme':'')"
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
        <div :class="['timer text-center animated',finish?'faded':'']"

             v-if="delay===false">
          <v-progress-linear v-model="overallProgress"
                             :style="(currentExercise.hold===true?'opacity:0;':'')"></v-progress-linear>
          <transition mode="out-in" name="exittop">
            <small v-if="currentExercise.hold!==true" :key="currentExercise.hold">
              <template v-if="getCurrentExercise.cycles>1">{{ currentExercise.iteration }} of {{
                  getCurrentExercise.cycles
                }}&nbsp;|&nbsp;
              </template>
              {{ overallRemainingString }}
            </small>
            <small v-else :key="currentExercise.hold">
              {{ convertMsHHMMSS(holdProgress) }}
            </small>
          </transition>
        </div>
      </div>
      <div v-else :class="['exercises__waiting animated',(currentRemaining% 2 === 1?'odd':'even')]">
        <small v-html="$t('generic.startagain')"></small>
        {{ currentRemaining }}
      </div>
      <transition name="fade">
        <div v-if="currentExercise.hold===true&&currentExercise.pause===false" class="holdcontainer">
          <p>{{ $t('ml_exercise.stop_hold_phase_desc') }}</p>
          <v-btn @click="holdEnd" class="nextvm">
            <v-icon>mdi-square</v-icon>&nbsp;{{ $t('ml_exercise.stop_hold_phase_cta') }}
          </v-btn>
        </div>
      </transition>
      <a href="#" id="downloader" style="display: none;">Download audio</a>
      <CountDownItem
        :timerLength="delay===true?delayBreathTime:((currentExercise.hold ? (86400*1000) : currentExercise.durationMs))"
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

const breathInDelay = 3 * 1000;

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
      delay: true,
      delayTime: 0,
      preload: true,
      exid: (this.$route.params.id),
      programid: (this.$route.params.fromprogram || false),
      withindex: (this.$route.params.withindex || false),
      backto: (this.$route.params.backto || false),
      intervals: [],
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
      "holdProgress": 0,
      "timeStart": 0,
      "timeEnd": 0,
      "timePauseStart": 0,
      "timePauseGap": 0,
      "estimatedDuration": 0,
      'recordingPhasesDuration': {},
      'interval': 250,
      'holdMs': 0,
      'holdMsFragment': {},
      'cycle': {
        current: -1,
        duration: 0,
        elapsed: 0,
      },
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
    timestring: function () {
      return new Date(this.totalRunningTime).toISOString().substr(14, 5)
    },
    remainingString: function () {
      if (this.currentExercise.hold === true) {
        return " ";
      }
      const _ret = (this.estimatedDuration * 1000) - this.totalRunningTime;
      return "-" + new Date(_ret).toISOString().substr(14, 5)
    },
    overallRemainingString: function () {

      if (this.currentExercise.hold === true) {
        return " ";
      }
      const _ret = (this.totalTimeMs) - (this.totalRunningTime + this.currentExerciseTime);
      if (_ret < 0) {
        return "-00:00";
      }
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
      if (this.currentTime < 0) {
        return 0;
      }
      const phasesNumber = this.exercisescount;
      const sidePerc = 100 / this.exercisescount;
      const phasePerc = this.current === 0 ? 0 : ((this.current / this.exercisescount) * 100);
      const phaePercTime = (sidePerc * (this.currentTime / this.currentExercise.durationMs * 100)) / 100;
      const perc = phasePerc + phaePercTime;
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
      }, 0) + (this.holdMs / 1000);
    },
    totalTimeMs: function () {
      return this.exercises.reduce(function (carry, item) {
        return carry + (item.duration * 1000);
      }, 0) + this.holdMs;
    }
  },
  watch: {
    'current': function () {
      if (this.current >= 0) {
        const currentCycle = this.cycle.current;
        if (currentCycle !== this.currentExercise.iteration) {
          this.cycle.current = this.currentExercise.iteration;
          this.cycle.elapsed = 0;
          this.cycle.duration = this.getCurrentExercise.exercises.reduce((carry, exe) => {
            if (exe.iteration === this.cycle.current) {
              return carry + exe.durationMs;
            }
            return carry;
          }, 0);
        }
      }
    }
  },
  methods: {
    ...mapActions({
      addDoneExercise: 'addDoneExercise',
      updateExercise: 'updateExercise'
    }),
    convertMsHHMMSS(val) {
      let hhmmss = new Date(val).toISOString().substr(11, 8)
      return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss
    },
    timerChange(progress) {
      if (this.delay === true) {
        this.delayTime -= progress.interval;
        if ((progress.elapsed + progress.interval) > this.delayBreathTime) {
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
        this.totalRunningTime
      );
       */
      if (this.currentExercise.hold === false) {
        this.currentProgress = 100 - (progress.totalSeconds / this.currentExercise.duration * 100);
        this.currentRemaining = progress.totalSeconds;
        this.currentTime = (this.currentExercise.durationMs) - progress.totalMilliseconds; //Compute difference in ms since start
      } else {
        this.currentProgress = 100;
        this.holdMs += progress.interval;

      }

      if (this.currentExercise.pause === false) {
        //this.totalRunningTime += progress.interval; //sum interval step
        this.holdProgress += progress.interval;
        const _percent = ((this.totalRunningTime + this.currentExerciseTime) / this.totalTimeMs * 100);
        this.overallProgress = _percent > 100 ? 100 : _percent;
      }
      if (this.currentExercise.hold === false && (progress.elapsed + progress.interval) > this.currentExercise.durationMs) {
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
    holdEnd() {
      //console.log('finish hold');
      this.$refs.stepcountdown.end();
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
      if (this.currentExercise.hold === true) {
        this.holdMsFragment[this.current] = new Date().getTime() - this.holdMsFragment[this.current];
      }
      console.log('END EXERCISE check seconds: ', new Date().getTime() / 1000, this.recordingPhasesDuration[this.current]);
      this.$nextTick(() => {
        this.current++;
        this.currentExerciseTime = 0;
        if (this.currentExercise.pause === false) {
          this.realCurrent++;
        }
        this.currentRemaining = this.currentExercise.duration;
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
      })
    },
    leaveMe() {
      this.$gtag('event', 'click', {
        'event_label': 'StopRecording',
        'event_category': 'Exercises',
        'non_interaction': true
      })
      this.$analytics.logEvent('exercise_quit', {
        "id": this.getCurrentExercise.id,
        "name": this.getCurrentExercise.title,
        "program_id": this.getCurrentExercise.program_id || null,
        "type": this.getCurrentExercise.type,
      })
      this.intervals.map((interval) => {
        try {
          clearTimeout(interval)
        } catch (e) {
        }
      });

      this.$refs.stepcountdown.abort();
      if (document.querySelector('#__nuxt')) {
        document.querySelector('#__nuxt').classList.add('quit');
      }
      this.exerciseStepBack()
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
      this.$router.back();
      this.$gtag('event', 'click', {
        'event_label': 'StopRecording',
        'event_category': 'Exercises',
        'non_interaction': true
      })
    },
    nextStep() {
      this.$root.$emit('showPager', {"show": false});
      let suffix = this.buildSuffix();
      if(suffix.length>0) {
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
      this.$nextTick(() => {
        const mergeAnimation = Object.assign({
          targets: '.breath_item',
          loop: false,
          easing: 'easeInOutQuad',
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

      Object.keys(this.recordingPhasesDuration).map((v) => {
        this.recordingPhasesDuration[v] = this.recordingPhasesDuration[v] > 0 ? this.recordingPhasesDuration[v] / 1000 : 0;
      });
      let heldTimeCount = 0;
      let heldTimeDuration = 0;
      Object.keys(this.recordingPhasesDuration).map((v) => {
        this.recordingPhasesDuration[v] = this.recordingPhasesDuration[v] > 0 ? this.recordingPhasesDuration[v] / 1000 : 0;
      });
      Object.keys(this.holdMsFragment).map((v) => {
        heldTimeCount += 1;
        heldTimeDuration += this.holdMsFragment[v] > 0 ? this.holdMsFragment[v] / 1000 : 0;
      });
      let exerciseValue = {
        exerciseStarts: this.timeStart / 1000,
        exerciseEnds: this.timeEnd / 1000,
        pauseTime: this.timePauseGap > 0 ? this.timePauseGap / 1000 : 0,
        totalComputedDuration: (this.timeEnd - this.timeStart) / 1000,
        estimatedDuration: this.estimatedDuration,
        /*apiDuration: this.getCurrentExercise.duration,*/
        clientPhases: this.recordingPhasesDuration,
        totalHeldTime: this.holdMs > 0 ? this.holdMs / 1000 : 0,
        averageHeldTime: this.holdMs > 0 ?(this.holdMs / heldTimeCount) / 1000 : 0
      }
      const uploadFake = 1000;
      const progressInterval = setInterval(() => {
        this.uploadProgress += 0.20;
      }, uploadFake / 4)
      this.intervals.push(setTimeout(() => {
        clearInterval(progressInterval);
        this.sendRecord(null, exerciseValue);
      }, uploadFake));

    },
    sendRecord(blob, exerciseSummary) {
      this.uploadProgress = 0;
      //console.log('start sendRecord');
      this.loading = true;
      const today = new Date();
      const _userID = this.$auth.user ? (this.$auth.user._id || this.$auth.user.userId) : today.getMilliseconds();
      let passed = false;
      this.$exerciseManager.completeExercise(
        this.getCurrentExercise,
        (progress) => {
          this.uploadProgress = (progress.loaded / progress.total) - 0.05;
        },
        null,
        exerciseSummary
      ).then((r) => {
        this.uploadProgress = 1;
        if (r.exercise && r.response && r.exercise.completed) {
          passed = true;
        } else {
          passed = $nuxt.$t("errors.global.msg_restapi");
        }
        console.log('got record result', r);
      }).catch((e) => {
        console.error("Errore invio api [breathing_exercises]:", e);
        this.$captureException(e);
        passed = $nuxt.$t("errors.global.title");
        this.$analytics.logEvent("error", {
          "title": 'cannot send exercise'
        });
      }).finally(() => {
        if (passed === true) {
          if (this.isCurrentUserGuest) {
            this.addDoneExercise(1);
          }
          this.nextStep();
        } else {
          //Show Error?
          this.$root.$emit('showError', {
            hasretry: true,
            title: $nuxt.$t("errors.global.uhoh"),
            error: passed,
            click: () => {
              this.startExercises();
              return true;
            },
            resetEvent: function () {
              this.exerciseStepBack()
              return true;
            }
          });
        }
      });
    },
    closeInfo() {
      this.about.show = false;
      this.$refs.stepcountdown.start();
      const elapsedTime = new Date().getTime() - this.timePauseStart;
      this.timePauseGap += elapsedTime;
      console.log('countdown resumed total Pause: ', this.timePauseGap);
    },
    openInfoDialog() {
      return;
      this.$refs.stepcountdown.pause();
      this.timePauseStart = new Date().getTime();
      console.log('countdown paused');
      this.about.show = true;
    },
    manageExercise() {
      //console.log('init exercise', this.current);
      this.$anime.remove('.breath_item');
      if (document.querySelector("div.breath_item")) {
        document.querySelector("div.breath_item").classList.remove('animating');
      }
      [...document.querySelectorAll('.faded')].forEach((item) => {
        item.classList.remove('faded');
      });
      this.recordingPhasesDuration[this.current] = new Date().getTime();
      if (this.currentExercise.hold) {
        this.holdProgress = 0;
        this.holdMsFragment[this.current] = new Date().getTime();
      }
      if (this.current >= 0) {
        this.estimatedDuration += (this.currentExercise.hold ? 0 : this.currentExercise.duration);
        //console.log('ready to start new Exercise', new Date().getTime() / 1000, this.currentExercise.durationMs);
        this.$refs.stepcountdown.restart();

        const mergeAnimation = Object.assign({
          targets: '.breath_item',
          loop: (this.currentExercise.hold),
          easing: 'easeOutSine',
          duration: this.currentExercise.hold ? 3000 : ((this.currentExercise.durationMs) - 50),
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
      this.$exerciseManager.startExercise(this.getCurrentExercise);
      this.$analytics.setScreenName(this.getCurrentExercise.title + " " + this.getCurrentExercise.type + " page");
      this.$gtag('event', 'click', {
        'event_label': 'BeginRecording',
        'event_category': 'Exercises',
        'non_interaction': true
      })
      //compute height for all titles (prevent bounce):
      this.delay = true;
      this.delayTime = breathInDelay;
      this.current = 0;
      this.realCurrent = 0;
      this.overallProgress = 0;
      this.holdMs = 0;
      this.currentExerciseTime = 0;
      this.overallRemaining = this.totalTimeMs;
      this.finish = false;
      this.cycle.current = 0;
      this.cycle.duration = 0;
      this.cycle.elapsed = 0;
      this.$set(this, "recordingPhasesDuration", {});
      this.totalRunningTime = 0;
      this.current = 0;
      this.realCurrent = 0;
      //console.log(this.getCurrentExercise, this.overallRemaining, this.estimatedDuration, this.totalTimeMs);
      [...document.querySelectorAll('.faded')].forEach((item) => {
        item.classList.remove('faded');
      });
      this.$forceNextTick(() => {
        this.$refs.stepcountdown.restart();
      })

    },
    startRealExercise() {
      this.setupAll()
    },
    setupAll() {
      /* resetta i contatori*/
      this.$nuxt.$loading.finish();
      this.timeStart = 0;
      this.timeEnd = 0;
      this.estimatedDuration = 0;
      this.timePauseStart = 0;
      this.timePauseGap = 0;
      this.holdMs = 0;

      this.currentTime = 0;
      this.timeStart = new Date().getTime();
      [...document.querySelectorAll('.faded')].forEach((item) => {
        item.classList.remove('faded');
      });
      console.log('ready to Record', new Date().getTime() / 1000, this.estimatedDuration);
      this.manageExercise();
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
