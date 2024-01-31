<template>
  <fullpage-card class="postExercise" :hidefooter="true">
    <template v-slot:header>
      <v-row class="navigation" align-content="center" justify="space-between">
        <v-btn icon @click="exitClick">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <div class="exercise__title" v-if="getCurrentExercise">
          <span>{{ $t('generic.exercisetype.' + getCurrentExercise.type) }}</span>
        </div>
        <v-btn icon @click="infoStep" style="opacity: 0;">
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </v-row>
    </template>
    <template v-slot:body>
      <div class="post__exercise__container">
        <div class="post__thumb" v-if="exerciseThumb">
          <v-img :src="exerciseThumb"
                 height="10vh"
                 @error="imageError">
          </v-img>
        </div>
        <h3 class="post__title" v-html="getCurrentExercise.title"></h3>
        <div v-if="readingtime>0" style="font-style: italic; font-size: 80%; display: none;">[DEV] Computed reading time: {{readingtime}} minutes</div>
        <div class="post__content" ref="articleText" v-html="getCurrentExercise.postDescription"></div>
      </div>
    </template>
    <template v-slot:footer>
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
import {Wave} from "@foobar404/wave";

export default {
  name: 'postPlayer',
  mixins: [basepage],
  data() {
    return {
      exid: (this.$route.params.id),
      programid: (this.$route.params.fromprogram || false),
      withindex: (this.$route.params.withindex || false),
      backto: (this.$route.params.backto || false),
      name: "postPlayer",
      exerciseThumb: null,
      loaded: false,
      ended: false,
      uuid: '0',
      about: {
        show: false
      },
      readingtime:0
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
    readingTime() {
      const text = this.$refs.articleText.innerText
      const wpm = 225;
      const words = text.trim().split(/\s+/).length;
      console.log('found words:',words)
      const time = Math.ceil(words / wpm);
      this.readingtime = time;
    },
    imageError() {
      this.exerciseThumb = null
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
    nextStep() {
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
          passed = $nuxt.$t('errors.global.msg_restapi');
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
            title: "Uh-oh!<br/>",
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
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function (c) {
        let v, r
        r = Math.random() * 16 | 0;
        v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
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
    init: function () {
      this.ended = false;
      if (this.getCurrentExercise.thumbnail) {
        this.exerciseThumb = this.getCurrentExercise.thumbnail;
      }
      document.querySelector('.postExercise.fullPageCard').addEventListener('scroll', (event) => {
        const {scrollHeight, scrollTop, clientHeight} = event.target;
        if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
          console.log('scrolled');
          this.$root.$emit('showPager', {show: true});
          this.$nextTick(() => {
            this.$root.$emit('setNextText', this.$t('generic.done'));
            this.$root.$emit('showNext', true);
            this.hasNext = true;
            this.hasInfo = false;
            this.hasBack = false;
          });
        }
      })

      this.$nextTick(() => {
        this.ensureArticleHeight();
      })
    },
    ensureArticleHeight() {
      //post__exercise__container
      const _article = document.querySelector('.postExercise.fullPageCard .post__exercise__container');
      const _parent = document.querySelector('.postExercise');
      console.log('artiche height:', _article.clientHeight, "parent ", _parent.clientHeight);
      if (_parent.clientHeight > _article.clientHeight) {
        console.log('need to show everything');
        setTimeout(function (istance) {
          console.log('finish timeout', istance);
          istance.$root.$emit('showPager', {show: true});
          istance.$nextTick(() => {
            istance.$root.$emit('setNextText', istance.$t('generic.done'));
            istance.$root.$emit('showNext', true);
            istance.hasNext = true;
            istance.hasInfo = false;
            istance.hasBack = false;
          });
        }, 300, this);
      }
      this.readingTime()
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
        console.log(this.getCurrentExercise);
        this.init()
      } else {
        console.warn('cannot find exercise ', this.exid);
        this.exerciseStepBack()
      }
      this.$nextTick(() => {
        this.name = "postPlayer";
        this.hasNext = true;
        this.hasInfo = false;
        this.hasBack = false;
        this.$root.$emit('showPager', {show: false});
        this.$root.$emit('setNextText', this.$t('generic.done'));
        this.$root.$emit('showOverlay', {show: false});
        this.$analytics.logEvent('exercise_reading', {
          "id": this.getCurrentExercise.id,
          "name": this.getCurrentExercise.title,
          "program_id": this.getCurrentExercise.program_id || null,
          "program_name": this.hasJoinedProgramById(this.getCurrentExercise.program_id) ?
            this.getProgramById(this.getCurrentExercise.program_id).name : null,
          "type": this.getCurrentExercise.type,
        })
        this.$exerciseManager.startExercise(this.getCurrentExercise);
        this.$analytics.setScreenName(this.getCurrentExercise.title + " reading page");
      });
    } else {
      console.warn('cannot find exercise[2] ', this.exid);
      this.exerciseStepBack()
    }
  },
  beforeDestroy: function () {
    if (this.$capacitor && this.$capacitor.isNativePlatform()) {
      console.log('remove backbutton');
      this.$backEmitter.callback = null
    }
  }
}
</script>
