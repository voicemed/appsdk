(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{933:function(e,t,i){var s=i(948);s.__esModule&&(s=s.default),"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);(0,i(135).default)("efabf284",s,!1,{sourceMap:!1})},947:function(e,t,i){"use strict";i(933)},948:function(e,t,i){var s=i(134)((function(e){return e[1]}));s.push([e.i,".svgMasks{height:100%;margin:0 auto;width:100%}",""]),s.locals={},e.exports=s},960:function(e,t,i){"use strict";i.r(t);i(3),i(4),i(7),i(8),i(5),i(9);var s=i(26),a=(i(0),i(27),i(28),i(62),i(46));function n(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,s)}return i}function r(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?n(Object(i),!0).forEach((function(t){Object(s.a)(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):n(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var o={data:function(){return{isCameraOpen:!1,isLoading:!0,computeVideOverlayHeight:null,streamSettings:{videoinput:null},svgMask:{height:0,width:0,maskH:0,maskW:0,maskX:0,maskY:0}}},computed:r({},Object(a.d)({getVideoDevices:"getVideoDevices",getAudioDevices:"getAudioDevices"})),methods:r(r({},Object(a.c)({setVideoDevices:"setVideoDevices",setAudioDevices:"setAudioDevices",clearMediaDevices:"clearMediaDevices"})),{},{initVideoDevices:function(){var e=this;return null===this.getVideoDevices||Array.isArray(this.getVideoDevices)&&0===this.getVideoDevices.length?(this.clearMediaDevices(),this.$enumerateMediaDevices().then((function(t){return e.setVideoDevices(t.video),e.setAudioDevices(t.audio),e.getVideoDevices})).catch((function(t){e.$captureException(t)}))):new Promise((function(t,i){t(e.getVideoDevices)}))},fixCameraSize:function(){var e=this;this.$nextTick((function(){if(document.querySelector(".video__overlay")){document.querySelector(".video__container").style.width=window.innerWidth+"px";var t=document.querySelector(".video__overlay .video__message").clientHeight;if(!e.computeVideOverlayHeight){document.querySelector(".video__overlay").clientHeight;e.computeVideOverlayHeight=t}document.querySelector(".video__overlay").style.paddingBottom=e.computeVideOverlayHeight+"px",document.querySelector(".cameraWrapper").style.paddingBottom=e.computeVideOverlayHeight+"px";document.querySelector(".cameraWrapper").clientHeight;e.svgMask.width=window.innerWidth,e.svgMask.height=document.querySelector(".cameraWrapper").clientHeight-t,e.svgMask.maskW=.8*e.svgMask.width/2,e.svgMask.maskH=.7*e.svgMask.height/2,e.svgMask.maskW/e.svgMask.maskH>.8&&(e.svgMask.maskH=.85*e.svgMask.height/2,e.svgMask.maskW=Math.min(.7*e.svgMask.width/2,e.svgMask.maskH/3*2)),e.svgMask.maskX=e.svgMask.width/2,e.svgMask.maskY=e.svgMask.height/2,document.querySelector(".video__overlay").classList.remove("faded"),document.querySelector("#video-test").classList.remove("faded")}}))},initVideoCapture:function(e){var t=this;return new Promise((function(i,s){for(var a=0;a<=e.length;a++){var n=e[a];if(void 0!==n&&"videoinput"===n.kind)void 0!==n.id&&("default"===n.id||n.name.indexOf("front")>0||null===t.streamSettings.videoinput)&&(t.streamSettings.videoinput=n)}null===t.streamSettings.videoinput?s("cannot find front camera"):i(t.streamSettings.videoinput)})).catch((function(e){t.$captureException(e)}))},startStream:function(e){var t=this;if(this.$closeStream(),void 0!==this.streamSettings.videoinput){var i=this.streamSettings.videoinput.deviceId,s=window.innerHeight%2==0?window.innerHeight:window.innerHeight-1,a={audio:!1,video:{deviceId:i?{exact:i}:void 0,frameRate:25,facingMode:"user",width:{ideal:640,max:window.innerWidth%2==0?window.innerWidth:window.innerWidth-1},height:{ideal:360,max:s}}};if(document.getElementById(e))return;this.$initVideo(a).then((function(i){window.stream=i,document.getElementById(e).srcObject=window.stream,t.$emit("postmessage",{event:"finishinitStream",data:!1}),t.fixCameraSize()})).catch((function(e){t.$captureException(e),t.deviceNotSupported()})).finally((function(){}))}else this.deviceNotSupported()},deviceNotSupported:function(){this.$emit("postmessage",{event:"devicenotsupported",data:!1}),this.$root.$emit("showError",{hasretry:!1,title:this.$t("errors.camera.title"),error:this.$t("errors.camera.description"),click:null,resetEvent:function(){return $nuxt.$router.replace($nuxt.localePath("/")),!0}})}}),mounted:function(){var e=this;!1===this.isCameraOpen&&(this.$emit("postmessage",{event:"initVideoCapture",data:!1}),this.initVideoDevices().then((function(t){return e.initVideoCapture(t).then((function(){e.$emit("postmessage",{event:"initStream",data:!1}),e.isLoading=!1,e.isCameraOpen=!0,e.startStream("video-test")})).catch((function(t){e.$captureException(t),e.deviceNotSupported()}))})).catch((function(t){e.$captureException(t),e.deviceNotSupported()})))}},c=(i(947),i(42)),d=Object(c.a)(o,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"video__wrapper"},[t("div",{staticClass:"cameraWrapper"},[e.isLoading?t("div",{staticClass:"loading"},[e._v("\n       \n    ")]):e._e(),e._v(" "),e.isCameraOpen&&!e.isLoading?t("video",{staticClass:"animated faded",attrs:{id:"video-test",playsinline:"",autoplay:"",muted:""},domProps:{muted:!0}}):e._e()]),e._v(" "),e.isCameraOpen&&!e.isLoading?t("div",{staticClass:"video__overlay animated faded"},[t("svg",{staticClass:"svgMasks",style:"enable-background:new 0 0 "+e.svgMask.width+" "+e.svgMask.height+"; width:"+e.svgMask.width+"px !important;height:"+e.svgMask.height+"px !important;",attrs:{version:"1.1",id:"Livello_1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",x:"0px",y:"0px",viewBox:"0 0 "+e.svgMask.width+" "+e.svgMask.height,"xml:space":"preserve"}},[t("mask",{attrs:{id:"myMask"}},[t("rect",{attrs:{x:"0",y:"0",width:e.svgMask.width,height:e.svgMask.height,fill:"white"}}),e._v(" "),t("ellipse",{attrs:{cx:e.svgMask.maskX,cy:e.svgMask.maskY,rx:e.svgMask.maskW,ry:e.svgMask.maskH,fill:"black"}})]),e._v(" "),t("rect",{staticStyle:{fill:"rgba(0,0,0,0.4)"},attrs:{x:"0",y:"0",width:e.svgMask.width,height:e.svgMask.height,mask:"url(#myMask)"}})]),e._v(" "),t("div",{staticClass:"video__message"},[t("div",{domProps:{innerHTML:e._s(e.$t("generic.camera_warning_title"))}}),e._v(" "),t("span",{domProps:{innerHTML:e._s(e.$t("generic.camera_warning"))}})])]):e._e()])}),[],!1,null,null,null);t.default=d.exports}}]);
//# sourceMappingURL=8dfe035.js.map