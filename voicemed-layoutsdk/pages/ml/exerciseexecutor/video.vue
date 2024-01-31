<template>
  <fullpage-card :class="['videoExercise withpage','mediaexercise_step_'+step]" :hidefooter="false">
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
        <div v-else>
      <div class="playerArea video" id="playerAreaContainer" >
        <video v-bind:id="playerId"
               :loop="false"
               ref="videofile"
               :src="videofile"
               class="hide"
               playsinline
               :poster="getCurrentExercise.videoThumbnail?getCurrentExercise.videoThumbnail:''"
               preload="auto">
        </video>
        <div class="videoOverlayWaiting" v-if="loaded===false">
          <v-progress-circular :indeterminate="true" color="primary"></v-progress-circular>
        </div>

      </div>
      <div class="runningTime">
        <span v-if="play">-{{ currentTime }}</span>
        <span v-if="!play">{{ duration }}</span>
        <v-btn icon @click="requestFullScreen">
          <v-icon>mdi-fullscreen</v-icon>
        </v-btn>
      </div>
        </div>
      </transition>
    </template>
    <template v-slot:footer>
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
      <v-row class="player" align-content="center" justify="space-between" v-if="loaded&&step>0">
        <v-btn icon @click="rewindClick" :disabled="video.currentTime<10">
          <v-icon>mdi-rewind-10</v-icon>
        </v-btn>
        <v-btn @click="playClick" :class="['btn_play',(play?'playing':'')]" :disabled="!loaded">
          <v-icon v-if="!play">mdi-play</v-icon>
          <v-icon v-if="play">mdi-pause</v-icon>
        </v-btn>
        <v-btn icon @click="forwardClick" :disabled="(video.currentTime>totalDuration-10)">
          <v-icon>mdi-fast-forward-10</v-icon>
        </v-btn>
      </v-row>
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

export default {
  name: 'videoPlayer',
  mixins: [basepage],
  data() {
    return {
      step: 0,
      exid: (this.$route.params.id),
      programid: (this.$route.params.fromprogram || false),
      withindex: (this.$route.params.withindex || -1),
      backto: (this.$route.params.backto || false),
      name: "videoPlayer",
      play: false,
      videofile: null,
      loaded: false,
      ended: false,
      currentTime: '00:00',
      currentTimeS: 0,
      uuid: '0',
      video: undefined,
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
      return this.video ? this.convertTimeHHMMSS(this.totalDuration) : ''
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

      if (this.video) {

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
    requestFullScreen() {
      const elem = document.getElementById(this.playerId);
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.webkitEnterFullScreen) {
        elem.webkitEnterFullScreen();
      }
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
        this.video.play()
      } else {
        this.video.pause()
      }
    },
    forwardClick() {
      this.video.currentTime = this.video.currentTime + 10;
      this.currentTimeS = this.video.currentTime;
    },
    rewindClick() {
      this.video.currentTime = this.video.currentTime - 10;
      this.currentTimeS = this.video.currentTime;
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
    _handleLoaded: function () {

      if (this.video.readyState >= 2) {
        this.fixVideoHeight(this.video.videoWidth, this.video.videoHeight);
        this.loaded = true
        this.video.classList.remove('hide');
        this.totalDuration = parseInt(this.video.duration)
        if(this.step>0) {
          this.playClick();
        }
      } else {
        this.$root.$emit('showError', {
          hasretry: true,
          title: $nuxt.$t('errors.global.title'),
          error: $nuxt.$t('errors.global.msg_loadvideotrack'),
          click: null,
          resetEvent: function () {
            $nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl));
            return true;
          }
        });
      }
    },
    _handlePlayingUI: function (e) {
      let currTime = parseInt(this.video.currentTime)
      this.currentTimeS = parseInt(this.video.currentTime);
      this.currentTime = this.convertTimeHHMMSS(this.totalDuration - currTime);
    },
    _handlePlayPause: function (e) {
      if (e.type === 'pause' && this.play === false) {
        this.currentTime = '00:00'
        this.play = false
        console.log('finish?')
      }
    },
    _handleFullScreenMode: function (e) {
      const elem = document.getElementById(this.playerId);
      if (!!(elem.currentTime > 0 && !elem.paused && !elem.ended && elem.readyState > 2)) {
        this.play = true;
      } else {
        this.play = false;
      }
    },
    _handleEnd: function (e) {
      console.log('video finito', e);
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
          passed = $nuxt.$t('errors.global.msg_restapi')
        }
      }).catch((e) => {
        console.error("Errore invio api [breathing_exercises_video]:", e);
        this.$captureException(e);
        passed = $nuxt.$t('errors.global.title');
        this.$analytics.logEvent("error", {
          "title": 'cannot send exercise video'
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
              $nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl));
              return true;
            }
          });
        }
      });
    },
    startAgain() {
      this.ended = false;
      if(this.video) {
        this.video.currentTime = 0;
      }
      this.currentTimeS = 0;
      this.play = false;
    },
    init: function () {
      this.ended = false;
      this.video.addEventListener('timeupdate', this._handlePlayingUI)
      this.video.addEventListener('loadeddata', this._handleLoaded)
      this.video.addEventListener('pause', this._handlePlayPause)
      this.video.addEventListener('play', this._handlePlayPause)
      this.video.addEventListener('ended', this._handleEnd)
      this.video.addEventListener('fullscreenchange', this._handleFullScreenMode)

    },
    getVideo: function () {
      return this.$el.querySelectorAll('video')[0]
    },
    handleBack() {
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
    fixVideoHeight(videoW, videoH) {
      const videoRatio = videoW / videoH;
      const _videoContainer = document.getElementById('playerAreaContainer')
      if (_videoContainer) {
        let _maxHeight = document.body.clientHeight;
        let _maxWidth = document.body.clientWidth;
        const _page = _videoContainer.closest('.fullPageCard');
        const _header = _page.querySelector('div.header');
        const _footer = _page.querySelector('div.footer');
        const _runningTime = _page.querySelector('div.runningTime');
        if (_header) {
          _maxHeight = _maxHeight - _header.scrollHeight;
        }
        if (_footer) {
          _maxHeight = _maxHeight - _footer.scrollHeight;
        }

        if (_runningTime) {
          _maxHeight = _maxHeight - _runningTime.scrollHeight;
        } else {
          _maxHeight = _maxHeight - 36;
        }

        const _bodyHeight =
          Math.min(
            _maxHeight,
            _page.scrollHeight - ((_header ? _header.scrollHeight : 0) + (_footer ? _footer.scrollHeight : 0))
          ) - (_runningTime ? _runningTime.scrollHeight : 36);

        console.log('computed h', _bodyHeight, _maxHeight, _page.scrollHeight - ((_header ? _header.scrollHeight : 0) + (_footer ? _footer.scrollHeight : 0)));
        _page.querySelector('div.body').style.height = (_bodyHeight - 4) + "px";
        _page.querySelector('div.body').style.overflow = 'hidden';

        _videoContainer.style.height = _bodyHeight + "px";
        _videoContainer.style.width = _bodyHeight * videoRatio + "px";
        _page.querySelector('div.body').classList.remove('horizontal');
        if (_bodyHeight * videoRatio > _maxWidth) {
          _page.querySelector('div.body').classList.add('horizontal');
          _videoContainer.style.width = _maxWidth + "px";
          _videoContainer.style.height = (_maxWidth / videoRatio) + "px";
        }

      }
    },
    startMediaExcerise() {
      this.video = this.getVideo();
      this.init()
      this.video.load();
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
        this.videofile = this.getCurrentExercise.video;
      } else {
        console.error('cannot find exercise ', this.exid);
        $nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl));
      }
      this.$nextTick(() => {
        this.name = "videoPlayer";

        this.$root.$emit('showNext', false);
        this.$root.$emit('showPager', {show: false});
        this.$root.$emit('showOverlay', {show: false});

        if (this.video) {
          this.$analytics.logEvent('exercise_seeing', {
            "id": this.getCurrentExercise.id,
            "name": this.getCurrentExercise.title,
            "program_id": this.getCurrentExercise.program_id || null,
            "program_name": this.hasJoinedProgramById(this.getCurrentExercise.program_id) ?
              this.getProgramById(this.getCurrentExercise.program_id).name : null,
            "type": this.getCurrentExercise.type,
          })
          this.$exerciseManager.startExercise(this.getCurrentExercise);
          this.$analytics.setScreenName(this.getCurrentExercise.title + " seeing page");
          //this.video.load();
        }
      });
    } else {
      console.error('cannot find exercise[2] ', this.exid);
      $nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl));
    }
  },
  beforeDestroy: function () {
    if (this.$capacitor && this.$capacitor.isNativePlatform()) {
      this.$backEmitter.callback = null
    }
    if (this.video) {
      this.video.removeEventListener('timeupdate', this._handlePlayingUI)
      this.video.removeEventListener('loadeddata', this._handleLoaded)
      this.video.removeEventListener('pause', this._handlePlayPause)
      this.video.removeEventListener('play', this._handlePlayPause)
      this.video.removeEventListener('ended', this._handleEnd)
      this.video.removeEventListener('fullscreenchange', this._handleFullScreenMode)
    }
  }
}
</script>
