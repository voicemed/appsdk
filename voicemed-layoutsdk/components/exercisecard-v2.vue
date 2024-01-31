<template>
  <v-card
          v-bind="$attrs"
          v-bind:class="['exercisecard v2 exercise','exidx_'+index,programview?'programview':'',exercise.type,disable?'disabled':'']"
          @click="pickMe">
    <div class="card__header">
      <div :class="['type',exercise.type]">{{$t('generic.exercisetype.'+exercise.type)}}</div>
      <div :class="['exercise_type icon_holder', exercise.type]">&nbsp;</div>
      <!-- <v-img v-if="exercise.type!==$exerciseManager.kindPOST&&exercise.thumb" :src="exercise.thumb" contain></v-img>-->
    </div>
    <v-row class="ma-0">
      <div class="flex-grow-1 texts card-texts">
        <v-card-title v-html="exercise.title"></v-card-title>
        <v-card-subtitle>
          <div class="duration inner" v-if="exercise.duration&&exercise.duration>0">{{ $humanizeTime(exercise.duration) }}</div>
        </v-card-subtitle>
      </div>
      <div class="action ma-0 pa-0">
        <v-btn icon :loading="nuxtloading" v-if="isguest">
          <v-icon>$lock</v-icon>
        </v-btn>
        <v-btn icon :loading="nuxtloading" v-else-if="!disable">
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn icon :loading="nuxtloading" v-else>
          <v-icon>$lock</v-icon>
        </v-btn>
      </div>
    </v-row>
  </v-card>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  inheritAttrs: true,
  name: "exerciseCard",
  props: {
    index: {
      type: Number,
      default: 0
    },
    exercise: {
      type: Object,
      default: () => {
      },
    },
    'isguest':{
      type: Boolean,
      default: false
    },
    'disable': {
      type: Boolean,
      default: false
    },
    'programview': {
      type: Boolean,
      default: false
    }
  },
  computed: {
    nuxtloading() {
      return $nuxt.$loading.loading
    }
  },
  methods: {
    pickMe() {
      this.$analytics.logEvent('exercise_opened', {
        "id": this.exercise.id,
        "type": this.exercise.type,
        "name": this.exercise.title,
        "program_id": typeof this.exercise.program_id !== 'undefined' ? this.exercise.program_id : null
      })
      this.$emit('click', this.exercise)
    }
  }
}
</script>
