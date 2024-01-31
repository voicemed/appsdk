<template>
  <fullpage-card :class="['audioExercise withpage','mediaexercise_step_'+step]" :hidefooter="false">
    <template v-slot:header>
      <v-row class="navigation" align-content="center" justify="space-between" v-if="step>0">
        <v-btn icon @click="exitClick">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <div class="exercise__title" v-if="getCurrentExercise">
          <span v-html="getCurrentExercise.title"></span>
        </div>
        <v-btn icon @click="infoStep">
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </v-row>
    </template>
    <template v-slot:body>
      <transition appear name="fade">
        <div class="tutorial_info"
             v-if="(step==0)">
          <div class="tutorial__header header">
            <div :class="['exercise_type icon_holder', getCurrentExercise.type]">&nbsp;</div>
          </div>
          <div class="tutorial__body body">
            <div class="tutorial__title">{{ getCurrentExercise.title }}</div>
            <div class="tutorial_exinfo">
              <v-icon>mdi-clock-time-four-outline</v-icon>&nbsp;
              {{ $humanizeTime(getCurrentExercise.duration) }}
            </div>
            <div class="tutorial__content" v-html="getCurrentExercise.about||''"></div>
          </div>
        </div>
        <div style="min-width: 100%" v-else >
          <div class="playerArea" style="min-width: 100%">
            <div :class="['waveContainer_v2',(play?'playing':''), (ended?'ended':'')]">
              <canvas :id="playerId+'_canvas'"></canvas>
            </div>
          </div>

        </div>
      </transition>
      <audio v-bind:id="playerId"
             :loop="false"
             ref="audiofile"
             :src="audiofile"
             preload="auto"
             playsinline
             crossorigin="anonymous"
             style="display:none;">
      </audio>
    </template>
    <template v-slot:footer>
      <div class="footer_container" v-if="loaded&&step>0">
        <div class="runningTime">
          <v-progress-linear v-model="currentPercent"  :key="currentTime"
                             style="margin-bottom: 12px;"></v-progress-linear>
          <span v-if="play">-{{ currentTime }}</span>
          <span v-if="!play">{{ duration }}</span>
        </div>
        <v-row class="player" align-content="center" justify="space-between" >
          <v-btn icon @click="rewindClick" :disabled="audio.currentTime<10">
            <v-icon>mdi-rewind-10</v-icon>
          </v-btn>
          <v-btn @click="playClick" class="btn_play" :disabled="!loaded">
            <v-icon v-if="!play">mdi-play</v-icon>
            <v-icon v-if="play">mdi-pause</v-icon>
          </v-btn>
          <v-btn icon @click="forwardClick" :disabled="(audio.currentTime>totalDuration-10)">
            <v-icon>mdi-fast-forward-10</v-icon>
          </v-btn>
        </v-row>
      </div>
      <div class="steps" v-if="step===0">
        <v-btn
          color="backvm"
          text
          nuxt
          @click="backStep"
        >
          {{ $t('generic.back') }}
        </v-btn>
        <v-spacer class="spacer"/>
        <v-btn
          color="nextvm"
          class="nextController"
          @click="nextStep"
        >
          {{ $t('generic.start_arrow') }}&nbsp;
        </v-btn>
      </div>
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
  </fullpage-card>
</template>
<script>
import basepage from "~/mixins.js/exercisepage";
import {mapActions, mapGetters} from 'vuex'
import {Wave} from "flotruglio-weve"

export default {
  name: 'audioPlayer',
  mixins: [basepage],
  data() {
    return {
      step: 0,
      exid: (this.$route.params.id),
      programid: (this.$route.params.fromprogram || false),
      withindex: (this.$route.params.withindex || false),
      backto: (this.$route.params.backto || false),
      name: "audioPlayer",
      play: false,
      audiofile: null,
      loaded: false,
      ended: false,
      currentTime: '00:00',
      currentTimeS: 0,
      uuid: '0',
      audio: undefined,
      totalDuration: 0,
      about: {
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
  /*
  beforeRouteLeave(_to, _from, next) {

  },*/
  computed: {
    ...mapGetters({
      getExercises: 'getExercises',
      getCurrentExercise: 'getCurrentExercise',
      skipTutorial: 'skipTutorial',
      isCurrentUserGuest: 'isCurrentUserGuest'
    }),
    exercise() {
      return this.getCurrentExercise
    },
    duration: function () {
      return this.audio ? this.convertTimeHHMMSS(this.totalDuration) : ''
    },
    playerId: function () {
      return 'player-' + this.uuid
    },
    currentPercent() {

      if (this.totalDuration <= 0) {
        return 0;
      }
      if (this.currentTimeS === 0) {
        return 0;
      }

      if (this.audio) {

        const perc = this.currentTimeS / this.totalDuration * 100;
        if (perc > 100) {
          return 100;
        }
        return perc;
      }
      return 0;
    },
  },
  methods: {
    ...mapActions({
      setCurrentExerciseIndex: 'setCurrentExerciseIndex',
      setCurrentExerciseById: 'setCurrentExerciseById',
      setCurrentUser: 'setCurrentUser',
      setIsGuest: 'setIsGuest',
      addDoneExercise: 'addDoneExercise',
      setCurrentExerciseByData: 'setCurrentExerciseByData',
    }),
    nextStep() {
      if(this.step<1) {
        this.step+=1;
        this.$nextTick(()=>{
          this.startMediaExcerise()
        })
      }
    },
    backStep() {
      if(this.step===0) {
        this.exitClick()
        return;
      }
      this.step=0;
    },
    closeInfo() {
      this.about.show = false;
    },
    infoStep() {
      if (this.play) {
        this.playClick();
      }
      this.about.show = true;
    },
    prevStep() {
      if (this.about.show === true) {
        this.closeInfo();
        return;
      }
      this.exitClick();
    },
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function (c) {
        let v, r
        r = Math.random() * 16 | 0;
        v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    convertTimeHHMMSS(val) {
      let hhmmss = new Date(val * 1000).toISOString().substr(11, 8)
      return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss
    },
    playClick() {
      this.play = !this.play;
      if (this.play) {
        this.audio.play()
      } else {
        this.audio.pause()
      }
    },
    forwardClick() {
      this.audio.currentTime = this.audio.currentTime + 10;
      this.currentTimeS = this.audio.currentTime;
    },
    rewindClick() {
      this.audio.currentTime = this.audio.currentTime - 10;
      this.currentTimeS = this.audio.currentTime;
    },
    exitClick() {
      this.$analytics.logEvent('exercise_quit', {
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
    attachCanvasWave: function () {
      let containerSize = document.querySelector('.waveContainer_v2').getBoundingClientRect().width;
      let audioElement = document.querySelector("#" + this.playerId);
      let canvasElement = document.querySelector("#" + this.playerId + "_canvas");
      const parent = canvasElement.closest('div');
      const offset = 20;
      let wave = new Wave(audioElement, canvasElement);

      wave.addAnimation(new wave.animations.LinesCustom({
        mirroredY:true,
        mirroredX:true,
        frequencyBand:'mids',
        count: 14,
        center:true,
        lineColor: '#FFF',
        lineWidth: 6,
        rounded: true
      }))
      /*
      wave.addAnimation(new wave.animations.Lines({

        fillColor: {gradient: ["#52E9CD", "#848CE6"]},
        lineColor: {gradient: ["#52E9CD", "#848CE6"]},
        glow: {
          strength: 1,
          color: "#52E9CD"
        }
      }));
      */
    },
    _handleLoaded: function () {
      if (this.audio.readyState >= 2) {
        this.loaded = true
        this.totalDuration = parseInt(this.audio.duration)


        if(this.step>0) {
          this.$nextTick(()=> {
            this.attachCanvasWave();
            this.playClick();
          });
        }
      } else {
        this.$root.$emit('showError', {
          hasretry: true,
          title: $nuxt.$t('errors.global.title'),
          error: $nuxt.$t('errors.global.msg_loadaudiotrack'),
          click: null,
          resetEvent: function () {
            $nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl));
            return true;
          }
        });
      }
    },
    _handlePlayingUI: function (e) {
      let currTime = parseInt(this.audio.currentTime)
      this.currentTimeS = parseInt(this.audio.currentTime);
      this.currentTime = this.convertTimeHHMMSS(this.totalDuration - currTime);
    },
    _handlePlayPause: function (e) {
      if (e.type === 'pause' && this.play === false) {
        this.currentTime = '00:00'
        this.play = false
        console.log('finish?')
      }
    },
    _handleEnd: function (e) {
      console.log('audio finito', e);
      this.play = false;
      this.ended = true;
      if (this.isCurrentUserGuest) {
        this.getCurrentExercise.completed = true;
        this.$root.$emit('completedExercise', this.getCurrentExercise);
        this.$nextTick(() => {
          this.$root.$emit('showPager', {"show": false});
          let suffix = this.buildSuffix();
          if(suffix.length>0) {
            suffix = "/" + suffix
          }
          this.$router.push($nuxt.localePath("/ml/greetings/" + this.exid + suffix));
        });
        return;
      }

      let passed = false;
      this.$exerciseManager.completeExercise(this.getCurrentExercise, null, null).then((r) => {
        console.log('got record result', r);
        if (r.exercise && r.response && r.exercise.completed) {
          passed = true;
          this.getCurrentExercise.completed = r.exercise.completed;
        } else {
          passed = "Error with restApi";
        }

      }).catch((e) => {
        console.error("Errore invio api [breathing_exercises_audio]:", e);
        this.$captureException(e);
        passed = $nuxt.$t('errors.global.title');
        this.$analytics.logEvent("error", {
          "title": 'cannot send exercise audio'
        });
      }).finally(() => {
        if (passed === true) {
          this.addDoneExercise(1);
          this.$nextTick(() => {
            this.$root.$emit('showPager', {"show": false});
            let suffix = this.buildSuffix();
            if(suffix.length>0) {
              suffix = "/" + suffix
            }
            this.$router.push($nuxt.localePath("/ml/greetings/" + this.exid + suffix));
          });
        } else {
          //Show Error?
          this.$root.$emit('showError', {
            hasretry: true,
            title: $nuxt.$t('errors.global.uhoh'),
            error: passed,
            leaveBtn: this.$t('generic.startanyway'),
            click: () => {
              this.startAgain();
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
    startAgain() {
      this.ended = false;
      this.audio.currentTime = 0;
      this.currentTimeS = 0;
      this.play = false;
    },
    init: function () {
      this.ended = false;
      this.audio.addEventListener('timeupdate', this._handlePlayingUI)
      this.audio.addEventListener('loadeddata', this._handleLoaded)
      this.audio.addEventListener('pause', this._handlePlayPause)
      this.audio.addEventListener('play', this._handlePlayPause)
      this.audio.addEventListener('ended', this._handleEnd)

    },
    getAudio: function () {
      return this.$el.querySelectorAll('audio')[0]
    },
    handleBack() {
      console.log('got backbutton');
      this.prevStep();
    },
    retrieveCurrentExerciseAndSet() {
      if (this.hasJoinedProgramById(this.programid)) {
        const _joinProgram = this.getProgramById(this.programid);
        if (this.withindex > -1) {
          const list = _joinProgram.exercises.filter((i) => i.id === this.exid && i.program_index == this.withindex);
          if (list.length > 0) {
            this.setCurrentExerciseByData(list[0])
          }
        } else {
          this.setCurrentExerciseByData(null)
        }
      } else {
        this.setCurrentExerciseById(this.exid);
      }
    },
    startMediaExcerise() {
      this.attachCanvasWave();
      this.audio.load();
    }
  },
  mounted() {
    if (this.$capacitor && this.$capacitor.isNativePlatform()) {
      this.$backEmitter.callback = this.handleBack;
    }
    this.uuid = this.generateUUID();
    if (this.exid) {
      this.retrieveCurrentExerciseAndSet();
      if (this.getCurrentExercise) {
        this.audiofile = this.getCurrentExercise.audio;
        this.audio = this.getAudio();
        this.init()
      } else {
        console.warn('cannot find exercise ', this.exid);
        this.exerciseStepBack()
      }
      this.$nextTick(() => {
        this.name = "audioPlayer";
        this.$root.$emit('showNext', false);
        this.$root.$emit('showPager', {show: false});
        this.$root.$emit('showOverlay', {show: false});

        if (this.audio) {
          this.$analytics.logEvent('exercise_listening', {
            "id": this.getCurrentExercise.id,
            "name": this.getCurrentExercise.title,
            "program_id": this.getCurrentExercise.program_id || null,
            "program_name": this.hasJoinedProgramById(this.getCurrentExercise.program_id) ?
              this.getProgramById(this.getCurrentExercise.program_id).name : null,
            "type": this.getCurrentExercise.type,
          })
          this.$exerciseManager.startExercise(this.getCurrentExercise);
          this.$analytics.setScreenName(this.getCurrentExercise.title + " listening page");
          //this.audio.load(); >> load on next Step...

        }
      });
    } else {
      console.warn('cannot find exercise[2] ', this.exid);
      this.exerciseStepBack()
    }
  },
  beforeDestroy: function () {
    if (this.$capacitor && this.$capacitor.isNativePlatform()) {
      this.$backEmitter.callback = null
    }
    if (this.audio) {
      this.audio.removeEventListener('timeupdate', this._handlePlayingUI)
      this.audio.removeEventListener('loadeddata', this._handleLoaded)
      this.audio.removeEventListener('pause', this._handlePlayPause)
      this.audio.removeEventListener('play', this._handlePlayPause)
      this.audio.removeEventListener('ended', this._handleEnd)
    }
  }
}
</script>
