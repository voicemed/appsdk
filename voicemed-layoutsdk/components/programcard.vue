<template>
  <v-card
    elevation="1" v-bind:class="['program','prgdx_'+index]" @click="pickMe">
    <v-img
      :src="programThumb||programImage"
      @error="imageError"
      height="152px"
    ></v-img>
    <v-row align-content="center" justify="center" class="ma-0">
      <div class="flex-grow-1 texts card-texts">
        <v-card-title v-html="program.title"></v-card-title>
        <v-card-subtitle>
          <v-icon class="program">$program</v-icon>&nbsp;Program · {{ program.exercises_ids.length }} exercises
        </v-card-subtitle>
      </div>
      <div class="action flex row align-content-center justify-center ma-0 pr-2">
        <template v-if="!isCurrentUserGuest"></template>
        <v-btn icon v-else>
          <v-icon>$lock</v-icon>
        </v-btn>
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
  },
  data() {
    return {
      "programThumb": undefined
    }
  },
  computed : {
    ...mapGetters({
      getRunningProgram: 'getRunningProgram',
      isCurrentUserGuest: 'isCurrentUserGuest',

    }),
    nuxtloading() {
      return $nuxt.$loading.loading
    },
    programImage() {
      if(this.program && typeof this.program.thumb !=='undefined') {
        if(this.program.thumb!==null && this.program.thumb.length>0) {
          return this.program.thumb;
        }
      }
      return require("~/assets/images/errorprogram.png");
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
