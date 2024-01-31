<template>
  <v-dialog
    v-model="showDialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    content-class="errorDialog"
  >
    <fullpage-card class="error-dialog">
      <template v-slot:header>
        <span v-html="title" class="text-center"></span>

      </template>
      <template v-slot:body class="text-center">
        <div class="text-center">
          <span v-html="error"></span>
          <img :src="errorImage" class="errorimage" />
        </div>
      </template>
      <template v-slot:footer>
        <div :class="['pager',hasretry?'multiple':'']">
          <v-btn
            color="leavevm"
            text
            nuxt
            outlined
            @click="resetClick"
          >
            <slot name="leavebtn">
              <v-icon>mdi-check-bold</v-icon>&nbsp;<span v-html="$t('generic.leave')"></span>
            </slot>
          </v-btn>
          <v-spacer v-if="hasretry"/>
          <v-btn
            v-if="hasretry"
            color="nextvm"
            nuxt
            @click="retryClick"
          >
            <slot name="retrybtn">
              <span v-html="$t('generic.retry')"></span>&nbsp;<v-icon>mdi-reload</v-icon>
            </slot>
          </v-btn>
        </div>
      </template>
    </fullpage-card>
  </v-dialog>
</template>
<script>

const errorImage = require("~/assets/images/errorlogo.png");
export default {
  props: {
    title: {
      type: String,
      default: "An error has occurred"
    },
    error: {
      type: String,
      default: "Ops try again later"
    },
    errorImage: {
      type: String,
      default: errorImage
    },
    show: {
      type: Boolean,
      default: false
    },
    hasretry : {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    showDialog: function () {
      return this.show;
    }
  },
  methods : {
    retryClick(e) {
      this.$emit('click',e);
    },
    resetClick(e) {
      this.$emit('close',e);
    }
  },
  mounted() {

  }
}
</script>
