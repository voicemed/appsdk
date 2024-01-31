<template>
  <div class="video__wrapper">
    <div class="cameraWrapper">
      <div class="loading" v-if="isLoading">
        &nbsp;
      </div>
      <video id="video-test" playsinline autoplay muted v-if="isCameraOpen&&!isLoading" class="animated faded"/>
    </div>
    <div class="video__overlay animated faded" v-if="isCameraOpen&&!isLoading">
      <svg
        class="svgMasks"
        version="1.1"
        id="Livello_1"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        :viewBox="'0 0 '+svgMask.width +' '+svgMask.height"
        :style="'enable-background:new 0 0 '+svgMask.width +' '+svgMask.height+'; width:'+svgMask.width +'px !important;height:'+svgMask.height+'px !important;'"
        xml:space="preserve"
      >
        <mask id="myMask">
          <rect x="0" y="0" :width="svgMask.width" :height="svgMask.height" fill="white"/>
          <ellipse :cx="svgMask.maskX" :cy="svgMask.maskY" :rx="svgMask.maskW" :ry="svgMask.maskH" fill="black"/>
        </mask>

        <rect x="0" y="0" :width="svgMask.width" :height="svgMask.height"
              style="fill:rgba(0,0,0,0.4);" mask="url(#myMask)"/>
      </svg>
      <div class="video__message">
        <div v-html="$t('generic.camera_warning_title')"></div>
        <span v-html="$t('generic.camera_warning')"></span>
      </div>
    </div>
  </div>
</template>
<style>
.svgMasks {
  width: 100%;
  height: 100%;
  margin: 0px auto;
}
</style>
<script>

import {mapGetters, mapActions} from 'vuex'

export default {
  data() {
    return {
      isCameraOpen: false,
      isLoading: true,
      computeVideOverlayHeight: null,
      streamSettings: {
        videoinput: null
      },
      svgMask: {
        height: 0,
        width: 0,
        maskH: 0,
        maskW: 0,
        maskX: 0,
        maskY: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      getVideoDevices: 'getVideoDevices',
      getAudioDevices: 'getAudioDevices'
    })
  },
  methods: {
    ...mapActions({
      setVideoDevices: 'setVideoDevices',
      setAudioDevices: 'setAudioDevices',
      clearMediaDevices: 'clearMediaDevices'
    }),
    initVideoDevices() {
      if (this.getVideoDevices === null || (Array.isArray(this.getVideoDevices) && this.getVideoDevices.length === 0)) {
        this.clearMediaDevices();
        return this.$enumerateMediaDevices().then((result) => {
          this.setVideoDevices(result.video);
          this.setAudioDevices(result.audio);
          return this.getVideoDevices;
        }).catch((e) => {
          console.error('cannot enumerate media devices', e);
          this.$captureException(e);
        })
      }
      return new Promise((resolve, reject) => {
        resolve(this.getVideoDevices);
      });
    },
    fixCameraSize() {
      this.$nextTick(() => {
        if (document.querySelector('.video__overlay')) {
          //Fix screen width
          document.querySelector('.video__container').style.width = window.innerWidth + "px";
          const _MessageHeight = document.querySelector('.video__overlay .video__message').clientHeight;
          if (!this.computeVideOverlayHeight) {
            const _OvH = document.querySelector('.video__overlay').clientHeight;
            this.computeVideOverlayHeight = _MessageHeight;
          }

          console.log('got base sizes:', window.innerWidth, _MessageHeight, this.computeVideOverlayHeight);
          document.querySelector('.video__overlay').style.paddingBottom = this.computeVideOverlayHeight + "px";
          document.querySelector('.cameraWrapper').style.paddingBottom = this.computeVideOverlayHeight + "px";
          const camH = document.querySelector('.cameraWrapper').clientHeight;
          console.log('H Wrapper',
            camH,
            document.querySelector('.cameraWrapper').style.maskPosition,
            Math.min(document.querySelector('.cameraWrapper').clientWidth,
              document.querySelector('div.v-main__wrap').clientWidth)
          );
          this.svgMask.width = window.innerWidth;
          this.svgMask.height = (document.querySelector('.cameraWrapper').clientHeight - _MessageHeight);
          //Ellpise size:
          this.svgMask.maskW = (this.svgMask.width * 0.8) / 2;
          this.svgMask.maskH = (this.svgMask.height * 0.7) / 2;
          //Calc ratio:
          console.log('ellipse Ratio:', this.svgMask.maskW / this.svgMask.maskH);
          if ((this.svgMask.maskW / this.svgMask.maskH) > 0.8) {
            this.svgMask.maskH = (this.svgMask.height * 0.85) / 2;
            //Se il ratio è maggiore di 0.6 non è un ellisse e tende al quadrato, fix
            this.svgMask.maskW = Math.min((this.svgMask.width * 0.7) / 2, this.svgMask.maskH / 3 * 2);
            console.log('new ellipse Ratio:', this.svgMask.maskW / this.svgMask.maskH);
          }

          this.svgMask.maskX = this.svgMask.width / 2;
          this.svgMask.maskY = (this.svgMask.height / 2);
          console.log('found sizes', this.svgMask.maskW, this.svgMask.maskH, this.svgMask.width, this.svgMask.height);
          document.querySelector('.video__overlay').classList.remove('faded');
          document.querySelector('#video-test').classList.remove('faded');
        }
      });
    },
    initVideoCapture(deviceInfos) {
      return new Promise((resolve, reject) => {
        for (let i = 0; i <= deviceInfos.length; i++) {
          const device = deviceInfos[i]
          if (typeof device === 'undefined') {
            continue
          }
          switch (device.kind) {
            case 'videoinput':
              if (typeof device.id !== 'undefined') {
                if (device.id === 'default' || device.name.indexOf('front') > 0 || this.streamSettings.videoinput === null) {
                  this.streamSettings.videoinput = device
                }
              }
          }
        }
        if (this.streamSettings.videoinput === null) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('cannot find front camera')
        } else {
          resolve(this.streamSettings.videoinput)
        }
      }).catch((error) => {
        console.error('error initVideoCapture', error);
        this.$captureException(error);
      })
    },
    startStream(videoID) {
      this.$closeStream();
      if (this.streamSettings.videoinput !== undefined) {
        const videoSource = this.streamSettings.videoinput.deviceId
        const maxHeight = (window.innerHeight % 2 === 0) ? window.innerHeight : window.innerHeight - 1
        const maxWidth = (window.innerWidth % 2 === 0) ? window.innerWidth : window.innerWidth - 1
        const constraints = {
          audio: false,
          video: {
            deviceId: videoSource ? {exact: videoSource} : undefined,
            frameRate: 25,
            facingMode: 'user',
            width: {ideal: 640, max: maxWidth},
            height: {ideal: 360, max: maxHeight}
          }
        }
        console.log('init with constraints', constraints, JSON.stringify(constraints));
        const TESTvideoElement = document.getElementById(videoID)
        if (TESTvideoElement) {
          return
        }
        this.$initVideo(constraints).then((stream) => {
          window.stream = stream // make stream available to console
          const videoElement = document.getElementById(videoID)
          videoElement.srcObject = window.stream
          this.$emit('postmessage', {
            "event": "finishinitStream",
            "data": false
          });
          this.fixCameraSize();
        }).catch((e) => {
          console.error('Impossibile avviare stream:', e)
          console.log('Device rilevati', this.getVideoDevices, this.getAudioDevices, JSON.stringify(this.getVideoDevices), JSON.stringify(this.getAudioDevices));
          console.error('Verifica constraint disponibili', navigator.mediaDevices.getSupportedConstraints())
          this.$captureException(e);
          this.deviceNotSupported()
        }).finally(() => {

        });
      } else {
        this.deviceNotSupported()
      }
    },
    deviceNotSupported() {
      this.$emit('postmessage', {
        "event": "devicenotsupported",
        "data": false
      });
      this.$root.$emit('showError', {
        hasretry: false,
        title: this.$t('errors.camera.title'),
        error: this.$t('errors.camera.description'),
        click: null,
        resetEvent: function () {
          $nuxt.$router.replace($nuxt.localePath("/"));
          return true;
        }
      });
    }
  },
  mounted() {
    if (this.isCameraOpen === false) {
      this.$emit('postmessage', {
        "event": "initVideoCapture",
        "data": false
      });
      this.initVideoDevices().then((videodevices) => {
        return this.initVideoCapture(videodevices).then(() => {
          this.$emit('postmessage', {
            "event": "initStream",
            "data": false
          });
          this.isLoading = false;
          this.isCameraOpen = true

          this.startStream('video-test')
        }).catch((e) => {
          console.error('cam tester mounted exception:', e);
          this.$captureException(e);
          this.deviceNotSupported()
        });
      }).catch((e) => {
        console.error('cam tester mounted exception:', e);
        this.$captureException(e);
        this.deviceNotSupported()
      })

    }
  }
}
</script>
