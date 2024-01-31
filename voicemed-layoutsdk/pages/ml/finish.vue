<template>
  <fullpage-card
    :class="['center-title no-header finishcard v2',((breathingScoreShow || getCurrentExercise.type==$exerciseManager.kindHOLD)?'withRecord':'noRecord')]"
    :hiddehheader="true" v-if="currentProgram">
    <template v-slot:body>
      <div class="headerLine">
        <v-btn icon class='finish-close-btn' @click="quitStep">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <div class="middle-title" v-if="!isCurrentUserGuest">
          <div class="exerciseInfo">
            <span v-html="getCurrentExercise.title"></span>
          </div>
          <!--
          <div class="inprogramInfo"
               v-if="hasJoinedProgramById(programid)">
            {{ getDoneCountByProgramData(currentProgram) }}&nbsp;{{ $t('generic.of') }}&nbsp;{{
              currentProgram.exercises.length
            }}
          </div>
          -->
        </div>
        <v-btn icon class='finish-close-btn' @click="quitStep" style="opacity: 0">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </div>


      <div class="coverImage">&nbsp;</div>
      <div :class="['recordtitle','ext_'+getCurrentExercise.type]"
           v-if="breathingScoreShow || getCurrentExercise.type==$exerciseManager.kindHOLD ">
        <div class="circles">
          <div class="circle one">&nbsp;</div>
          <div class="circle two">&nbsp;</div>
          <div class="circle three">&nbsp;</div>
        </div>
        <v-img :src="relaxingFinish" v-if="getCurrentExercise.type!=$exerciseManager.kindRECORDING"></v-img>
        <div :class="['star big animated faded',breathingClass]" v-if="breathingScoreShow"></div>
        <div class="cardtitle">
          <div class="title">
            {{ $t('ml_finish.title_' + breathingClass) }}
          </div>
        </div>
      </div>


      <div class="records"
           v-if="breathingScoreShow || getCurrentExercise.type==$exerciseManager.kindHOLD ">
        <div :class="['score animated screenAnimation',breathingClass]"
             v-if="breathingScoreShow">
          <div class="screenAnimation_inner"
               v-html="$t(getCurrentExercise.subtype==='dob'?'ml_finish.breathingstamina':'ml_finish.breathescore')"></div>
          <div class="screenAnimation_inner scorevalue">{{ breathingScore }}<span class="secondaryunit">/100</span>
          </div>
          <div class="screenAnimation_inner alone" v-if="breathingScoreShow" @click="openScoreDialog">
            {{ $t('ml_finish.score_explaination_cta') }}
          </div>

        </div>
        <!--
        <div class="score"
             v-if="getCurrentExercise.type==$exerciseManager.kindRECORDING && getCurrentExercise.breathingTime">
          <div>{{$t('ml_finish.breathingtime')}}</div>
          {{ formatSeconds(getCurrentExercise.breathingTime||0) }}<span class="secondaryunit">s</span>
        </div>
        -->
        <div class="score animated screenAnimation"
             v-if="getCurrentExercise.type==$exerciseManager.kindHOLD && getCurrentExercise.exerciseInfo">
          <div class="screenAnimation_inner"
               v-html="$t(getCurrentExercise.subtype==='dob'?'ml_finish.breathingstamina':'ml_finish.breathingholdtimeaverage')"></div>
          <div class="screenAnimation_inner scorevalue">
            {{ formatSeconds(getCurrentExercise.exerciseInfo.averageHeldTime || 0) }}<span
            class="secondaryunit">{{ $t('generic.unit_seconds_short') }}</span></div>
        </div>
      </div>
      <div v-else class="norecords animated faded">
        <div class="circles">
          <div class="circle one">&nbsp;</div>
          <div class="circle two">&nbsp;</div>
          <div class="circle three">&nbsp;</div>
        </div>
        <v-img :src="relaxingFinish"></v-img>
        <div class="cardtitle">
          <div class="title">
            {{ $t('ml_finish.title_' + breathingClass) }}
          </div>
        </div>
      </div>

      <!--
      <div v-if="breathingScoreShow&&breathingScore<=50"
           class="hintbox fromAbove animated faded">
        <v-icon>$idea</v-icon>
        <div class="text__content">
          <h3>{{ $t('ml_finish.hintbox_title_' + (breathingScore > 0 ? 'improve' : 'zero')) }}</h3>
          <p v-html="$t('ml_finish.hintbox_desc_'+(breathingScore>0?'improve':'zero'))"></p>
        </div>
      </div>
      -->
      <div class="guestmessage">
        <div class="" v-if="isCurrentUserGuest" v-html="$t('ml_finish.guest_finish_message')"></div>
        <div
          v-else-if="getCurrentExercise.type!=$exerciseManager.kindHOLD&&getCurrentExercise.type!=$exerciseManager.kindRECORDING"
          v-html="$t('ml_finish.client_finish_message')">
        </div>
      </div>

      <div :class="['guestbox fromAbove animated faded',breathingClass]" v-if="isCurrentUserGuest">
        <v-list-item @click="openRegister">
          <v-list-item-avatar>
            <v-icon>$unlockguest</v-icon>
          </v-list-item-avatar>
          <v-list-item-title v-html="$t('ml_finish.registercta_v2')">
          </v-list-item-title>
        </v-list-item>
      </div>
      <!-- Next Exercise box
      <div v-if="getNextExerciseByProgramData(currentProgram,getCurrentExercise)&&!isCurrentUserGuest">
        <div class="programbox inner fromAbove animated faded">
          <div class="section_title">{{ $t('ml_finish.nextexercise') }}:</div>
          <div class="exerciss items_list program_exercises">
            <exercisecard
              :exercise="getNextExerciseByProgramData(currentProgram,getCurrentExercise)" :index="0"
              @click="pickProgramExercise"></exercisecard>
          </div>
        </div>
      </div>
      -->
      <!--
      <div
        v-if="getPrograms&&getPrograms.length>0&&hasJoinedProgramById(programid)&&!isCurrentUserGuest">
        <div class="programbox inner fromAbove animated faded">
          <div class="section_title">
            {{ $t('ml_finish.improvewithprogram') }}
            <span class="sub">{{ $t('ml_finish.improvewithprogram_sub') }}</span>
          </div>
          <div class="programs items_list">
            <programcard :program="getPrograms[0]" :index="0" @click="pickProgram"></programcard>
          </div>
        </div>
      </div>
      -->
    </template>
    <template v-slot:footer>
      <transition class="fade">
        <v-btn
          color="backvm"
          text
          nuxt
          @click="backStep"
        >
          <!--
                    <template v-if="getNextExerciseByProgramId(programid,getCurrentExercise)&&!isCurrentUserGuest">
                      <v-icon>mdi-close</v-icon>
                      {{ $t('generic.close') }}
                    </template>
                    <template v-else>
                      <v-icon>mdi-reload</v-icon>
                      {{ $t('generic.redo') }}
                    </template>
          -->
          <v-icon>mdi-reload</v-icon>
          {{ $t('generic.redo') }}
        </v-btn>
      </transition>
      <v-spacer/>
      <transition class="fade">
        <v-btn
          color="nextvm"
          class="nextController"
          @click="nextStep"
        >
          <template v-if="getNextExerciseByProgramData(currentProgram,getCurrentExercise)&&!isCurrentUserGuest">
            {{ $t('generic.next') }}&nbsp;
          </template>
          <template v-else-if="getNextExerciseByProgramData(currentProgram,getCurrentExercise)&&!isCurrentUserGuest">
            <span v-html="$t('generic.next_program')"></span>
            <span>→</span>
          </template>
          <template v-else>
            {{ $t('generic.done_arrow') }}&nbsp;
          </template>
        </v-btn>
      </transition>
      <v-dialog
        v-model="scoreDialog.show"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
        content-class="scoreDialog">
        <fullpage-card>
          <template v-slot:header>
            <v-btn icon @click="closeScoreDialog" class="closebtn">
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </template>
          <template v-slot:body class="text-center">
            <div class="cardtitle"
                 v-html="$t(getCurrentExercise.subtype==='dob'?'ml_finish.breathingstaminaexplaination':'ml_finish.howisscorecalculated')"></div>
            <div class="records">
              <div class="score "
                   v-if="breathingScoreShow">
                <div>{{ getCurrentExercise.breathingScore || 0 }}/100</div>
                <div class="scoreBar">
                  <span :style="'width:'+(getCurrentExercise.breathingScore || 0)+'%;'"></span>
                </div>
              </div>
            </div>

            <div v-if="(getCurrentExercise.breathingScore || 0)>0" class="explainations"
                 v-html="$t(getCurrentExercise.subtype==='dob'?'ml_finish.scoreexplainationdob':'ml_finish.scoreexplaination')"></div>

            <div class="explainationstab zeroresult" v-if="(getCurrentExercise.breathingScore || 0)<1">
              <div class="content">
                <div v-html="$t('ml_finish.zeroscore_description')">

                </div>
                <div class="actions">
                  <v-btn
                    color="backvm"
                    text
                    nuxt
                    @click="backStep"
                  >
                    <!--
                              <template v-if="getNextExerciseByProgramId(programid,getCurrentExercise)&&!isCurrentUserGuest">
                                <v-icon>mdi-close</v-icon>
                                {{ $t('generic.close') }}
                              </template>
                              <template v-else>
                                <v-icon>mdi-reload</v-icon>
                                {{ $t('generic.redo') }}
                              </template>
                    -->
                    <v-icon>mdi-reload</v-icon>
                    {{ $t('generic.redo') }}
                  </v-btn>
                  <v-btn
                    color="nextvm"
                    class="nextController"
                    @click="contactUsStep"
                  >{{ $t('generic.contactus') }}</v-btn>
                </div>
              </div>
            </div>
            <div class="explainationstab dob" v-else-if="getCurrentExercise.subtype=='dob'">
              <div class="content">
                <div v-html="$t('ml_finish.dobscore_description')">

                </div>
              </div>

            </div>
            <div class="explainationstab " v-else>
              <div class="header">
                <div v-for="item in breathscores" :key="item.key" :class="['header__item',item.active?'active':'']"
                     @click="updateActiveItem(item.key)">
                  <v-img :src="item.img"></v-img>
                  <div class='title' v-text="$t('ml_finish.'+item.key)"></div>
                  <div class="subtitle">{{ getCurrentExercise[item.key] || 0 }}</div>
                </div>
              </div>
              <div class="content">
                <div v-for="item in breathscores" :key="item.key" :class="['content__item',item.active?'active':'']"
                     v-html="$t('ml_finish.'+item.key+'_desc')">

                </div>
              </div>
            </div>
          </template>
        </fullpage-card>
      </v-dialog>

    </template>
  </fullpage-card>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'

const timeScoreImg = require('~/assets/images/timeScore.png');
const flowScoreImg = require('~/assets/images/flowScore.png');
const cyclesScoreImg = require('~/assets/images/cyclesScore.png');
const welldoneImage = require('~/assets/images/finishimage.png');
const boxFromBottom = {
  targets: ".fromAbove",
  translateY: ['+10%', '0%'],
  opacity: [0, 1],
  easing: 'easeInOutQuad',
  duration: 500
};
const screenAnimation = {
  targets: ".screenAnimation",
  scaleY: ['5px', '5%'],
  scaleX: ['5px', '5%'],
  opacity: [0, 1],
  easing: 'easeInOutQuad',
  duration: 500
};
const screenAnimation2 = {
  targets: ".screenAnimation",
  scaleY: ['5px', '5%'],
  scaleX: ['5px', '100%'],
  easing: 'easeInOutQuad',
  duration: 300
};
const screenAnimation3 = {
  targets: ".screenAnimation",
  scaleY: ['5px', '100%'],
  easing: 'easeInOutQuad',
  duration: 300
};
const screenAnimation4 = {
  targets: ".screenAnimation_inner",
  opacity: [0, 1],
  easing: 'easeInOutQuad',
  duration: 300
};
const disclosureAnimation = {
  targets: ".coverImage",
  translateY: ['0%', '-100%'],
  easing: 'easeInOutQuad',
  duration: 1500
}
const circleFading = {
  targets: ".circle",
  opacity: [0, 1],
  easing: 'easeInOutQuad',
  duration: 800,
  loop: false
};
const circlesFading = {
  targets: ".circle",
  opacity: [1, 0],
  easing: 'easeInOutQuad',
  duration: 1200,
  loop: false
};


export default {
  beforeRouteLeave(to, from, next) {
    next();
  },
  data() {
    return {
      exid: (this.$route.params.fromexercise),
      programid: (this.$route.params.fromprogram || false),
      withindex: (this.$route.params.withindex || false),
      backto: (this.$route.params.backto || false),
      scoreDialog: {
        show: false
      },
      breathscores: [
        {'key': "flowScore", 'active': true, 'img': flowScoreImg},
        {'key': "timeScore", 'active': false, 'img': timeScoreImg},
        {'key': "cyclesScore", 'active': false, 'img': cyclesScoreImg}
      ],
      breathscoresVoices: [
        {'key': "flowScore", 'active': true, 'img': flowScoreImg},
        {'key': "timeScore", 'active': false, 'img': timeScoreImg},
        {'key': "cyclesScore", 'active': false, 'img': cyclesScoreImg}
      ],
      currentProgram: null
    }
  },
  computed: {
    ...mapGetters({
      getExercises: 'getExercises',
      getCurrentExercise: 'getCurrentExercise',
      getCurrentUser: 'getCurrentUser',
      isCurrentUserGuest: 'isCurrentUserGuest',
      doneExercices: 'doneExercices',
      getPrograms: 'getPrograms'
    }),
    relaxingFinish() {
      return welldoneImage;
    },
    breathingScore() {
      if (!this.getCurrentExercise) {
        return 0
      }
      if (typeof this.getCurrentExercise.breathingScore === 'undefined') {
        return 0
      }
      return parseInt(this.getCurrentExercise.breathingScore);
    },
    medalScore() {
      if (!this.getCurrentExercise) {
        return 0
      }
      if (typeof this.getCurrentExercise.medal === 'undefined') {
        return 0
      }
      return parseInt(this.getCurrentExercise.medal);
    },
    breathingScoreShow() {
      if (this.getCurrentExercise.type == this.$exerciseManager.kindRECORDING) {
        //if (typeof this.getCurrentExercise.subtype !== 'undefined' && this.getCurrentExercise.subtype !== null) {
        return true;
        //}
      }
      return false;
    },
    breathingClass() {
      if (this.medalScore) {
        if (this.medalScore === 5) {
          return "medal_gotzero";
        } else if (this.medalScore === 4) {
          return "medal_improve";
        } else if (this.medalScore === 3) {
          return "medal_bronze";
        } else if (this.medalScore === 2) {
          return "medal_silver";
        } else if (this.medalScore === 1) {
          return "medal_gold";
        }
      }
      if (!this.breathingScoreShow) {
        return "medal_gold";
      }
      const iBs = this.breathingScore
      if (iBs > 50) {
        /*Hot fix with Claire ? greater or equal or only greater */
        if (iBs > 85) {
          return "medal_gold";
        }
        if (iBs > 70) {
          return "medal_silver";
        }
        return "medal_bronze";
      } else if (iBs > 0) {
        return "medal_improve";
      }
      return "medal_gotzero";
    },
  },
  mounted() {
    if (this.$capacitor && this.$capacitor.isNativePlatform()) {
      this.$backEmitter.callback = this.handleBack;
    }
    if (this.getCurrentPagerHeight !== null && document.querySelector('div.finishcard > div.footer')) {
      document.querySelector('div.finishcard > div.footer').style.height = this.getCurrentPagerHeight + "px";
      document.querySelector('div.finishcard > div.footer').style.maxHeight = this.getCurrentPagerHeight + "px";
    }

    let programIDcheck = -1;
    if (this.programid !== false && this.programid != 'false' && this.programid != '-1' && this.programid != -1) {
      programIDcheck = this.programid;
    } else {
      programIDcheck = this.getCurrentExercise.program_id;
    }

    const _retrieveJoinAtProgram = this.getProgramJoinedAtById(programIDcheck)
    if (_retrieveJoinAtProgram) {
      console.log('[reloading] finish start', this.getCurrentExercise);
      this.$root.$emit('showPager', {"show": false});
      this.$nextTick(() => {
        this.$root.$emit('showPager', {"show": false});
      });
      //For joined programs:
      console.log('start requesting program info')
      this.$exerciseManager.fillProgramById(programIDcheck).then((programData) => {
        console.log('received program info')
        programData.id = programIDcheck;
        //this.setProgramByData(programData);
        if (programData) {
          programData.joinedAt = _retrieveJoinAtProgram;
          //Store also the setJoined:
          if (this.hasJoinedProgramById(programData.id)) {
            this.setJoinedProgram({'localprogram': programData, 'remoteprogram': programData})
          } else {
            this.addJoinedProgram({'localprogram': programData, 'remoteprogram': programData})
          }
          this.currentProgram = programData
        }
      }).finally(() => {
        console.log('finish start [with new program readed]', this.getCurrentExercise);
        this.$root.$emit('showPager', {"show": false});
        this.$nextTick(() => {
          this.$root.$emit('showPager', {"show": false});
          this.animeWorld();
        });
        console.log('finish ready', this.getCurrentExercise);
      })
    } else {
      console.log('no joined program - finish start')
      if (programIDcheck !== false && programIDcheck != 'false' && programIDcheck != '-1' && programIDcheck != -1) {
        this.$exerciseManager.fillProgramById(programIDcheck).then((programData) => {
          console.log('received program info')
          programData.id = programIDcheck;
          //this.setProgramByData(programData);
          if (programData) {
            this.currentProgram = programData
          }
        }).finally(() => {
          console.log('[no joined]finish start [with new program readed]', this.getCurrentExercise);
          this.$root.$emit('showPager', {"show": false});
          this.$nextTick(() => {
            this.$root.$emit('showPager', {"show": false});
            this.animeWorld();
          });
          console.log('[no joined]finish ready', this.getCurrentExercise);
        })
      } else {
        this.currentProgram = this.getProgramById(this.getCurrentExercise.program_id);
        console.log('[no program]finish start [with base program checked]', this.getCurrentExercise, this.currentProgram);
        if (null == this.currentProgram) {
          console.warn("set fake program for current checks")
          this.currentProgram = {
            "_id": this.getCurrentExercise.program_id,
            "id": this.getCurrentExercise.program_id,
            "exercises": []
          };
        }
        this.$root.$emit('showPager', {"show": false});
        this.$nextTick(() => {
          this.$root.$emit('showPager', {"show": false});
          this.animeWorld();
        });
        console.log('[no program]finish ready', this.getCurrentExercise);
      }
    }
    //window.testPP = this;
  },
  methods: {
    ...mapActions({
      addDoneExercise: 'addDoneExercise',
      addJoinedProgram: 'addJoinedProgram',
      setJoinedProgram: 'setJoinedProgram'
    }),
    updateActiveItem(w) {
      this.breathscores.forEach((item) => {
        if (item.key !== w) {
          item.active = false;
        } else {
          item.active = true;
        }
      });
    },
    animateCircle() {
      //fix circle height: circle
      const _circleAnimationOne = circleFading;
      const _circleAnimationTwo = circleFading;
      const _circleAnimationThree = circleFading;
      const _circleAnimation = circlesFading;
      _circleAnimation.delay = 800;
      _circleAnimation.loop = false;
      _circleAnimation.complete = function (anim) {
        circleAnime.restart();
      }
      const circleAll = this.$anime(_circleAnimation);
      _circleAnimationOne.targets = ".circle";
      _circleAnimationOne.delay = this.$anime.stagger(1500, {direction: 'reverse'});
      _circleAnimationOne.loop = false;
      _circleAnimationOne.complete = function (anim) {
        circleAll.play();
      }

      const circleAnime = this.$anime(_circleAnimationOne);
      circleAnime.play()
    },
    getProgramJoinedAtById(id) {
      return this.$nuxt.$store.getters.getProgramJoinedAtById(id)
    },
    hasJoinedProgramById(id) {
      return this.$nuxt.$store.getters.hasJoinedProgramById(id)
    },
    getProgramById(id) {
      return this.$nuxt.$store.getters.getProgramById(id)
    },
    getDoneCountByProgramData(data) {
      return this.$nuxt.$store.getters.getDoneCountByProgramData(data)
    },
    getNextExerciseByProgramData(programdata, exercise) {
      return this.$nuxt.$store.getters.getNextExerciseByProgramData(programdata, exercise)
    },
    handleBack() {
      if (this.scoreDialog.show) {
        this.closeScoreDialog();
      }
      return;
    },
    closeScoreDialog() {
      this.scoreDialog.show = false
    },
    openScoreDialog() {
      this.scoreDialog.show = true
    },
    getRunningProgramDoneCount() {
      if (this.currentProgram) {
        return this.getDoneCountByProgramData(this.currentProgram)
      }
      return 0
    },
    pickProgram(item) {
      $nuxt.$router.push($nuxt.localePath("/ml/programs/" + item.id));
    },
    pickProgramExercise(item) {
      console.log('picked program exercise', item);
      $nuxt.$router.push($nuxt.localePath("/ml/exercises/" + item.id + "/" + item.program_id + "/" + item.program_index));
    },
    moveNextProgram(program) {
      $nuxt.$router.push($nuxt.localePath("/ml/programs/" + program.id));
    },
    formatSeconds(seconds) {
      return this.$humanizeTimeNoSuffix(seconds);
    },
    animeWorld() {
      this.$analytics.logEvent('exercise_completed', {
        "id": this.getCurrentExercise.id,
        "name": this.getCurrentExercise.title,
        "program_id": this.getCurrentExercise.program_id || null,
        "type": this.getCurrentExercise.type,
      })
      const cardAnimation = boxFromBottom;
      const inCardAnime1 = screenAnimation;
      const inCardAnime2 = screenAnimation2;
      const inCardAnime3 = screenAnimation3;
      const inCardAnime4 = screenAnimation4;
      let coverAnimation = disclosureAnimation;
      cardAnimation.delay = this.$anime.stagger(300, {start: 200});
      //inCardAnime1.delay = this.$anime.stagger(300, {start: 200});

      cardAnimation.autoplay = false;
      coverAnimation.delay = 500;
      let subAnimPlay = false;
      const cardAnims = this.$anime(cardAnimation);
      const inCardAnimes = this.$anime.timeline({
        easing: 'easeOutExpo',
        duration: 750,
        autoplay: false
      });
      inCardAnimes.delay = this.$anime.stagger(300, {start: 200});
      inCardAnimes.add(inCardAnime1);
      inCardAnimes.add(inCardAnime2);
      inCardAnimes.add(inCardAnime3);
      inCardAnimes.add(inCardAnime4);

      coverAnimation.update = (anim) => {
        if (anim.progress >= 60 && subAnimPlay === false) {
          subAnimPlay = true;
          [...document.querySelectorAll('.faded')].map((i) => i.classList.remove('faded'));
          cardAnims.play()
          inCardAnimes.play();
        }
      }
      this.$anime(coverAnimation);
      this.animateCircle();

    },
    ensureProgramCompleted() {
      if (this.currentProgram.exercises.length === this.getDoneCountByProgramData(this.currentProgram)) {
        console.log('Challenge completed... mark as completed out side the challenge page')
        this.$exerciseManager.programCompleteCurrent(this.currentProgram.id).then((r) => {
          console.log('Sent program complete', r)
        }).catch((e) => {
          console.error("Cannot send program complete", e)
        })
      }
    },
    exerciseStepBack() {
      if (this.backto == 'today') {
        this.ensureProgramCompleted()
        $nuxt.$router.replace($nuxt.localePath("/user/today"));
        return
      }
      if (this.backto == 'discovery') {
        this.ensureProgramCompleted()
        $nuxt.$router.replace($nuxt.localePath("/home"));
        return
      }
      if (this.programid) {
        if (this.programid == "-1" || this.programid == -1 || this.programid == "false" || this.programid == false) {
          $nuxt.$router.replace($nuxt.localePath("/user/today"));
        } else {
          $nuxt.$router.replace($nuxt.localePath("/ml/programs/" + this.programid));
        }
        return
      }
      this.ensureProgramCompleted()
      $nuxt.$router.replace($nuxt.localePath("/user/today"));
    },
    buildSuffix() {
      let suffixes = [];
      suffixes.push(this.programid ? this.programid : false)
      suffixes.push(this.withindex ? this.withindex : "-1")
      suffixes.push(this.backto ? this.backto : false)
      return suffixes.join("/")
    },
    openRegister() {
      //Vai a registrati...
      console.warn("user is guest, move to register");
      this.$auth.logout().then((r) => {
        console.log('logged out', r);
        this.setRunningProgram(null)
        this.setCurrentUser({})
        this.setIsGuest(false)
        this.$axiosService.$clearCache();
      }).catch((r) => {
        console.error('cannot logout', r);
      }).finally(() => {
        $nuxt.$router.push($nuxt.localePath("/user/signup") + "/0");
      });
      console.log('devi essere autenticato...');
    },
    contactUsStep() {
      //OPen : https://airlyn.io/contact-us/
      this.$browser.open({url: "https://airlyn.io/contact-us/"});
    },
    prevStep() {
      console.log('got something about back button?');
    },
    quitStep() {
      this.exerciseStepBack()
    },
    backStep() {
      let suffix = this.buildSuffix();
      if (suffix.length > 0) {
        suffix = "/" + suffix
      }
      if (this.exid) {
        this.$router.push($nuxt.localePath("/ml/exercises/" + this.exid + suffix));
      } else {
        this.exerciseStepBack()
      }
      this.$gtag('event', 'click', {
        'event_label': 'Redo',
        'event_category': 'Exercises',
      })
    },
    nextStep() {
      if (this.hasJoinedProgramById(this.programid) && this.getNextExerciseByProgramData(this.currentProgram, this.getCurrentExercise) && !this.isCurrentUserGuest) {
        this.pickProgramExercise(this.getNextExerciseByProgramData(this.currentProgram, this.getCurrentExercise));
        return;
      }
      /* Deprecated
      if (this.getRunningProgram && this.getNextProgramExercise && !this.isCurrentUserGuest) {
        this.moveNextProgram(this.getNextProgramExercise);
        return;
      }
       */
      if (document.querySelector('#__nuxt')) {
        document.querySelector('#__nuxt').classList.add('quit');
      }
      this.$gtag('event', 'click', {
        'event_label': 'Done',
        'event_category': 'Exercises',
      })
      this.exerciseStepBack()
    }
  }
}
</script>
