<template>
  <v-card elevation="1"
          v-bind="$attrs"
          v-bind:class="['exercisecard exercise','exidx_'+index,programview?'programview':'',exercise.type]"
          @click="pickMe">
    <v-list-item :ripple="!disable">
      <v-list-item-avatar :tile="false" rounded="0" v-if="programview===false">
        <v-img :src="exercise.thumb" contain></v-img>
      </v-list-item-avatar>
      <v-list-item-content class="card-texts">
        <v-list-item-title v-html="exercise.title"></v-list-item-title>
        <v-list-item-subtitle v-if="exercise.type!==$exerciseManager.kindPOST">
          <v-icon>mdi-clock-time-four-outline</v-icon>&nbsp;
          {{ $humanizeTime(exercise.duration) }}
          <template v-if="programview===true">
            <v-icon class="program">$program</v-icon>
            {{ exercise.program_name }}
          </template>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="!disable">
        <v-btn icon :loading="nuxtloading">
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>

  </v-card>
</template>
<script>
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
