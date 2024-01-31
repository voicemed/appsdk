<template>
  <div :class="['pager',(currentPage&&currentPage.name?currentPage.name:''),'pageTransition','visible_btns_'+visibleButtonsCount, hasBack?'withback':'',hasNext?'withnext':'',hasInfo?'withinfo':'']">
    <transition name="fade" appear>
      <v-btn
        v-if="hasBack&&loading===false"
        color="backvm"
        text
        nuxt
        @click="backStep"
      >
        <span v-html="backText"></span>
      </v-btn>
    </transition>
    <transition name="fade" appear>
      <v-btn
        v-if="hasInfo&&loading===false"
        color="backvm"
        text
        nuxt
        @click="infoStep"
      >
        <v-icon>mdi-information-outline</v-icon>&nbsp;
        <span v-html="$t('generic.info')"></span>
      </v-btn>
    </transition>
    <v-spacer class="spacer" v-if="visibleButtonsCount>1"/>
    <transition name="fade" appear>
      <v-btn
        v-if="hasNext&&loading===false"
        color="nextvm"
        :loading="nuxtloading"
        @click="nextStep"
        :disabled="disableNext"
        class="nextvm"
      >
        <span v-html="nextText"></span>
      </v-btn>
    </transition>
  </div>
</template>
<script>
import {debounce} from '../mixins.js/debounce'
import {mapGetters, mapActions} from 'vuex'

export default {
  computed: {
    ...mapGetters({
      getCurrentPage: 'getCurrentPage'
    }),
    currentPage() {
      return this.getCurrentPage
    },
    nuxtloading() {
      return $nuxt.$loading.loading
    },
    visibleButtonsCount() {
      let count = 0;
      count += this.hasInfo? 1: 0;
      count += this.hasBack? 1: 0;
      count += this.hasNext? 1: 0;
      return count;
    }
  },
  data() {
    return {
      hasBack: false,
      hasNext: false,
      hasInfo: false,
      backText: "Back",
      nextText: "Next",
      disableNext: false,
      loading: false
    }
  },
  watch: {

    'currentPage': function () {
      this.loading = true;
      this.$forceNextTick(() => {
        this.updateButtons();
      })
    },
    'currentPage.hasBack': function () {
      this.updateButtons()
      //this.hasBack = this.currentPage.hasBack;
    },
    'currentPage.hasNext': function () {
      this.updateButtons();
      //this.hasNext = this.currentPage.hasNext;
    },
    'currentPage.hasInfo': function () {
      this.updateButtons();
      //this.hasInfo = this.currentPage.hasInfo;
    }
  },
  methods: {
    ...mapActions({
      setCurrentPage: 'setCurrentPage'
    }),
    _updateButtons() {
      this.$nextTick(() => {
        this.hasBack = this.currentPage.hasBack;
        this.hasNext = typeof this.currentPage.hasNext !== 'undefined' ? this.currentPage.hasNext : true;
        this.hasInfo = typeof this.currentPage.hasInfo !== 'undefined' ? this.currentPage.hasInfo : false;
        this.$forceNextTick(() => {
          this.loading = false;
        })
      })
    },
    updateButtons: debounce(function () {

      this._updateButtons();
    }, 500),
    handleBack() {
      console.log('someone clicked on backButton');
      this.backStep();
    },
    nextStepEvent() {
      this.nextStep();
    },
    disableNextEvent(value) {
      this.disableNext = value;
    },
    forceNext(value) {
      this.hasNext = value;
    },
    forceBack(value) {
      this.hasBack = value;
    },
    setNextText(value) {
      this.nextText = value;
    },
    setBackText(value) {
      this.backText = value;
    },
    infoStep() {
      if (typeof this.currentPage.infoStep === 'function') {
        this.$gtag('event', 'click', {
          'event_label': 'About',
          'event_category': 'Navigation',
        })
        const _func = this.currentPage.infoStep;
        const _bind = _func.bind(this.currentPage);
        _bind();
      }
    },
    nextStep() {
      this.$gtag('event', 'click', {
        'event_label': 'Next',
        'event_category': 'Navigation',
      })
      document.querySelector('#__nuxt').classList.remove('back');
      if (typeof this.currentPage.nextStep === 'function') {
        const _func = this.currentPage.nextStep;
        const _bind = _func.bind(this.currentPage);
        _bind();
      }
    },
    backStep() {
      this.$gtag('event', 'click', {
        'event_label': 'Back',
        'event_category': 'Navigation',
      })
      document.querySelector('#__nuxt').classList.add('back');
      if (typeof this.currentPage.prevStep === 'function') {
        const _func = this.currentPage.prevStep;
        const _bind = _func.bind(this.currentPage);
        _bind();
      }
    }
  },

  beforeDestroy() {
    if (this.$capacitor && this.$capacitor.isNativePlatform()) {
      console.log('pager remove backbutton')
      this.$backEmitter.callback = null
      if (this.currentPage && typeof this.currentPage.handleBack === 'function') {
        console.log('reset original HandleBack for this page')
        this.$backEmitter.callback = this.currentPage.handleBack;
      }
    }
  },
  mounted() {
    if (this.$capacitor && this.$capacitor.isNativePlatform()) {
      console.log('pager add backbutton')
      this.$backEmitter.callback = this.handleBack;
    }
    this.backText = this.$t('generic.back');
    this.nextText = this.$t('generic.next');
    this.$root.$on('nextstep', this.nextStepEvent);
    this.$root.$on('backstep', this.backStep);
    this.$root.$on('showNext', this.forceNext);
    this.$root.$on('disableNext', this.disableNextEvent);
    this.$root.$on('showBack', this.forceBack);
    this.$root.$on('showNext', this.forceNext);
    this.$root.$on('setNextText', this.setNextText);
    this.$root.$on('setBackText', this.setBackText);
  }

}
</script>
