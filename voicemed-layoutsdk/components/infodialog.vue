<template>
  <v-dialog
    v-model="showDialog"
    fullscreen
    hide-overlay
    :transition="transition"
    scrollable
    :content-class="'infoDialog '+contentclasses"
  >
    <fullpage-card>
      <template v-slot:header>
        <div :class="[(showSuperTitle?'with':'without')+'__supertitle',(thumbInTitle?'with':'without')+'__thumbInTitle']">
          <div class="text-center supertitle" v-if="showSuperTitle">About</div>
          <img :src="infoImage" class="titleImage" v-if="infoImage&&thumbInTitle===true" />
          <div v-html="title" class="text-center infodialog__title"></div>
        </div>
      </template>
      <template v-slot:body class="text-center">
        <div class="text-center content">
          <img :src="infoImage" class="errorimage" v-if="infoImage&&thumbInTitle===false" />
          <span v-html="description" :class="[contentclasses, 'withdynamicTexts']"></span>
        </div>
      </template>
      <template v-slot:footer>
        <div :class="['pager']">
          <v-btn
            color="nextvm"
            nuxt
            @click="closeClick"
          >
            <slot name="closebtn">
              <v-icon>mdi-reload</v-icon>&nbsp;<span v-html="$t('generic.done')"></span>
            </slot>
          </v-btn>
        </div>
      </template>
    </fullpage-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "Info"
    },
    transition: {
      type: String,
      default: "dialog-bottom-transition"
    },
    contentclasses: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: "Info text"
    },
    infoImage: {
      type: String,
      default: null
    },
    showSuperTitle: {
      type: Boolean,
      default: true
    },
    thumbInTitle: {
      type: Boolean,
      default: true
    },
    show: {
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
    closeClick(e) {
      this.$emit('close',e);
    }
  },
  mounted() {
  }
}
</script>
