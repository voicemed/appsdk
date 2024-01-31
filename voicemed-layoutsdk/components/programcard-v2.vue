<template>
  <v-card v-bind:class="['program v2','prgdx_'+index]" @click="pickMe">
    <div class="card__header">
      <!--
      <div class="type" v-if="typeof(program.tags)!=='undefined'&&program.tags.length>0">
        <span v-html="program.tags[0].name"></span>
      </div>

      <div class="type" v-else>
        <span >{{ $t('program.baseTag') }}</span>
      </div>
      -->
      <div class="type">
        <span >{{ $t('program.baseTag') }}</span>
      </div>
      <div :class="['program_type icon_holder']">&nbsp;</div>
    </div>
    <v-row class="ma-0">
      <div class="flex-grow-1 texts card-texts">
        <v-card-title v-html="program.title"></v-card-title>
        <v-card-subtitle>
          <div class="text-lowercase" v-if="typeof(program.exercises)!=='undefined'&&program.exercises.length>0">{{ program.exercises.length }}&nbsp;{{ $t('program.exercises') }}</div>
        </v-card-subtitle>
      </div>
      <div class="action flex row align-content-center justify-center ma-0 pa-0" v-if="!showprogress">
        <v-btn icon>
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </div>
      <div class="action ma-0 pa-0 progress" v-else>
        <v-progress-circular
          :rotate="-90"
          :size="38"
          :value="overallProgress"
        >
          {{ overallProgress }}%
        </v-progress-circular>
      </div>
    </v-row>
  </v-card>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  name: "programCard",
  props: {
    index: {
      type: Number,
      default: 0
    },
    program: {
      type: Object,
      default: () => {
      },
    },
    showprogress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      "programThumb": undefined
    }
  },
  computed: {
    ...mapGetters({
      getRunningProgram: 'getRunningProgram',
      isCurrentUserGuest: 'isCurrentUserGuest',
    }),
    overallProgress() {
      if(typeof this.program['exercises'] === 'undefined') {
        return 0
      }
      const completed = this.program.exercises.reduce((carry, item) => {
        return carry + (item.completed ? 0 : 1);
      }, 0);
      return Math.round((1 - (completed / this.program.exercises.length)) * 100);
    },
    nuxtloading() {
      return $nuxt.$loading.loading
    },
    programImage() {
      if (this.program && typeof this.program.thumb !== 'undefined') {
        if (this.program.thumb !== null && this.program.thumb.length > 0) {
          return this.program.thumb;
        }
      }
      return "";//require("~/assets/images/errorprogram.png");
    }
  },
  methods: {
    imageError() {
      console.log('program image error');
      this.programThumb = require("~/assets/images/errorprogram.png");
    },
    pickMe() {
      this.$analytics.logEvent('program_opened', {
        "id": this.program.id,
        "name": this.program.title
      })
      this.$emit('click', this.program)
    }
  }
}
</script>
