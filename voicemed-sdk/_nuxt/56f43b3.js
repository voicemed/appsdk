(window.webpackJsonp=window.webpackJsonp||[]).push([[26,4,11],{1017:function(e,t,i){"use strict";i.r(t);i(27),i(3),i(4),i(7),i(8),i(9);var r=i(114),n=i(26),s=(i(0),i(5),i(37),i(28),i(62),i(41),i(932)),o=i(47);function a(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,r)}return i}function c(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?a(Object(i),!0).forEach((function(t){Object(n.a)(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):a(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var u={name:"setup",mixins:[s.a],data:function(){return{exid:this.$route.params.id,programid:this.$route.params.fromprogram||!1,withindex:this.$route.params.withindex||!1,backto:this.$route.params.backto||!1,name:"setup",step:0,stepLast:3,useTutorial:!1,hasTutorial:!1,animate:!0,hasBack:!0,hasInfo:!1,grantAsked:!1,computeVideOverlayHeight:null,skipPermissions:!1,hasNext:!0,uuid:"0",about:{show:!1}}},beforeRouteLeave:function(e,t,i){null!=window.stream&&window.stream.getTracks().forEach((function(e){e.stop()})),this.$root.$emit("showPager",{show:!0}),window.stream=null,i()},computed:c(c({},Object(o.d)({getExercises:"getExercises",getCurrentExercise:"getCurrentExercise",skipTutorial:"skipTutorial"})),{},{exercise:function(){return this.getCurrentExercise},playerId:function(){return"player-"+this.uuid}}),watch:{step:function(){this.$root.$emit("showPager",{show:!0})}},methods:c(c({},Object(o.c)({setSkipTutorial:"setSkipTutorial",setCurrentExerciseIndex:"setCurrentExerciseIndex",setCurrentExerciseById:"setCurrentExerciseById"})),{},{fixVideoHeight:function(e,t){var i=e/t,r=document.getElementById("playerAreaTutorial");if(r){var n=document.body.clientHeight,s=document.body.clientWidth,o=r.closest(".fullPageCard"),a=o.querySelector("div.header"),c=o.querySelector("div.footer"),u=document.querySelector(".pager");a&&(n-=a.scrollHeight),c&&(n-=c.scrollHeight),u&&(n-=u.scrollHeight);var l=Math.min(n,o.scrollHeight-((a?a.scrollHeight:0)+(c?c.scrollHeight:0)));r.style.height=l+"px",r.style.width=l*i+"px",o.querySelector("div.body").style.height=l-4+"px",o.querySelector("div.body").style.overflow="hidden",o.querySelector("div.body").classList.remove("horizontal"),l*i>s&&(o.querySelector("div.body").classList.add("horizontal"),r.style.width=s+"px",r.style.height=s/i+"px")}},getImage:function(e){return-1!==e.indexOf("~/assets")?i(948)(e):e},closeInfo:function(){this.about.show=!1},infoStep:function(){this.about.show=!0},oncameraupdate:function(e){"initVideoCapture"===e.event&&(this.hasNext=!1),"finishinitStream"===e.event&&(this.hasNext=!0)},blockClick:function(){return this.exerciseStepBack(),!0},moveToNext:function(){var e=this;this.$capacitor.isNativePlatform()?this.$airlyn.checkMicPerm().then((function(t){if(t&&!0===t.result)e.startExercise();else{var i={name:"NotAllowedError",exception:t};e.manageMicError(i,null,(function(){return this.exerciseStepBack(),!0}))}})).catch((function(t){e.manageMicError({name:"NotAllowedError",exception:t},null,(function(){return this.exerciseStepBack(),!0}))})):this.$checkPermissions().then((function(t){window.stream=t,e.startExercise()})).catch((function(t){e.$captureException(t),e.manageMicCamError(t,null,(function(){return this.exerciseStepBack(),!0}))})).finally((function(){e.$nuxt.$loading.finish(),e.$closeStream()}))},allowClick:function(){var e=this;this.$closeStream(),this.$nuxt.$loading.start(),this.grantAsked=!0,this.$capacitor.isNativePlatform()?this.$airlyn.requestWholePermissions().then((function(t){!t||!0!==t.storage||!0!==t["voice recording"]&&!0!==t.microphone?e.manageMicCamError({name:"NotAllowedError"},null,(function(){return this.exerciseStepBack(),!0})):e.nextStep()})).catch((function(t){e.$captureException(t),e.manageMicCamError(t,null,(function(){return this.exerciseStepBack(),!0}))})).finally((function(){e.$nuxt.$loading.finish()})):this.$checkPermissions().then((function(t){window.stream=t,e.nextStep()})).catch((function(t){e.$captureException(t),e.manageMicCamError(t,null,(function(){return this.exerciseStepBack(),!0}))})).finally((function(){e.$nuxt.$loading.finish(),e.$closeStream()}))},exitStep:function(){document.querySelector("#__nuxt")&&document.querySelector("#__nuxt").classList.add("quit"),this.exerciseStepBack()},prevStep:function(){var e=this;!0!==this.about.show?(this.$el.classList.add("back"),this.animate=!1,this.step<=0&&this.$router.back(),2===this.step&&!1!==this.hasTutorial?this.step=0:this.step-=0===this.step?0:1,this.$nextTick((function(){e.animate=!0,e.$forceNextTick((function(){Object(r.a)(e.$el.querySelectorAll(".hide")).map((function(e){return e.classList.remove("hide")}))}))}))):this.closeInfo()},startExercise:function(){var e=this.buildSuffix();e.length>0&&(e="/"+e),this.exercise.type===this.$exerciseManager.kindHOLD?this.$router.push($nuxt.localePath("/ml/exercises/"+this.exid+"/runnersilent"+e)):this.$router.push($nuxt.localePath("/ml/exercises/"+this.exid+"/runner"+e))},nextStep:function(){var e=this;this.$el&&this.$el.classList&&this.$el.classList.remove("back"),this.setSkipTutorial(this.useTutorial),this.animate=!1,this.step!=this.stepLast-1||!1!==this.grantAsked?this.step<2&&!1!==this.hasTutorial?this.moveToNext():(this.step!==this.stepLast&&this.skipPermissions?this.step=this.stepLast:this.step+=1,this.step==this.stepLast&&(this.hasNext=!1,this.exercise.type===this.$exerciseManager.kindHOLD&&(this.step+=1)),this.step>this.stepLast&&this.startExercise(),this.$nextTick((function(){e.animate=!0}))):this.allowClick()},generateUUID:function(){return"xxxxxxxx-xxxx-4xxx".replace(/[xy]/g,(function(e){var t;return t=16*Math.random()|0,("x"===e?t:3&t|8).toString(16)}))},_handleLoaded:function(){var e=this;this.video.readyState>=2?(this.$nextTick((function(){e.fixVideoHeight(e.video.videoWidth,e.video.videoHeight)})),this.video.classList.remove("hide"),this.step<2&&this.video.play()):(this.$root.$emit("showToast","Cannot reproduce tutorial","error"),this.nextStep())},_handleEnd:function(){this.nextStep()}}),mounted:function(){var e=this;this.$capacitor.isNativePlatform()&&this.$airlyn.checkWholePermissions().then((function(t){var i=["granted",!0],r=!1;["storage","voice recording"].map((function(e){r=-1!==i.indexOf(t[e])})),e.skipPermissions=r})),this.useTutorial=this.skipTutorial,this.getCurrentExercise&&this.getCurrentExercise.type===this.$exerciseManager.kindHOLD&&(this.stepLast=2),this.getCurrentExercise&&this.getCurrentExercise.tutorialVideo?(this.uuid=this.generateUUID(),this.hasTutorial=this.getCurrentExercise.tutorialVideo,this.$nextTick((function(){e.video=e.$el.querySelectorAll("video")[0],e.$root.$emit("setNextText",e.$t("generic.next")),e.video.addEventListener("loadeddata",e._handleLoaded),e.video.addEventListener("ended",e._handleEnd),e.$root.$emit("disableNext",!1),e.video.load()}))):this.useTutorial&&(this.step=2)},beforeDestroy:function(){this.video&&(this.video.removeEventListener("loadeddata",this._handleLoaded),this.video.removeEventListener("ended",this._handleEnd))}},l=i(39),d=Object(l.a)(u,(function(){var e=this,t=e._self._c;return e.animate?t("fullpage-card",{class:[e.step==e.stepLast?"no-header":"","setupPage",2!=e.step&&!1!==e.hasTutorial?"with-tutorial":""],attrs:{hidefooter:!0},scopedSlots:e._u([e.step<e.stepLast?{key:"header",fn:function(){return[t("v-row",{staticClass:"navigation",attrs:{"align-content":"center",justify:"space-between"}},[t("v-btn",{attrs:{icon:""},on:{click:e.exitStep}},[t("v-icon",[e._v("mdi-close-circle-outline")])],1),e._v(" "),e.getCurrentExercise?t("div",{staticClass:"exercise__title"},[!1!==e.hasTutorial&&0===e.step?t("span",[e._v("How it works")]):t("span",{domProps:{innerHTML:e._s(e.getCurrentExercise.title)}})]):e._e(),e._v(" "),t("v-btn",{staticStyle:{opacity:"0"},attrs:{icon:""}},[t("v-icon",[e._v("mdi-information-outline")])],1)],1),e._v(" "),!1===e.hasTutorial?t("div",{staticClass:"text-center"},[t("div",{domProps:{innerHTML:e._s(e.$t(e.name+".title_"+e.step))}})]):e._e()]},proxy:!0}:null,{key:"body",fn:function(){return[t("transition",{attrs:{appear:"",name:"fade"}},[e.step<e.stepLast&&(!1===e.hasTutorial||2===e.step)?t("v-flex",{staticClass:"text-center exercise__body",attrs:{"align-self-center":""}},[t("img",{attrs:{src:e.getImage(e.$t(e.name+".image_"+e.step))}}),e._v(" "),t("p",{staticClass:"pt-10",domProps:{innerHTML:e._s(e.$t(e.name+".description_"+e.step))}}),e._v(" "),0===e.step?t("div",{staticClass:"text-center skipcnt"},[t("v-checkbox",{attrs:{color:"primary",label:e.$t("setup.skip")},model:{value:e.useTutorial,callback:function(t){e.useTutorial=t},expression:"useTutorial"}})],1):e._e()]):e._e(),e._v(" "),2!=e.step&&e.step<e.stepLast&&!1!==e.hasTutorial?t("div",{staticClass:"playerArea video tutorial",attrs:{id:"playerAreaTutorial"}},[t("video",{ref:"videofile",staticClass:"hide",attrs:{id:e.playerId,loop:!1,controls:"",playsinline:"",poster:e.getCurrentExercise.tutorialVideoThumbnail?e.getCurrentExercise.tutorialVideoThumbnail:"",src:e.hasTutorial,preload:"auto"}})]):e._e(),e._v(" "),e.step==e.stepLast?t("div",{staticClass:"video__container"},[t("camtester",{on:{postmessage:e.oncameraupdate}})],1):e._e()],1),e._v(" "),e.getCurrentExercise?t("infodialog",{attrs:{show:e.about.show,contentclasses:"infoContent",title:e.getCurrentExercise.title,description:e.getCurrentExercise.about||"",infoImage:e.getCurrentExercise.aboutImage||e.getCurrentExercise.thumbnail},on:{close:e.closeInfo},scopedSlots:e._u([{key:"closebtn",fn:function(){return[e._v("Alright")]},proxy:!0}],null,!1,2600066686)}):e._e()]},proxy:!0}],null,!0)}):e._e()}),[],!1,null,null,null);t.default=d.exports;installComponents(d,{Camtester:i(962).default,Infodialog:i(931).default,FullpageCard:i(181).default})},930:function(e,t,i){"use strict";i(4),i(7),i(8),i(5),i(9);var r=i(26),n=(i(0),i(28),i(62),i(63),i(27),i(3),i(37),i(47));function s(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,r)}return i}function o(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?s(Object(i),!0).forEach((function(t){Object(r.a)(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):s(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}t.a={name:"basePage",transition:{name:"slide",mode:"out-in",css:!1,beforeEnter:function(e){if(!document.querySelector("#__nuxt").classList.contains("quit")){var t=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime.set(e,{scale:1,opacity:0,translateX:t})}},enter:function(e,t){var i=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime({targets:e,opacity:[0,1],translateX:[i,"0"],duration:500,easing:"easeInOutSine",complete:t})},leave:function(e,t){if(document.querySelector("#__nuxt").classList.contains("quit"))this.$anime({targets:e,translateY:[0,"100%"],duration:500,easing:"easeInOutSine",complete:t});else{var i=document.querySelector("#__nuxt").classList.contains("back")?"100%":"-100%";this.$anime({targets:e,opacity:[1,0],translateX:["0",i],duration:500,easing:"easeInOutSine",complete:t})}},afterLeave:function(e){document.querySelector("#__nuxt").classList.remove("quit"),document.querySelector("#__nuxt").classList.remove("back")}},data:function(){return{name:"basePage",exid:this.$route.params.id,programid:this.$route.params.fromprogram||!1,withindex:this.$route.params.withindex||-1,backto:this.$route.params.backto||!1,hasBack:!1,hasNext:!1,hasInfo:!1}},computed:o(o({},Object(n.d)({getCurrentPagerHeight:"getCurrentPagerHeight"})),{},{isVoicemed:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")>-1},isAirlyn:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")<0},nuxtloading:function(){return $nuxt.$loading.loading},defaultHomeUrl:function(){return"/"}}),methods:o(o({},Object(n.c)({setCurrentPage:"setCurrentPage",setCurrentPagerHeight:"setCurrentPagerHeight"})),{},{exerciseStepBack:function(){if("standalone"==this.backto||"challengemode"==this.backto)return $nuxt.$airlyn.finishExercise({reason:"user-cancelled",result:{}}).finally((function(){})),void $nuxt.$airlyn.closeExercise().finally((function(){}));"today"!=this.backto?"discovery"!=this.backto?this.programid?"-1"==this.programid||-1==this.programid||"false"==this.programid||0==this.programid?$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/ml/programs/"+this.programid)):$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/home")):$nuxt.$router.replace($nuxt.localePath("/user/today"))},buildSuffix:function(){var e=[],t=!!this.programid&&this.programid;return e.push("-1"!==t&&t),e.push(this.withindex?this.withindex:"-1"),e.push(!!this.backto&&this.backto),e.join("/")},hasJoinedProgramById:function(e){return this.$nuxt.$store.getters.hasJoinedProgramById(e)},getProgramJoinedAtById:function(e){return this.$nuxt.$store.getters.getProgramJoinedAtById(e)},getProgramById:function(e){return this.$nuxt.$store.getters.getProgramById(e)},getOverallProgressProgramById:function(e){return this.$nuxt.$store.getters.getOverallProgressProgramById(e)},getDoneCountByProgramId:function(e){return this.$nuxt.$store.getters.getDoneCountByProgramId(e)},getNextExerciseByProgramId:function(e){return this.$nuxt.$store.getters.getNextExerciseByProgramId(e)},getExercisetocompleteCountProgramById:function(e){return this.$nuxt.$store.getters.getExercisetocompleteCountProgramById(e)},getExercisecompletedCountProgramById:function(e){return this.$nuxt.$store.getters.getExercisecompletedCountProgramById(e)},printDeviceError:function(e,t,i,r){this.$analytics.logEvent("permission_error",{title:"errors."+e+"."+t.name.toLowerCase()+".title",kind:e}),!t||"NotAllowedError"!==t.name&&"NotFoundError"!==t.name&&"denied"!=t.exception.state&&"DENIED"!=t.exception.state?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),i,r):this.$root.$emit("showPermssionError",!0)},printDeviceErrorOLD:function(e,t,i,r){if(this.$analytics.logEvent("permission_error",{title:"errors."+e+"."+t.name.toLowerCase()+".title",kind:e}),t.exception&&"mic"==e&&("denied"==t.exception.state||"DENIED"==t.exception.state))return t.name="DeniedError",void this.$root.$emit("showError",{title:this.$t("errors."+e+"."+t.name.toLowerCase()+".title"),error:this.$t("errors."+e+"."+t.name.toLowerCase()+".description"),hasretry:!0,click:function(){return $nuxt.$airlyn.openPermissionPanel().then((function(e){})).catch((function(e){})).finally((function(){"function"==typeof r&&r()})),!0},resetEvent:r||function(){},retryBtn:"Settings"});!t||"NotAllowedError"!==t.name&&"NotFoundError"!==t.name?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),i,r):this.showError(this.$t("errors."+e+"."+t.name.toLowerCase()+".title"),this.$t("errors."+e+"."+t.name.toLowerCase()+".description"),i,r)},manageMicError:function(e,t,i){this.printDeviceError("mic",e,t,i)},manageCamError:function(e,t,i){this.printDeviceError("cam",e,t,i)},manageMicCamError:function(e,t,i){this.printDeviceError("miccam",e,t,i)},showError:function(e,t,i,r){this.$root.$emit("showError",{title:e,error:t,hasretry:null!==i,click:i||function(){},resetEvent:r||function(){}})},swipeEvent:function(e){this.$root.$emit("swipe",e)},attachSwipeListener:function(){document.addEventListener("swiped-left",this.swipeEvent),document.addEventListener("swiped-right",this.swipeEvent)},detachSwipeListeners:function(){document.removeEventListener("swiped-left",this.swipeEvent),document.removeEventListener("swiped-right",this.swipeEvent)},fixWindowVariables:function(e){void 0===window[e]&&"undefined"!==window.top[e]&&(window[e]=window.top[e])}}),beforeMount:function(){var e=this;["currentChallenge","currentExercise","currentVMToken","currentVMKey","currentVMUrl"].forEach((function(t){e.fixWindowVariables(t)})),this.setCurrentPage(this)},beforeDestroy:function(){this.detachSwipeListeners()},mounted:function(){var e=this;this.dynamicTexts&&Object.keys(this.dynamicTexts).length>0&&Object.keys(this.dynamicTexts).map((function(t){e.$appConfiguration.getText(t).then((function(i){e.dynamicTexts[t]=i})).catch((function(i){e.dynamicTexts[t]=e.$t(e.name+"."+t)}))})),null!==this.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager"),this.$nextTick((function(){e.attachSwipeListener(),null===e.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager")&&e.setCurrentPagerHeight(Math.max(document.querySelector(".v-main__wrap > div.pager").clientHeight,document.querySelector(".v-main__wrap > div.pager").offsetHeight))}))}}},931:function(e,t,i){"use strict";i.r(t);i(4),i(51);var r={props:{title:{type:String,default:"Info"},transition:{type:String,default:"dialog-bottom-transition"},contentclasses:{type:String,default:""},description:{type:String,default:"Info text"},infoImage:{type:String,default:null},showSuperTitle:{type:Boolean,default:!0},thumbInTitle:{type:Boolean,default:!0},show:{type:Boolean,default:!1}},data:function(){return{}},computed:{showDialog:function(){return this.show}},methods:{closeClick:function(e){this.$emit("close",e)}},mounted:function(){}},n=i(39),s=Object(n.a)(r,(function(){var e=this,t=e._self._c;return t("v-dialog",{attrs:{fullscreen:"","hide-overlay":"",transition:e.transition,scrollable:"","content-class":"infoDialog "+e.contentclasses},model:{value:e.showDialog,callback:function(t){e.showDialog=t},expression:"showDialog"}},[t("fullpage-card",{scopedSlots:e._u([{key:"header",fn:function(){return[t("div",{class:[(e.showSuperTitle?"with":"without")+"__supertitle",(e.thumbInTitle?"with":"without")+"__thumbInTitle"]},[e.showSuperTitle?t("div",{staticClass:"text-center supertitle"},[e._v("About")]):e._e(),e._v(" "),e.infoImage&&!0===e.thumbInTitle?t("img",{staticClass:"titleImage",attrs:{src:e.infoImage}}):e._e(),e._v(" "),t("div",{staticClass:"text-center infodialog__title",domProps:{innerHTML:e._s(e.title)}})])]},proxy:!0},{key:"body",fn:function(){return[t("div",{staticClass:"text-center content"},[e.infoImage&&!1===e.thumbInTitle?t("img",{staticClass:"errorimage",attrs:{src:e.infoImage}}):e._e(),e._v(" "),t("span",{class:[e.contentclasses,"withdynamicTexts"],domProps:{innerHTML:e._s(e.description)}})])]},proxy:!0},{key:"footer",fn:function(){return[t("div",{class:["pager"]},[t("v-btn",{attrs:{color:"nextvm",nuxt:""},on:{click:e.closeClick}},[e._t("closebtn",(function(){return[t("v-icon",[e._v("mdi-reload")]),e._v(" "),t("span",{domProps:{innerHTML:e._s(e.$t("generic.done"))}})]}))],2)],1)]},proxy:!0}],null,!0)})],1)}),[],!1,null,null,null);t.default=s.exports;installComponents(s,{FullpageCard:i(181).default})},932:function(e,t,i){"use strict";i(3),i(4),i(7),i(0),i(8),i(5),i(9);var r=i(26),n=i(930),s=i(47);function o(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,r)}return i}function a(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?o(Object(i),!0).forEach((function(t){Object(r.a)(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):o(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}t.a={name:"expage",mixins:[n.a],computed:a(a({},Object(s.d)({getExercises:"getExercises",getCurrentExercise:"getCurrentExercise"})),{},{exercise:function(){return this.getCurrentExercise}}),mounted:function(){this.getExercises,this.getExercises.length}}},935:function(e,t,i){var r=i(950);r.__esModule&&(r=r.default),"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);(0,i(137).default)("efabf284",r,!1,{sourceMap:!1})},948:function(e,t){function i(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}i.keys=function(){return[]},i.resolve=i,e.exports=i,i.id=948},949:function(e,t,i){"use strict";i(935)},950:function(e,t,i){var r=i(136)((function(e){return e[1]}));r.push([e.i,".svgMasks{height:100%;margin:0 auto;width:100%}",""]),r.locals={},e.exports=r},962:function(e,t,i){"use strict";i.r(t);i(3),i(4),i(7),i(8),i(5),i(9);var r=i(26),n=(i(0),i(27),i(28),i(62),i(47));function s(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,r)}return i}function o(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?s(Object(i),!0).forEach((function(t){Object(r.a)(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):s(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var a={data:function(){return{isCameraOpen:!1,isLoading:!0,computeVideOverlayHeight:null,streamSettings:{videoinput:null},svgMask:{height:0,width:0,maskH:0,maskW:0,maskX:0,maskY:0}}},computed:o({},Object(n.d)({getVideoDevices:"getVideoDevices",getAudioDevices:"getAudioDevices"})),methods:o(o({},Object(n.c)({setVideoDevices:"setVideoDevices",setAudioDevices:"setAudioDevices",clearMediaDevices:"clearMediaDevices"})),{},{initVideoDevices:function(){var e=this;return null===this.getVideoDevices||Array.isArray(this.getVideoDevices)&&0===this.getVideoDevices.length?(this.clearMediaDevices(),this.$enumerateMediaDevices().then((function(t){return e.setVideoDevices(t.video),e.setAudioDevices(t.audio),e.getVideoDevices})).catch((function(t){e.$captureException(t)}))):new Promise((function(t,i){t(e.getVideoDevices)}))},fixCameraSize:function(){var e=this;this.$nextTick((function(){if(document.querySelector(".video__overlay")){document.querySelector(".video__container").style.width=window.innerWidth+"px";var t=document.querySelector(".video__overlay .video__message").clientHeight;if(!e.computeVideOverlayHeight){document.querySelector(".video__overlay").clientHeight;e.computeVideOverlayHeight=t}document.querySelector(".video__overlay").style.paddingBottom=e.computeVideOverlayHeight+"px",document.querySelector(".cameraWrapper").style.paddingBottom=e.computeVideOverlayHeight+"px";document.querySelector(".cameraWrapper").clientHeight;e.svgMask.width=window.innerWidth,e.svgMask.height=document.querySelector(".cameraWrapper").clientHeight-t,e.svgMask.maskW=.8*e.svgMask.width/2,e.svgMask.maskH=.7*e.svgMask.height/2,e.svgMask.maskW/e.svgMask.maskH>.8&&(e.svgMask.maskH=.85*e.svgMask.height/2,e.svgMask.maskW=Math.min(.7*e.svgMask.width/2,e.svgMask.maskH/3*2)),e.svgMask.maskX=e.svgMask.width/2,e.svgMask.maskY=e.svgMask.height/2,document.querySelector(".video__overlay").classList.remove("faded"),document.querySelector("#video-test").classList.remove("faded")}}))},initVideoCapture:function(e){var t=this;return new Promise((function(i,r){for(var n=0;n<=e.length;n++){var s=e[n];if(void 0!==s&&"videoinput"===s.kind)void 0!==s.id&&("default"===s.id||s.name.indexOf("front")>0||null===t.streamSettings.videoinput)&&(t.streamSettings.videoinput=s)}null===t.streamSettings.videoinput?r("cannot find front camera"):i(t.streamSettings.videoinput)})).catch((function(e){t.$captureException(e)}))},startStream:function(e){var t=this;if(this.$closeStream(),void 0!==this.streamSettings.videoinput){var i=this.streamSettings.videoinput.deviceId,r=window.innerHeight%2==0?window.innerHeight:window.innerHeight-1,n={audio:!1,video:{deviceId:i?{exact:i}:void 0,frameRate:25,facingMode:"user",width:{ideal:640,max:window.innerWidth%2==0?window.innerWidth:window.innerWidth-1},height:{ideal:360,max:r}}};if(document.getElementById(e))return;this.$initVideo(n).then((function(i){window.stream=i,document.getElementById(e).srcObject=window.stream,t.$emit("postmessage",{event:"finishinitStream",data:!1}),t.fixCameraSize()})).catch((function(e){t.$captureException(e),t.deviceNotSupported()})).finally((function(){}))}else this.deviceNotSupported()},deviceNotSupported:function(){this.$emit("postmessage",{event:"devicenotsupported",data:!1}),this.$root.$emit("showError",{hasretry:!1,title:this.$t("errors.camera.title"),error:this.$t("errors.camera.description"),click:null,resetEvent:function(){return $nuxt.$router.replace($nuxt.localePath("/")),!0}})}}),mounted:function(){var e=this;!1===this.isCameraOpen&&(this.$emit("postmessage",{event:"initVideoCapture",data:!1}),this.initVideoDevices().then((function(t){return e.initVideoCapture(t).then((function(){e.$emit("postmessage",{event:"initStream",data:!1}),e.isLoading=!1,e.isCameraOpen=!0,e.startStream("video-test")})).catch((function(t){e.$captureException(t),e.deviceNotSupported()}))})).catch((function(t){e.$captureException(t),e.deviceNotSupported()})))}},c=(i(949),i(39)),u=Object(c.a)(a,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"video__wrapper"},[t("div",{staticClass:"cameraWrapper"},[e.isLoading?t("div",{staticClass:"loading"},[e._v("\n       \n    ")]):e._e(),e._v(" "),e.isCameraOpen&&!e.isLoading?t("video",{staticClass:"animated faded",attrs:{id:"video-test",playsinline:"",autoplay:"",muted:""},domProps:{muted:!0}}):e._e()]),e._v(" "),e.isCameraOpen&&!e.isLoading?t("div",{staticClass:"video__overlay animated faded"},[t("svg",{staticClass:"svgMasks",style:"enable-background:new 0 0 "+e.svgMask.width+" "+e.svgMask.height+"; width:"+e.svgMask.width+"px !important;height:"+e.svgMask.height+"px !important;",attrs:{version:"1.1",id:"Livello_1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",x:"0px",y:"0px",viewBox:"0 0 "+e.svgMask.width+" "+e.svgMask.height,"xml:space":"preserve"}},[t("mask",{attrs:{id:"myMask"}},[t("rect",{attrs:{x:"0",y:"0",width:e.svgMask.width,height:e.svgMask.height,fill:"white"}}),e._v(" "),t("ellipse",{attrs:{cx:e.svgMask.maskX,cy:e.svgMask.maskY,rx:e.svgMask.maskW,ry:e.svgMask.maskH,fill:"black"}})]),e._v(" "),t("rect",{staticStyle:{fill:"rgba(0,0,0,0.4)"},attrs:{x:"0",y:"0",width:e.svgMask.width,height:e.svgMask.height,mask:"url(#myMask)"}})]),e._v(" "),t("div",{staticClass:"video__message"},[t("div",{domProps:{innerHTML:e._s(e.$t("generic.camera_warning_title"))}}),e._v(" "),t("span",{domProps:{innerHTML:e._s(e.$t("generic.camera_warning"))}})])]):e._e()])}),[],!1,null,null,null);t.default=u.exports}}]);
//# sourceMappingURL=56f43b3.js.map