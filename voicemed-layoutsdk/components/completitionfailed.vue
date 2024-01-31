<template>
  <v-dialog
    v-model="showDialog"
    persistent
    fullscreen
    hide-overlay
    scrollable
    content-class="failedUploadPopup"
    id="failedupload_popup"
    style="z-index: 1001"
  >
    <v-card class="accountDeletion">
      <v-card-text class="pa-4">
        <div class="fullcard" style="position: relative;">
          <h1 v-html="$t('completitionfailed.title_'+phase)"></h1>
          <v-img :src="errorImage"></v-img>
          <div v-html="$t('completitionfailed.msg_'+phase)" class="withdownload_audio"></div>
          <div style="min-height: 68px;" class="completition_downloadcontainer">
            <a href="#" id="error_downloader" class="download_audio_btn hidden" @click="requestDownload">
              <v-icon>mdi-download</v-icon>
              {{ $t('completitionfailed.download_audio') }}
            </a>
          </div>

        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-if="phase===1"
          color="backvm"
          text
          nuxt
          @click="closeClick"
        >
          <span v-html="$t('generic.home')"></span>
        </v-btn>
        <v-btn
          v-if="phase===1"
          class="nextvm"
          @click="nextClick"
        >
          <span v-html="$t('generic.retry')"></span>&nbsp;
          <v-icon>mdi-reload</v-icon>
        </v-btn>

        <v-btn
          v-if="phase===2"
          class="nextvm fullwidth"
          @click="closeClick"
        >
          <span v-html="$t('generic.home')"></span>
        </v-btn>

      </v-card-actions>
    </v-card>

    <v-bottom-sheet v-model="warnpopup" persistent :overlay-opacity="0.9" content-class="failedBottomSheet">
      <div class="bottomsheet completitionfailed">
        <div class="text">
          {{ $t('completitionfailed.bottomsheet_msg') }}
        </div>
        <div class="actions">
          <v-btn color="nextvm"
                 nuxt
                 @click="warnpopup=false">
            <span v-html="$t('generic.cancel')"></span>
          </v-btn>
          <v-btn
            color="leavevm"
            text
            nuxt
            outlined
            @click="closeAnyWay">
            <span class="" v-html="$t('generic.home')"></span>
          </v-btn>
          <v-spacer/>

        </div>
      </div>
    </v-bottom-sheet>
  </v-dialog>
</template>
<script>

const _errorImage = require("~/assets/images/errorwifi.png");
const maxTries = 5;

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    tries: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      phase: 1,
      warnpopup: false
    }
  },
  computed: {
    showDialog: function () {
      if (this.tries >= maxTries) {
        this.phase = 2;
      }
      return this.show;
    },
    errorImage() {
      return _errorImage;
    }
  },
  methods: {
    requestDownload(e) {
      console.log('some one requests a download');
      this.$emit('blobdownload', e);
    },
    closeClick(e) {
      //Home loose every thing, get back to home
      if (this.phase === 1) {
        //show popup sample
        this.warnpopup = true;
        return;
      }
      this.closeAnyWay(e);
    },
    closeAnyWay(e) {
      this.$emit('close', e);
      $nuxt.$router.replace($nuxt.localePath("/home"));
    },
    nextClick(e) {
      this.$emit('retry', e);
    }

  },
  mounted() {

  }
}
</script>
