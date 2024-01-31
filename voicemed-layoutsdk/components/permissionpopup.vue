<template>
  <v-dialog
    v-model="showDialog"
    fullscreen
    hide-overlay
    transition="slide-x-reverse-transition-slow"
    content-class="customDialog permissionPopup"
    scrollable
  >
    <fullpage-card>
      <template v-slot:header>
        <v-row class="navigation" align-content="center" justify="space-between">
          <v-btn icon @click="closeClick" class="closebtn" :style="warning?'opacity: 0':''">
            <v-icon>mdi-chevron-left-circle-outline</v-icon>
          </v-btn>
          <div class="exercise__title">
            <span>{{ $t('permissionpopup.title') }}</span>
          </div>
          <v-btn icon @click="closeClick" class="closebtn" style="opacity: 0">
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
        </v-row>
      </template>
      <template v-slot:body class="text-center">
        <div class="text-center content">
          <div class="content__title">
            <span v-html="$t('permissionpopup.permission_storage_title')"></span>
            <v-img :src="primaryImage"></v-img>
          </div>
          <div class="text-center content__warning" v-if="warning">
            <v-icon class="warn">$custom_warning</v-icon>
            <div class="tutorial__medicalrisks__content" v-html="$t('generic.permissionswarning')"></div>
          </div>
          <div class="content__body">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img :src="micImage"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <b>{{ $t('permissionpopup.permission_mic_title') }}</b><br/>
                  <div>
                    {{ $t('permissionpopup.permission_mic_msg') }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img :src="folderImage"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <b>{{ $t('permissionpopup.permission_media_title') }}</b><br/>
                  <div>
                    {{ $t('permissionpopup.permission_media_msg') }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img :src="cogImage"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <b>{{ $t('permissionpopup.about_title') }}</b><br/>
                  <div>
                    {{ $t('permissionpopup.about_msg') }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </template>
      <template v-slot:footer class="permissions_footer">
        <v-btn
          color="backvm"
          text
          nuxt
          @click="closeClick"

        >
          <v-icon v-if="warning">mdi-close</v-icon>
          {{ $t('generic.'+(warning?'quit':'back')) }}
        </v-btn>
        <v-spacer/>
        <v-btn
          color="nextvm"
          :class="warning?'warning':''"
          @click="nextClick"
        >
          <span v-html="$t('generic.'+(warning?'gotosettings':'next'))"></span>
          <v-icon v-if="warning">mdi-cog-outline</v-icon>
        </v-btn>
      </template>
    </fullpage-card>
  </v-dialog>
</template>
<script>

const _cogImage = require("~/assets/images/cog_image.png");
const _folderImage = require("~/assets/images/folder_image.png");
const _micImage = require("~/assets/images/mic_image.png");
const _permImage = require("~/assets/images/permission_image.png");

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    warning: {
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
    },
    micImage() {
      return _micImage;
    },
    folderImage() {
      return _folderImage;
    },
    cogImage() {
      return _cogImage;
    },
    primaryImage() {
      return _permImage;
    }
  },
  methods: {
    closeClick(e) {
      this.$emit('close', e);
    },
    nextClick(e) {
      this.$emit('next', e);
    }

  },
  mounted() {

  }
}
</script>
