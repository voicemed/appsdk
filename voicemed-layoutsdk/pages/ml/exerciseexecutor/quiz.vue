<template>
  <fullpage-card
      :class="['quizExercise','card_'+survey.current,'cardtype_'+currentCardType,finish||currentSurveyResult?'finishcard':'',currentSurveyResult?'resultcard':'']">
    <template v-slot:header>
      <div class="percent">{{ overprogress.toFixed(0) }}%</div>
      <v-progress-linear :value="overprogress" height="6"></v-progress-linear>
    </template>
    <template v-slot:body>
      <div class="survey__exercise__container">
        <v-tabs-items v-model="survey.current" v-if="loaded">
          <v-tab-item
              v-for="(question,idx) in getCurrentExercise.quiz.questions"
              :key="idx"
          >
            <div :class="['survey_card', 'card_'+idx]" v-if="question.type&&question.type==='radio'">
              <div class="titles">
                <h2 v-if="question.title">{{ question.title }}</h2>
                <h3>{{ question.question }}</h3>
              </div>
              <!--<h5>[Current: {{ survey.current }}, Prev: {{ survey.prev }}, Next:{{ survey.next }}]</h5>-->
              <div class="survey_options">
                <v-radio-group v-model="survey.replies[idx]">
                  <v-radio value="Google" v-for="option in question.options" :value="option.key"
                           @click="checkOptionTag(option)"
                           :data-value="option.key">
                    <template v-slot:label>
                      <div v-html="option.text"></div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </div>
            </div>
            <div class="survey_card screen" v-else-if="question.type&&question.type==='screen'">
              <!--<h5>[Current: {{ survey.current }}, Prev: {{ survey.prev }}, Next:{{ survey.next }}]</h5>-->
              <v-img v-if="question.thumbnail" :src="question.thumbnail"></v-img>
              <div class="subtitles_alone">
                <h2 v-if="question.title">{{ question.title }}</h2>
                <h3 v-if="question.question">{{ question.question }}</h3>
              </div>
              <div v-html="question.screenContent" class="withdynamicTexts"></div>
            </div>
            <div class="survey_card text"
                 v-else-if="question.type&&(question.type==='open'||question.type==='openext')">
              <div class="titles">
                <h2 v-if="question.title">{{ question.title }}</h2>
                <h3>{{ question.question }}</h3>
              </div>
              <div class="survey_options">
                <v-textarea v-if="question.type==='open'"
                            auto-grow
                            rows="1"
                            row-height="15"
                            v-model="survey.replies[idx]"
                            outlined
                ></v-textarea>
                <v-textarea outlined v-model="survey.replies[idx]"
                            auto-grow
                            rows="1"
                            row-height="15"
                            v-if="question.type==='openext'"></v-textarea>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item >
            <div class="survey_card screen finalResult" v-if="currentSurveyResult">
              <v-img v-if="currentSurveyResult.thumbnail" :src="currentSurveyResult.thumbnail"></v-img>
              <div class="subtitles_alone">
                <h2 v-if="currentSurveyResult.title">{{ currentSurveyResult.title }}</h2>
                <h3 v-if="currentSurveyResult.question">{{ currentSurveyResult.question }}</h3>
              </div>
              <div v-html="currentSurveyResult.screenContent" class="withdynamicTexts"></div>
            </div>
          </v-tab-item>

        </v-tabs-items>


      </div>
    </template>
    <template v-slot:footer>
      <div class="pager">
        <transition name="fade" appear>
          <v-btn
              color="backvm"
              text
              nuxt
              @click="prevStep"
              v-if="!currentSurveyResult"
          >
            <span>{{ $t('generic.back') }}</span>
          </v-btn>
        </transition>
        <v-spacer class="spacer" v-if="!currentSurveyResult"/>
        <transition name="fade" appear>
          <v-btn
              color="nextvm"
              :loading="nuxtloading"
              @click="nextStep"
              class="nextvm"
              :disabled="repliedQuestion()"
          >
            <span>{{ $t('generic.next') }}</span>
          </v-btn>
        </transition>
      </div>
    </template>
  </fullpage-card>
</template>
<script>
import basepage from "~/mixins.js/exercisepage";
import {mapActions, mapGetters} from 'vuex'
import {Wave} from "@foobar404/wave";

export default {
  name: 'quizPlayer',
  mixins: [basepage],
  data() {
    return {
      currentSurveyResult: null,
      survey: {
        progress: 0,
        total: 0,
        current: 0,
        replies: {},
        points: {},
        next: -1,
        prev: [],
        tags: {},
        results: []
      },
      finish: false,
      success: false,
      challenges: {
        requested: false,
        list: [],
        challengeprogress: 0
      },
      exid: (this.$route.params.id),
      programid: (this.$route.params.fromprogram || false),
      withindex: (this.$route.params.withindex || false),
      backto: (this.$route.params.backto || false),
      name: "postPlayer",
      exerciseThumb: null,
      loaded: false,
      ended: false,
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
  watch: {
    "survey.current": function () {
      console.log('change current Question');
      this.survey.next = -1; //Reset next on each change
      if (this.survey.current === 0) {
        this.$set(this.survey, 'prev', []);
      }
      const cQuestion = this.getCurrentExercise.quiz.questions[this.survey.current];
      if (cQuestion) {
        let isScreen = (cQuestion.type && (cQuestion.type === 'screen')) ? true : false;
        let isText = (cQuestion.type && (cQuestion.type === 'open' || cQuestion.type === 'openext')) ? true : false;

        if (this.survey.replies[this.survey.current]) {
          //Check if there is a reply, if yes, ensure next & tag:
          if (isScreen) {
            this.survey.replies[this.survey.current] = true;
          } else if(isText){
            //Dont' touch value
          } else {
            const _options = cQuestion.options.find((v) => v.key === this.survey.replies[this.survey.current]);
            console.log('got picked option', _options);
            if (_options.next) {
              this.survey.next = _options.next;
            }
            if (_options.tag) {
              this.survey.tags[this.survey.current] = _options.tag;
            }
            if (_options.points) {
              this.survey.points[this.survey.current] = _options.points;
            }
          }
        }
        if ((isScreen||isText) && cQuestion.next) {
          this.survey.next = cQuestion.next
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      getCurrentUser: 'getCurrentUser',
      getExercises: 'getExercises',
      getCurrentExercise: 'getCurrentExercise',
      isCurrentUserGuest: 'isCurrentUserGuest'
    }),
    welcomeImage() {
      return _welcomeImage;
    },
    challengeImage() {
      return _challengeImage;
    },

    currentCardType() {
      if (!this.getCurrentExercise) {
        return null
      }
      if (!this.getCurrentExercise.quiz) {
        return null;
      }
      if (this.survey.current >= this.getCurrentExercise.quiz.length) {
        return null;
      }
      const _q = this.getCurrentExercise.quiz.questions[this.survey.current];
      if (_q && _q.type) {
        return _q.type;
      }
      return "radio"
    },
    overprogress() {
      return this.survey.current / this.survey.total * 100;
    },
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

    checkOptionTag(option) {
      console.log('got option pick:', option);
      if (option.tag) {
        this.survey.tags[this.survey.current] = option.tag;
      } else {
        this.survey.tags[this.survey.current] = false;
      }
      if (option.points) {
        this.survey.points[this.survey.current] = option.points;
      } else {
        this.survey.points[this.survey.current] = 0;
      }
      if (option.next) {
        this.survey.next = option.next
      } else {
        this.survey.next = -1
      }
    },
    repliedQuestion() {
      if(this.currentSurveyResult) {
        return false;
      }
      const cQuestion = this.getCurrentExercise.quiz.questions[this.survey.current];
      if (cQuestion) {
        let isScreen = (cQuestion.type && (cQuestion.type === 'screen')) ? true : false;
        if (isScreen) {
          //Screen question never block flow
          return false;
        }
      }
      if (typeof this.survey.replies[this.survey.current] === "undefined") {
        return true
      }
      return false;
    },
    prevStep() {
      if (this.survey.prev.length > 0) {
        this.survey.current = this.survey.prev.pop();
        return;
      }
      if (this.survey.current > 0) {
        this.survey.current -= 1;
        return
      }
      this.exitClick();
    },
    nextStep() {
      this.survey.prev.push(this.survey.current);
      console.log('ready to move Next', this.survey.next)
      if(this.survey.next !== -2) {
        if (this.survey.next > -1 && this.survey.next <= this.survey.total - 1) {
          //Set current as index in next:
          console.log('check passed', this.survey.next)
          if (this.currentCardType === 'screen') {
            this.survey.replies[this.survey.current] = true;
          }
          const preserveNext = this.survey.next;
          console.log('set next as ', preserveNext)
          this.survey.current = preserveNext;
          return;
        }
        if (this.survey.current < this.survey.total - 1) {
          this.survey.current += 1;
          return;
        }
      }

      const earnPoints = Object.keys(this.survey.points).reduce((carry, key) => {
        return carry + this.survey.points[key];
      }, 0);

      console.log('ready to compute points: ', earnPoints,this.survey.results);
      if (this.survey.results && this.survey.results.length > 0 &&!this.currentSurveyResult) {
        let resultToShow = null;
        for(let i =0;i<this.survey.results.length;i++) {
          const item = this.survey.results[i];
          if(earnPoints>=item.pointRange.max) {
            resultToShow = item;
            break;
          }
        }
        console.log('found result?', resultToShow)
        if (resultToShow) {
          this.currentSurveyResult = resultToShow;
          this.survey.current += 1;
          this.$nextTick(()=>{
            this.$root.$emit('showBack', false);
          })
          return;
        }
      }


      if (this.isCurrentUserGuest) {
        this.getCurrentExercise.completed = true;
        this.$root.$emit('completedExercise', this.getCurrentExercise);
        this.$nextTick(() => {
          this.$root.$emit('showPager', {"show": false});
          let suffix = this.buildSuffix();
          if (suffix.length > 0) {
            suffix = "/" + suffix
          }
          this.$router.push($nuxt.localePath("/ml/greetings/" + this.exid + suffix));
        });
        return;
      }

      let passed = false;
      const additionalData = {
        quizAnswers: {},
        questionnaireTags: {},
        earnPoints: earnPoints
      }
      Object.keys(this.survey.replies).forEach((questionIndex) => {
        let tmpQ = this.getCurrentExercise.quiz.questions[parseInt(questionIndex)];
        if (!tmpQ) {
          return;
        }
        if (tmpQ.type === 'open' || tmpQ.type === 'openext') {
          additionalData.quizAnswers[questionIndex] = (this.survey.replies[questionIndex])
        } else if (tmpQ.type === 'screen') {
          additionalData.quizAnswers[questionIndex] = (true)
        } else {
          const reply = tmpQ.options.find((item) => item.key == this.survey.replies[questionIndex])
          if (reply) {
            additionalData.quizAnswers[questionIndex] = (reply)
          } else {
            //If question was skipped...
            additionalData.quizAnswers[questionIndex] = (null);
          }
        }
      })


      Object.keys(this.survey.tags).forEach((questionIndex) => {
        let tmpQ = this.survey.tags[questionIndex]
        if (!tmpQ) {
          return;
        }
        let _found = typeof additionalData.questionnaireTags[tmpQ] !== 'undefined' ? additionalData.questionnaireTags[tmpQ] : 0;
        _found += 1;
        additionalData.questionnaireTags[tmpQ] = _found;
      })

      console.log('ready to send quest replies', additionalData.quizAnswers, additionalData.questionnaireTags);
      this.$exerciseManager.completeExercise(this.getCurrentExercise, null, null, additionalData).then((r) => {
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
            if (suffix.length > 0) {
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
      console.log('ready for exercise..', this.getCurrentExercise)
      if (this.getCurrentExercise.quiz.questions && Array.isArray(this.getCurrentExercise.quiz.questions)) {
        this.survey.total = this.getCurrentExercise.quiz.questions.length;
        this.survey.progress = 0;
        this.survey.current = 0;
        this.survey.next = -1;
        this.survey.prev = [];
        if (this.getCurrentExercise.quiz.pointBasedResult) {
          this.survey.results = this.getCurrentExercise.quiz.pointBasedResult.map((item) => {
            console.log('map me',item, item.pointRange)
            if (item.pointRange) {
              if (typeof item.pointRange.min === 'undefined') {
                item.pointRange.min = 0;
              }
              if (typeof item.pointRange.max === 'undefined') {
                item.pointRange.max = 0;
              }
              if (item.pointRange.max === null) {
                item.pointRange.max = 0;
              }
              if (item.pointRange.min === null) {
                item.pointRange.min = 0;
              }
              if (item.pointRange.min) {
                item.pointRange.min = parseInt(item.pointRange.min)
              } else {
                item.pointRange.min = 0;
              }
              if (item.pointRange.max) {
                item.pointRange.max = parseInt(item.pointRange.max)
              } else {
                item.pointRange.max = 0;
              }

            }
            return item
          })
          //sort point based results:
          this.survey.results.sort(function(a, b) {
            return parseFloat(b.pointRange.max) - parseFloat(a.pointRange.max);
          });
          //Go sorted result.
        }
        this.loaded = true;
      } else {
        this.$root.$emit('showToast', $nuxt.$t('errors.global.msg_noquestions'), 'error');
        console.warn('cannot find exercise ', this.exid);
        this.exerciseStepBack()
      }
    },
    handleBack() {
      console.log('got backbutton');
      this.prevStep()
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
    //window.testPP = this;
    if (this.$capacitor && this.$capacitor.isNativePlatform()) {
      this.$backEmitter.callback = this.handleBack;
    }
    if (this.exid) {
      this.retrieveCurrentExerciseAndSet();
      if (this.getCurrentExercise) {
        this.init()
      } else {
        console.warn('cannot find exercise ', this.exid);
        this.exerciseStepBack()
      }
      this.$nextTick(() => {
        this.name = "quizPlayer";
        this.hasNext = false;
        this.hasInfo = false;
        this.hasBack = false;
        this.$root.$emit('showPager', {show: false});
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
        this.$analytics.setScreenName(this.getCurrentExercise.title + " survey page");
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
