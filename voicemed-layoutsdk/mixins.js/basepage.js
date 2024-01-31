import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'basePage',
  transition: {
    name: 'slide',
    mode: 'out-in',
    css: false,
    beforeEnter(el) {
      if (document.querySelector('#__nuxt').classList.contains('quit')) {
        return
      }
      const startPoint = document.querySelector('#__nuxt').classList.contains('back') ? '-100%' : '100%';
      this.$anime.set(el, {
        scale: 1,
        opacity: 0,
        translateX: startPoint
      })
    },
    enter(el, done) {
      const startPoint = document.querySelector('#__nuxt').classList.contains('back') ? '-100%' : '100%';
      this.$anime({
        targets: el,
        opacity: [0, 1],
        translateX: [startPoint, "0"],
        duration: 500,
        easing: 'easeInOutSine',
        complete: done
      })
    },
    leave(el, done) {
      if (document.querySelector('#__nuxt').classList.contains('quit')) {
        this.$anime({
          targets: el,
          /*opacity: [1, 0],*/
          translateY: [0, '100%'],
          duration: 500,
          easing: 'easeInOutSine',
          complete: done
        });
        return
      }
      const startPoint = document.querySelector('#__nuxt').classList.contains('back') ? '100%' : '-100%';
      this.$anime({
        targets: el,
        opacity: [1, 0],
        translateX: ["0", startPoint],
        duration: 500,
        easing: 'easeInOutSine',
        complete: done
      });
    },
    afterLeave(el) {
      document.querySelector('#__nuxt').classList.remove('quit');
      document.querySelector('#__nuxt').classList.remove('back');
    }
  },
  data() {
    return {
      "name": "basePage",
      exid: (this.$route.params.id),
      programid: (this.$route.params.fromprogram || false),
      withindex: (this.$route.params.withindex || -1),
      backto: (this.$route.params.backto || false),
      hasBack: false,
      hasNext: false,
      hasInfo: false,
      currentTutorial: false,
      tutorialList: [],
      tutorialShownHard: false
    }
  },
  computed: {
    ...mapGetters({
      getCurrentPagerHeight: 'getCurrentPagerHeight',
      getTutorialShown: "getTutorialShown",
      getLocalTutorialShown: "getLocalTutorialShown",
    }),
    isVoicemed() {
      return $nuxt.$config.env.environment.indexOf('voicemed_')>-1
    },
    isAirlyn() {
      return $nuxt.$config.env.environment.indexOf('voicemed_')<0
    },
    nuxtloading() {
      return $nuxt.$loading.loading
    },
    defaultHomeUrl() {
      //We know that we can customize the opening url:
      return "/user/today";
      if(this.isAirlyn) {
        return "/user/today";
      }
      if(this.isVoicemed) {
        return "/home";
      }
    }
  },
  methods: {
    ...mapActions({
      setCurrentPage: 'setCurrentPage',
      setCurrentPagerHeight: 'setCurrentPagerHeight',
      setTutorialRunPerPage: 'setTutorialRunPerPage',
      setTutorialRun: 'setTutorialRun'
    }),
    setTutorialRunLocal() {
      this.setPreferenceTutorial();
    },


    tutorialClose() {
      this.$set(this, "tutorialList", []);
      this.setTutorialRunLocal();
      this.currentTutorial = null;
    },
    tutorialHasNext() {
      const _index = this.currentTutorial.index;
      const _next = this.tutorialList.find((v) => v.index === _index + 1);
      if (_next) {
        return true;
      }
      return false
    },
    exerciseStepBack() {
      console.log('exit test', this.backto, this.programid)
      if (this.backto == 'today') {
        $nuxt.$router.replace($nuxt.localePath("/user/today"));
        return
      }
      if (this.backto == 'discovery') {
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

      $nuxt.$router.replace($nuxt.localePath("/user/today"));
    },
    buildSuffix() {
      let suffixes = [];
      const programCheck = this.programid ? this.programid : false;
      suffixes.push(programCheck!=='-1'?programCheck:false);
      suffixes.push(this.withindex ? this.withindex : "-1")
      suffixes.push(this.backto ? this.backto : false)
      return suffixes.join("/")
    },
    tutorialNext() {
      let _index = this.currentTutorial ? this.currentTutorial.index : 0;
      if (this.currentTutorial) {
        this.currentTutorial.visible = false;
        this.setTutorialRunLocal();
        //this.setTutorialRun({"page":this.name,"index":this.currentTutorial.index})
      } else {
        _index = this.tutorialList[0].index - 1;
      }
      const _next = this.tutorialList.find((v) => v.index === _index + 1);
      if (_next) {
        //const position = _next.itemRef.getBoundingClientRect()
        //_next.position = position;
        this.currentTutorial = _next;
        const dialogHeight = 200;
        const dialogOffset = 10;
        //Ottieni posizione minima di scroll top
        const itemHeight = dialogHeight + dialogOffset + _next.position.height;

        let scrollTop = _next.position.top > this.appHeight / 2 ?
          _next.position.top - (dialogHeight + dialogOffset) :
          _next.position.top - dialogOffset;
        if (_next.arrowTop) {
          scrollTop = _next.position.top - (_next.position.height + dialogOffset);
        }
        scrollTop = Math.max(0, scrollTop); //Evita che sia inferiore a zero
        //Verifica se l'elemento da selezionare sta dentro lo scroll:
        console.warn("Nuovo scroll Top:", scrollTop, this.appHeight, this.footerHeight, _next.position.height)
        this.$nextTick(() => {
          document.querySelector(".indexPage").scrollTo({
            top: scrollTop,
            left: 0,
            behavior: 'smooth'
          });
        })
        _next.visible = true

      } else {
        //Close tutorial...
        this.tutorialClose()
      }
    },
    getTutorialIndex() {
      if (this.currentTutorial) {
        if (this.currentTutorial.index > this.tutorialList.length) {
          return this.tutorialList.length
        }
        return this.currentTutorial.index
      }
      return ""
    },
    getTutorialText(tutorial) {
      return this.$t('tutorials.' + this.name + '.text_' + tutorial.index, {"title": tutorial.title})
    },
    getTutorialDialogStyle(tutorial) {
      const _rule = {};
      const position = tutorial.position; //.itemRef.getBoundingClientRect()
      let topPosition = position.top;
      if (this.$capacitor && this.$capacitor.isNativePlatform() && tutorial.updated == false) {
//        tutorial.position = tutorial.itemRef.getBoundingClientRect();
        topPosition = position.top; // - document.querySelector(".indexPage").scrollTop;
        tutorial.updated = true;
        console.warn('apply tutorial offset for mobile phones')
      }
      if ((topPosition) > 300) {
        _rule.top = (topPosition - 200) + "px";
      } else {
        _rule.top = (topPosition + position.height + 10) + "px";
      }
      console.warn('DialogStyle for tutorial', tutorial, _rule)

      if (tutorial.width !== 'fill') {
        _rule.left = "calc(" + position.left + "px - 75vw + " + position.width + "px )";
      } else {
        _rule.left = "0px";
        _rule.right = "0px";
      }
      return Object.entries(_rule).map(([k, v]) => `${k}:${v}`).join(';')
    },
    getTutorialStyle(tutorial) {
      const _rule = {};
      const position = tutorial.position; //itemRef.getBoundingClientRect()
      const baseOffset = 8;
      let topPosition = position.top;
      if (this.$capacitor && this.$capacitor.isNativePlatform() && tutorial.updated == false) {
//        tutorial.position = tutorial.itemRef.getBoundingClientRect();
        topPosition = position.top; // - document.querySelector(".indexPage").scrollTop;
        tutorial.updated = true;
      }
      console.warn('Style for tutorial', tutorial, topPosition)
      if (tutorial.width === 'fill') {
        _rule.top = (topPosition - (baseOffset / 2)) + "px";
        _rule.left = "0px";
        _rule.right = "0px";
        _rule.height = (position.height + baseOffset) + "px";
      } else {
        _rule.top = (topPosition - (baseOffset / 2)) + "px";
        _rule.left = (position.left - (baseOffset / 2)) + "px";
        _rule.right = "0px";
        _rule.height = (position.height + baseOffset) + "px";
        _rule.width = (position.width + baseOffset) + "px";
      }

      return Object.entries(_rule).map(([k, v]) => `${k}:${v}`).join(';')
    },
    initTutorial() {
      const _tutorialCards = [...document.querySelectorAll('.hastutorial')];
      //Se tutorial mai mostrator
      let _checkRun = false;
      if (this.$capacitor && this.$capacitor.isNativePlatform()) {
        _checkRun = this.tutorialShownHard; //Forza il valore in fase di init.
      } else {
        this.tutorialShownHard =this.$nuxt.$store.getters.getTutorialRun(this.name);
        _checkRun = this.$nuxt.$store.getters.getTutorialRunPerPage(this.name);
      }
      if (typeof this.getTutorialShown[this.name] !== 'undefined' || _checkRun || this.tutorialShownHard) {
        console.warn("hide tutorial, not needed at this round");
        return;
      }
      this.$set(this, 'tutorialList', []);
      if (_tutorialCards.length > 0) {
        document.querySelector(".indexPage").scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        const localTutorials = this.getLocalTutorialShown;
        console.warn("got local tutorials", localTutorials)
        _tutorialCards.forEach((item) => {
          const indexTutorial = parseInt(item.dataset.tutorialindex)
          if (typeof localTutorials[this.name + "_" + indexTutorial] === 'undefined') {
            const position = item.getBoundingClientRect();
            this.tutorialList.push({
              "position": position,
              'visible': false,
              'itemRef': item,
              'updated': false,
              'arrowTop': item.dataset.tutorialarrow == "top",
              "title": item.dataset.tutorial,
              "width": item.dataset.tutorialwidth,
              "index": indexTutorial
            })
          }
        })
        window.tutorialList = this.tutorialList;
      }

      if (this.tutorialList.length > 0) {
        this.tutorialList = this.tutorialList.sort((a, b) => {
          if (a.index > b.index) {
            return 1;
          }
          if (b.index > a.index) {
            return -1;
          }
          return 0;
        })
      }
      if (this.tutorialList.length > 0) {
        this.currentTutorial = 0;
        this.$nextTick(() => {
          setTimeout(() => {
            //wait 200 ms to start first tutorial.
            /*Fill all tutorial positions*/
            this.tutorialList.forEach((item) => {
              item.position = item.itemRef.getBoundingClientRect();
            })
            this.tutorialNext();
            this.setTutorialRunPerPage(this.name);
          }, 200);
        })
      }

    },
    hasJoinedProgramById(id) {
      return this.$nuxt.$store.getters.hasJoinedProgramById(id)
    },
    getProgramJoinedAtById(id) {
      return this.$nuxt.$store.getters.getProgramJoinedAtById(id)
    },
    getProgramById(id) {
      return this.$nuxt.$store.getters.getProgramById(id)
    },
    getOverallProgressProgramById(id) {
      return this.$nuxt.$store.getters.getOverallProgressProgramById(id)
    },
    getDoneCountByProgramId(id) {
      return this.$nuxt.$store.getters.getDoneCountByProgramId(id)
    },
    getNextExerciseByProgramId(id) {
      return this.$nuxt.$store.getters.getNextExerciseByProgramId(id)
    },
    getExercisetocompleteCountProgramById(id) {
      return this.$nuxt.$store.getters.getExercisetocompleteCountProgramById(id)
    },
    getExercisecompletedCountProgramById(id) {
      return this.$nuxt.$store.getters.getExercisecompletedCountProgramById(id)
    },
    printDeviceError(prefix, error, clickEvent, resetEvent) {
      this.$analytics.logEvent("permission_error", {
        "title": 'errors.' + prefix + "." + error.name.toLowerCase() + ".title",
        "kind": prefix
      });
      console.error('Got device error', error)
      if (error && (error.name === "NotAllowedError" || error.name === "NotFoundError" || error.exception.state == "denied" || error.exception.state == "DENIED")) {
        this.$root.$emit('showPermssionError', true)
        return
      }

      this.showError(
        this.$t('errors.generic.title'),
        this.$t('errors.generic.description'),
        clickEvent,
        resetEvent
      );
    },
    printDeviceErrorOLD(prefix, error, clickEvent, resetEvent) {
      this.$analytics.logEvent("permission_error", {
        "title": 'errors.' + prefix + "." + error.name.toLowerCase() + ".title",
        "kind": prefix
      });
      console.error('Got device error', error)
      if (error.exception && prefix == "mic") {
        if (error.exception.state == "denied" || error.exception.state == "DENIED") {
          error.name = "DeniedError";
          this.$root.$emit('showError', {
            title: this.$t('errors.' + prefix + "." + error.name.toLowerCase() + ".title"),
            error: this.$t('errors.' + prefix + "." + error.name.toLowerCase() + ".description"),
            hasretry: true,
            click: function () {
              $nuxt.$airlyn.openPermissionPanel().then((r) => {
                console.log('got openPermission Panel then', r, JSON.stringify(r))
              }).catch((e) => {
                console.log('got openPermission Panel catch', e, JSON.stringify(e))
              }).finally(() => {
                //esegui comunque il reset event...
                if (typeof resetEvent == 'function') {
                  console.log('dopo il setting riport cmq a inizio')
                  resetEvent()
                }
              })
              return true
            },
            resetEvent: resetEvent || function () {
            },
            retryBtn: "Settings"
          });
          return
        }
      }
      if (error && (error.name === "NotAllowedError" || error.name === "NotFoundError")) {
        //Permission error
        this.showError(
          this.$t('errors.' + prefix + "." + error.name.toLowerCase() + ".title"),
          this.$t('errors.' + prefix + "." + error.name.toLowerCase() + ".description"),
          clickEvent,
          resetEvent
        );
        return
      }
      this.showError(
        this.$t('errors.generic.title'),
        this.$t('errors.generic.description'),
        clickEvent,
        resetEvent
      );
    },
    manageMicError(e, clickEvent, resetEvent) {
      this.printDeviceError('mic', e, clickEvent, resetEvent);
    },
    manageCamError(e, clickEvent, resetEvent) {
      this.printDeviceError('cam', e, clickEvent, resetEvent);
    },
    manageMicCamError(e, clickEvent, resetEvent) {
      this.printDeviceError('miccam', e, clickEvent, resetEvent);
    },
    showError(title, error, clickEvent, resetEvent) {
      this.$root.$emit('showError', {
        title: title,
        error: error,
        hasretry: clickEvent !== null ? true : false,
        click: clickEvent || function () {
        },
        resetEvent: resetEvent || function () {
        }
      });
    },
    swipeEvent(e) {
      //console.log(e.target); // element that was swiped
      //console.log(e.detail); // see event data below
      this.$root.$emit("swipe", e);
    },
    attachSwipeListener() {
      document.addEventListener('swiped-left', this.swipeEvent);
      document.addEventListener('swiped-right', this.swipeEvent);
    },
    detachSwipeListeners() {
      document.removeEventListener('swiped-left', this.swipeEvent);
      document.removeEventListener('swiped-right', this.swipeEvent);
    },
    retrievePreferenceTutorial() {
      if (this.$capacitor && this.$capacitor.isNativePlatform()) {
        this.$airlyn.preferenceConfigure({'group': 'airlyn'}).finally(() => {
          console.log('preferences ready');
          const key = "tutorial_" + this.name;
          this.$airlyn.preferenceGet({'key': key}).then((r) => {
            console.log('preference read (' + key + ')!', r);
            if (r && r.value && (r.value === 1 || r.value == '1')) {
              console.log('got preference Tutorial SEEN for', key, r.value);
              this.tutorialShownHard = true;
            }
          })
        })
      }
    },
    setPreferenceTutorial() {
      if (this.$capacitor && this.$capacitor.isNativePlatform()) {
        const key = "tutorial_" + this.name;
        this.$airlyn.preferenceSet({'key': key, 'value': "1"}).finally(() => {
          console.log('preference stored for!', key);
        })
      }
      this.setTutorialRun({"page": this.name, "index": this.currentTutorial.index})
      this.tutorialShownHard = true;
    }
  },
  beforeMount() {
    this.setCurrentPage(this);
  },
  beforeDestroy() {
    this.detachSwipeListeners();
  },
  mounted() {
    this.tutorialShownHard = false;
    //Init Preferences if app is native:
    this.retrievePreferenceTutorial()
    console.log('try Load index', this.name, this.dynamicTexts);
    if (this.dynamicTexts && Object.keys(this.dynamicTexts).length > 0) {
      Object.keys(this.dynamicTexts).map((text) => {
        this.$appConfiguration.getText(text).then((r) => {
          this.dynamicTexts[text] = r;
        }).catch((e) => {
          this.dynamicTexts[text] = this.$t(this.name + '.' + text);
        })
      })
    }
    if (this.getCurrentPagerHeight !== null && document.querySelector('.v-main__wrap > div.pager')) {
      document.querySelector('.v-main__wrap > div.pager').style.height = this.getCurrentPagerHeight + "px";
    }
    this.$nextTick(() => {
      //check tutorial by Name: const localTutorials = this.getLocalTutorialShown;
      if (this.$capacitor && this.$capacitor.isNativePlatform()) {
        console.log('Richiesto al passaggio precedente');
      } else {
        const _local = this.getLocalTutorialShown;
        if (_local && typeof _local[this.name] !== 'undefined') {
          this.tutorialShownHard = true;
        } else {
          this.tutorialShownHard = false;
        }

      }

      //Start swipe features:
      this.attachSwipeListener();
      if (this.getCurrentPagerHeight === null) {
        if (document.querySelector('.v-main__wrap > div.pager')) {
          this.setCurrentPagerHeight(Math.max(document.querySelector('.v-main__wrap > div.pager').clientHeight, document.querySelector('.v-main__wrap > div.pager').offsetHeight));
        }
      }
    });
  }

}
