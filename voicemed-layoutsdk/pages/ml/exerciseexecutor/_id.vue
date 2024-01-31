<template>
  <fullpage-card :hidefooter="true" class="exercisePage" v-if="getCurrentExercise&&loading===false">
    <template v-slot:header>
      <transition name="fade">
        <div v-if="getCurrentExercise" class="exercise__mastertitle">
          <span v-html="getCurrentExercise.title"></span>
          <div class="smalldescription" v-if="estimatedDuration">
            <v-icon>mdi-clock-time-four-outline</v-icon>
            {{ $t('generic.totalestimated') }}
            {{ $humanizeTime(estimatedDuration) }}
          </div>
          <v-btn icon @click="infoStep" class="exercise__infobtn">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </div>
      </transition>
    </template>
    <template v-slot:body>
      <transition name="fade">
        <div v-if="getCurrentExercise" class="welcomeExercise">
          <v-img :src="exerciseThumb" @error="imageError" contain
                 style="max-width: 60vw; margin:0px auto 2em; max-height: 50vh; "/>
          <span class="exercise__intro" v-if="getCurrentExercise.intro" v-html="getCurrentExercise.intro"></span>
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
  </fullpage-card>

</template>
<script>
import basepage from '~/mixins.js/basepage'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'ExerciseLoader',
  mixins: [basepage],
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
  data() {
    return {
      exid: (this.$route.params.id),
      programid: (this.$route.params.fromprogram || false),
      withindex: (this.$route.params.withindex || -1),
      backto: (this.$route.params.backto || false),
      hasNext: false,
      hasBack: true,
      "hasInfo": false,
      loading: false,
      exerciseThumb: null,
      about: {
        show: false
      },
      deviceInfo: ''
    }
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
    computedDuration() {
      if (this.getCurrentExercise && Array.isArray(this.getCurrentExercise.exercises)) {
        return this.getCurrentExercise.exercises.reduce((carry, exe) => {
          return 0 + (exe.duration || 0);
        }, 0);
      }
      return false;
    },
    estimatedDuration() {
      if (this.getCurrentExercise && this.getCurrentExercise.duration) {
        return this.getCurrentExercise.duration;
      }
      if (this.getCurrentExercise && Array.isArray(this.getCurrentExercise.exercises)) {
        return this.computedDuration;
      }
      return false
    }
  },
  methods: {
    ...mapActions({
      setCurrentExerciseIndex: 'setCurrentExerciseIndex',
      setCurrentExerciseById: 'setCurrentExerciseById',
      setCurrentExerciseByData: 'setCurrentExerciseByData',
      setCurrentUser: 'setCurrentUser',
      setIsGuest: 'setIsGuest',
    }),
    imageError() {
      this.exerciseThumb = require("~/assets/images/errorlogo.png");
    },
    closeInfo() {
      this.about.show = false;
    },
    infoStep() {
      console.log('got info click method [ex]')
      this.about.show = true;
    },
    prevStep() {
      if (this.about.show === true) {
        this.closeInfo();
        return;
      }
      this.exerciseStepBack()
      $nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl));
    },

    nextStep() {
      this.$gtag('event', 'click', {
        'event_label': 'Start',
        'event_category': 'Exercises',
      })
      let suffix = this.buildSuffix().trim();
      if(suffix.length>0) {
        suffix = "/" + suffix
      }
      //Testing finish
      if(false) {
        this.getCurrentExercise.medal = 5;
        this.getCurrentExercise.completed =true;
        this.getCurrentExercise.breathingScore = 50;
        this.$router.push($nuxt.localePath("/ml/greetings/" + this.exid + suffix));
        return;
      }



      console.warn("loading exercise", this.exid, this.exercise.type, suffix, $nuxt.localePath("/ml/exercises/" + this.exid + "/setup" + suffix));
      if (this.exercise.type === this.$exerciseManager.kindRECORDING || this.exercise.type === this.$exerciseManager.kindHOLD) {
        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + "/setup" + suffix));
      } else if (this.exercise.type === this.$exerciseManager.kindAUDIO) {
        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + "/audio" + suffix));
      } else if (this.exercise.type === this.$exerciseManager.kindVIDEO) {
        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + "/video" + suffix));
      } else if (this.exercise.type === this.$exerciseManager.kindPOST) {
        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + "/post" + suffix));
      } else if (this.exercise.type === this.$exerciseManager.kindSURVEY) {
        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + "/survey" + suffix));
      } else if (this.exercise.type === this.$exerciseManager.kindQUIZ) {
        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + "/quiz" + suffix));
      } else {
        console.error("Error loading exercise... kind not Mapped");
        this.$root.$emit('showError', {
          hasretry: true,
          title: "An error has occurred",
          error: "Exercise kind not recognized",
          click: null,
          resetEvent: function () {
            $nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl));
            return true;
          }
        });
      }
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
    console.log('ready to get device info');
    this.$deviceInfo.getInfo().then((r) => {
      this.deviceInfo = r;
      this.$exerciseManager.setDeviceCode(r);
    });

    this.$root.$emit('showPager', {show: true});
    this.hasNext = false;
    console.log('check exercise to load', this.exid);

    if (this.exid) {
      //this.setCurrentExerciseById(this.exid);
      this.retrieveCurrentExerciseAndSet();
      if (this.getCurrentExercise) {
        console.log('ready to load exercise', this.getCurrentExercise)
        this.exerciseThumb = this.getCurrentExercise.thumb;
        this.$analytics.logEvent('exercise_opened', {
          "id": this.getCurrentExercise.id,
          "name": this.getCurrentExercise.title,
          "program_id": this.getCurrentExercise.program_id || null,
          "program_name": this.hasJoinedProgramById(this.getCurrentExercise.program_id) ?
            this.getProgramById(this.getCurrentExercise.program_id).name : null,
          "type": this.getCurrentExercise.type,
        });
        this.$analytics.setScreenName(this.getCurrentExercise.title + " intro page");
        this.$nuxt.$loading.start();
        console.log('loaded exercise');
      } else {
        console.warn('cannot find exercise ', this.exid);
        this.$root.$emit('showToast', this.$t("errors.toasts.cannot_open_exercise"), 'error');
        $nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl));
      }
      this.$nextTick(() => {
        this.hasNext = true;
        this.hasInfo = false;
        this.hasBack = true;
        this.name = "exercisePage";

        this.$root.$emit('showPager', {show: true});
        this.$root.$emit('showOverlay', {show: false});
        this.$nuxt.$loading.finish();
        this.nextStep();
      });
    } else {
      console.warn('cannot find exercise[2] ', this.exid);
      this.$root.$emit('showToast', this.$t("errors.toasts.cannot_open_exercise"), 'error');
      $nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl));
    }

  }
}
</script>
