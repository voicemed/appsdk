(window.webpackJsonp=window.webpackJsonp||[]).push([[27,10],{923:function(e,t,i){"use strict";i(5),i(7),i(8),i(9);var r=i(179),n=i(24),o=i(26),s=(i(98),i(0),i(28),i(62),i(63),i(27),i(37),i(221),i(10),i(6),i(220),i(112),i(3),i(46));function a(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,r)}return i}function c(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?a(Object(i),!0).forEach((function(t){Object(o.a)(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):a(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}t.a={name:"basePage",transition:{name:"slide",mode:"out-in",css:!1,beforeEnter:function(e){if(!document.querySelector("#__nuxt").classList.contains("quit")){var t=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime.set(e,{scale:1,opacity:0,translateX:t})}},enter:function(e,t){var i=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime({targets:e,opacity:[0,1],translateX:[i,"0"],duration:500,easing:"easeInOutSine",complete:t})},leave:function(e,t){if(document.querySelector("#__nuxt").classList.contains("quit"))this.$anime({targets:e,translateY:[0,"100%"],duration:500,easing:"easeInOutSine",complete:t});else{var i=document.querySelector("#__nuxt").classList.contains("back")?"100%":"-100%";this.$anime({targets:e,opacity:[1,0],translateX:["0",i],duration:500,easing:"easeInOutSine",complete:t})}},afterLeave:function(e){document.querySelector("#__nuxt").classList.remove("quit"),document.querySelector("#__nuxt").classList.remove("back")}},data:function(){return{name:"basePage",exid:this.$route.params.id,programid:this.$route.params.fromprogram||!1,withindex:this.$route.params.withindex||-1,backto:this.$route.params.backto||!1,hasBack:!1,hasNext:!1,hasInfo:!1,currentTutorial:!1,tutorialList:[],tutorialShownHard:!1}},computed:c(c({},Object(s.d)({getCurrentPagerHeight:"getCurrentPagerHeight",getTutorialShown:"getTutorialShown",getLocalTutorialShown:"getLocalTutorialShown"})),{},{isVoicemed:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")>-1},isAirlyn:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")<0},nuxtloading:function(){return $nuxt.$loading.loading},defaultHomeUrl:function(){return"/user/today"}}),methods:c(c({},Object(s.c)({setCurrentPage:"setCurrentPage",setCurrentPagerHeight:"setCurrentPagerHeight",setTutorialRunPerPage:"setTutorialRunPerPage",setTutorialRun:"setTutorialRun"})),{},{setTutorialRunLocal:function(){this.setPreferenceTutorial()},tutorialClose:function(){this.$set(this,"tutorialList",[]),this.setTutorialRunLocal(),this.currentTutorial=null},tutorialHasNext:function(){var e=this.currentTutorial.index;return!!this.tutorialList.find((function(t){return t.index===e+1}))},exerciseStepBack:function(){console.log("exit test",this.backto,this.programid),"standalone"!=this.backto?"today"!=this.backto?"discovery"!=this.backto?this.programid?"-1"==this.programid||-1==this.programid||"false"==this.programid||0==this.programid?$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/ml/programs/"+this.programid)):$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/home")):$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$airlyn.finishExercise({reason:"user-cancelled",result:{}}).finally((function(){console.log("exercise finished by user")}))},buildSuffix:function(){var e=[],t=!!this.programid&&this.programid;return e.push("-1"!==t&&t),e.push(this.withindex?this.withindex:"-1"),e.push(!!this.backto&&this.backto),e.join("/")},tutorialNext:function(){var e=this.currentTutorial?this.currentTutorial.index:0;this.currentTutorial?(this.currentTutorial.visible=!1,this.setTutorialRunLocal()):e=this.tutorialList[0].index-1;var t=this.tutorialList.find((function(t){return t.index===e+1}));if(t){this.currentTutorial=t;t.position.height;var i=t.position.top>this.appHeight/2?t.position.top-210:t.position.top-10;t.arrowTop&&(i=t.position.top-(t.position.height+10)),i=Math.max(0,i),console.warn("Nuovo scroll Top:",i,this.appHeight,this.footerHeight,t.position.height),this.$nextTick((function(){document.querySelector(".indexPage").scrollTo({top:i,left:0,behavior:"smooth"})})),t.visible=!0}else this.tutorialClose()},getTutorialIndex:function(){return this.currentTutorial?this.currentTutorial.index>this.tutorialList.length?this.tutorialList.length:this.currentTutorial.index:""},getTutorialText:function(e){return this.$t("tutorials."+this.name+".text_"+e.index,{title:e.title})},getTutorialDialogStyle:function(e){var t={},i=e.position,r=i.top;return this.$capacitor&&this.$capacitor.isNativePlatform()&&0==e.updated&&(r=i.top,e.updated=!0,console.warn("apply tutorial offset for mobile phones")),t.top=r>300?r-200+"px":r+i.height+10+"px",console.warn("DialogStyle for tutorial",e,t),"fill"!==e.width?t.left="calc("+i.left+"px - 75vw + "+i.width+"px )":(t.left="0px",t.right="0px"),Object.entries(t).map((function(e){var t=Object(n.a)(e,2),i=t[0],r=t[1];return"".concat(i,":").concat(r)})).join(";")},getTutorialStyle:function(e){var t={},i=e.position,r=i.top;return this.$capacitor&&this.$capacitor.isNativePlatform()&&0==e.updated&&(r=i.top,e.updated=!0),console.warn("Style for tutorial",e,r),"fill"===e.width?(t.top=r-4+"px",t.left="0px",t.right="0px",t.height=i.height+8+"px"):(t.top=r-4+"px",t.left=i.left-4+"px",t.right="0px",t.height=i.height+8+"px",t.width=i.width+8+"px"),Object.entries(t).map((function(e){var t=Object(n.a)(e,2),i=t[0],r=t[1];return"".concat(i,":").concat(r)})).join(";")},initTutorial:function(){var e=this,t=Object(r.a)(document.querySelectorAll(".hastutorial")),i=!1;if(this.$capacitor&&this.$capacitor.isNativePlatform()?i=this.tutorialShownHard:(this.tutorialShownHard=this.$nuxt.$store.getters.getTutorialRun(this.name),i=this.$nuxt.$store.getters.getTutorialRunPerPage(this.name)),void 0!==this.getTutorialShown[this.name]||i||this.tutorialShownHard)console.warn("hide tutorial, not needed at this round");else{if(this.$set(this,"tutorialList",[]),t.length>0){document.querySelector(".indexPage").scrollTo({top:0,left:0,behavior:"smooth"});var n=this.getLocalTutorialShown;console.warn("got local tutorials",n),t.forEach((function(t){var i=parseInt(t.dataset.tutorialindex);if(void 0===n[e.name+"_"+i]){var r=t.getBoundingClientRect();e.tutorialList.push({position:r,visible:!1,itemRef:t,updated:!1,arrowTop:"top"==t.dataset.tutorialarrow,title:t.dataset.tutorial,width:t.dataset.tutorialwidth,index:i})}})),window.tutorialList=this.tutorialList}this.tutorialList.length>0&&(this.tutorialList=this.tutorialList.sort((function(e,t){return e.index>t.index?1:t.index>e.index?-1:0}))),this.tutorialList.length>0&&(this.currentTutorial=0,this.$nextTick((function(){setTimeout((function(){e.tutorialList.forEach((function(e){e.position=e.itemRef.getBoundingClientRect()})),e.tutorialNext(),e.setTutorialRunPerPage(e.name)}),200)})))}},hasJoinedProgramById:function(e){return this.$nuxt.$store.getters.hasJoinedProgramById(e)},getProgramJoinedAtById:function(e){return this.$nuxt.$store.getters.getProgramJoinedAtById(e)},getProgramById:function(e){return this.$nuxt.$store.getters.getProgramById(e)},getOverallProgressProgramById:function(e){return this.$nuxt.$store.getters.getOverallProgressProgramById(e)},getDoneCountByProgramId:function(e){return this.$nuxt.$store.getters.getDoneCountByProgramId(e)},getNextExerciseByProgramId:function(e){return this.$nuxt.$store.getters.getNextExerciseByProgramId(e)},getExercisetocompleteCountProgramById:function(e){return this.$nuxt.$store.getters.getExercisetocompleteCountProgramById(e)},getExercisecompletedCountProgramById:function(e){return this.$nuxt.$store.getters.getExercisecompletedCountProgramById(e)},printDeviceError:function(e,t,i,r){this.$analytics.logEvent("permission_error",{title:"errors."+e+"."+t.name.toLowerCase()+".title",kind:e}),console.error("Got device error",t),!t||"NotAllowedError"!==t.name&&"NotFoundError"!==t.name&&"denied"!=t.exception.state&&"DENIED"!=t.exception.state?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),i,r):this.$root.$emit("showPermssionError",!0)},printDeviceErrorOLD:function(e,t,i,r){if(this.$analytics.logEvent("permission_error",{title:"errors."+e+"."+t.name.toLowerCase()+".title",kind:e}),console.error("Got device error",t),t.exception&&"mic"==e&&("denied"==t.exception.state||"DENIED"==t.exception.state))return t.name="DeniedError",void this.$root.$emit("showError",{title:this.$t("errors."+e+"."+t.name.toLowerCase()+".title"),error:this.$t("errors."+e+"."+t.name.toLowerCase()+".description"),hasretry:!0,click:function(){return $nuxt.$airlyn.openPermissionPanel().then((function(e){console.log("got openPermission Panel then",e,JSON.stringify(e))})).catch((function(e){console.log("got openPermission Panel catch",e,JSON.stringify(e))})).finally((function(){"function"==typeof r&&(console.log("dopo il setting riport cmq a inizio"),r())})),!0},resetEvent:r||function(){},retryBtn:"Settings"});!t||"NotAllowedError"!==t.name&&"NotFoundError"!==t.name?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),i,r):this.showError(this.$t("errors."+e+"."+t.name.toLowerCase()+".title"),this.$t("errors."+e+"."+t.name.toLowerCase()+".description"),i,r)},manageMicError:function(e,t,i){this.printDeviceError("mic",e,t,i)},manageCamError:function(e,t,i){this.printDeviceError("cam",e,t,i)},manageMicCamError:function(e,t,i){this.printDeviceError("miccam",e,t,i)},showError:function(e,t,i,r){this.$root.$emit("showError",{title:e,error:t,hasretry:null!==i,click:i||function(){},resetEvent:r||function(){}})},swipeEvent:function(e){this.$root.$emit("swipe",e)},attachSwipeListener:function(){document.addEventListener("swiped-left",this.swipeEvent),document.addEventListener("swiped-right",this.swipeEvent)},detachSwipeListeners:function(){document.removeEventListener("swiped-left",this.swipeEvent),document.removeEventListener("swiped-right",this.swipeEvent)},retrievePreferenceTutorial:function(){var e=this;this.$capacitor&&this.$capacitor.isNativePlatform()&&this.$airlyn.preferenceConfigure({group:"airlyn"}).finally((function(){console.log("preferences ready");var t="tutorial_"+e.name;e.$airlyn.preferenceGet({key:t}).then((function(i){console.log("preference read ("+t+")!",i),i&&i.value&&(1===i.value||"1"==i.value)&&(console.log("got preference Tutorial SEEN for",t,i.value),e.tutorialShownHard=!0)}))}))},setPreferenceTutorial:function(){if(this.$capacitor&&this.$capacitor.isNativePlatform()){var e="tutorial_"+this.name;this.$airlyn.preferenceSet({key:e,value:"1"}).finally((function(){console.log("preference stored for!",e)}))}this.setTutorialRun({page:this.name,index:this.currentTutorial.index}),this.tutorialShownHard=!0}}),beforeMount:function(){console.log("PRE loaded base Page"),this.setCurrentPage(this)},beforeDestroy:function(){this.detachSwipeListeners()},mounted:function(){var e=this;console.log("loaded base Page"),this.tutorialShownHard=!1,this.retrievePreferenceTutorial(),console.log("try Load index",this.name,this.dynamicTexts),this.dynamicTexts&&Object.keys(this.dynamicTexts).length>0&&Object.keys(this.dynamicTexts).map((function(t){e.$appConfiguration.getText(t).then((function(i){e.dynamicTexts[t]=i})).catch((function(i){e.dynamicTexts[t]=e.$t(e.name+"."+t)}))})),null!==this.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager")&&(document.querySelector(".v-main__wrap > div.pager").style.height=this.getCurrentPagerHeight+"px"),this.$nextTick((function(){if(e.$capacitor&&e.$capacitor.isNativePlatform())console.log("Richiesto al passaggio precedente");else{var t=e.getLocalTutorialShown;t&&void 0!==t[e.name]?e.tutorialShownHard=!0:e.tutorialShownHard=!1}e.attachSwipeListener(),null===e.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager")&&e.setCurrentPagerHeight(Math.max(document.querySelector(".v-main__wrap > div.pager").clientHeight,document.querySelector(".v-main__wrap > div.pager").offsetHeight))}))}}},924:function(e,t,i){"use strict";i.r(t);i(5),i(50);var r={props:{title:{type:String,default:"Info"},transition:{type:String,default:"dialog-bottom-transition"},contentclasses:{type:String,default:""},description:{type:String,default:"Info text"},infoImage:{type:String,default:null},showSuperTitle:{type:Boolean,default:!0},thumbInTitle:{type:Boolean,default:!0},show:{type:Boolean,default:!1}},data:function(){return{}},computed:{showDialog:function(){return this.show}},methods:{closeClick:function(e){this.$emit("close",e)}},mounted:function(){}},n=i(42),o=Object(n.a)(r,(function(){var e=this,t=e._self._c;return t("v-dialog",{attrs:{fullscreen:"","hide-overlay":"",transition:e.transition,scrollable:"","content-class":"infoDialog "+e.contentclasses},model:{value:e.showDialog,callback:function(t){e.showDialog=t},expression:"showDialog"}},[t("fullpage-card",{scopedSlots:e._u([{key:"header",fn:function(){return[t("div",{class:[(e.showSuperTitle?"with":"without")+"__supertitle",(e.thumbInTitle?"with":"without")+"__thumbInTitle"]},[e.showSuperTitle?t("div",{staticClass:"text-center supertitle"},[e._v("About")]):e._e(),e._v(" "),e.infoImage&&!0===e.thumbInTitle?t("img",{staticClass:"titleImage",attrs:{src:e.infoImage}}):e._e(),e._v(" "),t("div",{staticClass:"text-center infodialog__title",domProps:{innerHTML:e._s(e.title)}})])]},proxy:!0},{key:"body",fn:function(){return[t("div",{staticClass:"text-center content"},[e.infoImage&&!1===e.thumbInTitle?t("img",{staticClass:"errorimage",attrs:{src:e.infoImage}}):e._e(),e._v(" "),t("span",{class:[e.contentclasses,"withdynamicTexts"],domProps:{innerHTML:e._s(e.description)}})])]},proxy:!0},{key:"footer",fn:function(){return[t("div",{class:["pager"]},[t("v-btn",{attrs:{color:"nextvm",nuxt:""},on:{click:e.closeClick}},[e._t("closebtn",(function(){return[t("v-icon",[e._v("mdi-reload")]),e._v(" "),t("span",{domProps:{innerHTML:e._s(e.$t("generic.done"))}})]}))],2)],1)]},proxy:!0}],null,!0)})],1)}),[],!1,null,null,null);t.default=o.exports;installComponents(o,{FullpageCard:i(219).default})},925:function(e,t,i){"use strict";i(3),i(5),i(7),i(0),i(8),i(6),i(9);var r=i(26),n=i(923),o=i(46);function s(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,r)}return i}function a(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?s(Object(i),!0).forEach((function(t){Object(r.a)(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):s(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}t.a={name:"expage",mixins:[n.a],computed:a(a({},Object(o.d)({getExercises:"getExercises",getCurrentExercise:"getCurrentExercise"})),{},{exercise:function(){return this.getCurrentExercise}}),mounted:function(){console.log("monti pagina interna ex",this.getExercises,this.getCurrentExercise),this.getExercises||console.warn("Cannot retrieve exercise list in page"),0===this.getExercises.length&&console.error("Cannot retrieve exercise list in page")}}},970:function(e,t,i){"use strict";i.r(t);i(3),i(5),i(8),i(6),i(9);var r=i(26),n=(i(28),i(62),i(0),i(40),i(7),i(27),i(925)),o=i(46);function s(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,r)}return i}function a(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?s(Object(i),!0).forEach((function(t){Object(r.a)(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):s(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var c={name:"videoPlayer",mixins:[n.a],data:function(){return{step:0,exid:this.$route.params.id,programid:this.$route.params.fromprogram||!1,withindex:this.$route.params.withindex||-1,backto:this.$route.params.backto||!1,name:"videoPlayer",play:!1,videofile:null,loaded:!1,ended:!1,currentTime:"00:00",currentTimeS:0,uuid:"0",video:void 0,totalDuration:0,about:{show:!1}}},transition:{name:"fade",mode:"out-in",css:!1,beforeEnter:function(e){this.$anime.set(e,{scale:1,opacity:0})},enter:function(e,t){this.$anime({targets:e,opacity:[0,1],duration:500,easing:"easeInOutSine",complete:t})},leave:function(e,t){this.$anime({targets:e,opacity:[1,0],duration:500,easing:"easeInOutSine",complete:t}),document.body.classList.remove("bodyblock")}},computed:a(a({},Object(o.d)({getExercises:"getExercises",getCurrentExercise:"getCurrentExercise",skipTutorial:"skipTutorial",isCurrentUserGuest:"isCurrentUserGuest"})),{},{exercise:function(){return this.getCurrentExercise},duration:function(){return this.video?this.convertTimeHHMMSS(this.totalDuration):""},playerId:function(){return"player-"+this.uuid},currentPercent:function(){if(this.totalDuration<=0)return 0;if(0===this.currentTimeS)return 0;if(this.video){var e=this.currentTimeS/this.totalDuration*100;return e>100?100:e}return 0}}),methods:a(a({},Object(o.c)({setCurrentExerciseIndex:"setCurrentExerciseIndex",setCurrentExerciseById:"setCurrentExerciseById",setCurrentUser:"setCurrentUser",setIsGuest:"setIsGuest",addDoneExercise:"addDoneExercise",setCurrentExerciseByData:"setCurrentExerciseByData"})),{},{nextStep:function(){var e=this;this.step<1&&(this.step+=1,this.$nextTick((function(){e.startMediaExcerise()})))},backStep:function(){0!==this.step?this.step=0:this.exitClick()},closeInfo:function(){this.about.show=!1},infoStep:function(){this.play&&this.playClick(),this.about.show=!0},prevStep:function(){!0!==this.about.show?this.exitClick():this.closeInfo()},requestFullScreen:function(){var e=document.getElementById(this.playerId);e.requestFullscreen?e.requestFullscreen():e.msRequestFullscreen?e.msRequestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen?e.webkitRequestFullscreen():e.webkitEnterFullScreen&&e.webkitEnterFullScreen()},generateUUID:function(){return"xxxxxxxx-xxxx-4xxx".replace(/[xy]/g,(function(e){var t;return t=16*Math.random()|0,("x"===e?t:3&t|8).toString(16)}))},convertTimeHHMMSS:function(e){var t=new Date(1e3*e).toISOString().substr(11,8);return 0===t.indexOf("00:")?t.substr(3):t},playClick:function(){this.play=!this.play,this.play?this.video.play():this.video.pause()},forwardClick:function(){this.video.currentTime=this.video.currentTime+10,this.currentTimeS=this.video.currentTime},rewindClick:function(){this.video.currentTime=this.video.currentTime-10,this.currentTimeS=this.video.currentTime},exitClick:function(){this.$analytics.logEvent("exercise_quit",{id:this.getCurrentExercise.id,name:this.getCurrentExercise.title,program_id:this.getCurrentExercise.program_id||null,type:this.getCurrentExercise.type}),document.querySelector("#__nuxt")&&document.querySelector("#__nuxt").classList.add("quit"),this.exerciseStepBack()},_handleLoaded:function(){this.video.readyState>=2?(this.fixVideoHeight(this.video.videoWidth,this.video.videoHeight),this.loaded=!0,this.video.classList.remove("hide"),this.totalDuration=parseInt(this.video.duration),this.step>0&&this.playClick()):this.$root.$emit("showError",{hasretry:!0,title:$nuxt.$t("errors.global.title"),error:$nuxt.$t("errors.global.msg_loadvideotrack"),click:null,resetEvent:function(){return $nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl)),$nuxt.$airlyn.finishExercise({reason:"exercise-eo-fail",result:{}}).finally((function(){console.log("exercise video cannot be loaded, error")})),!0}})},_handlePlayingUI:function(e){var t=parseInt(this.video.currentTime);this.currentTimeS=parseInt(this.video.currentTime),this.currentTime=this.convertTimeHHMMSS(this.totalDuration-t)},_handlePlayPause:function(e){"pause"===e.type&&!1===this.play&&(this.currentTime="00:00",this.play=!1,console.log("finish?"))},_handleFullScreenMode:function(e){var t=document.getElementById(this.playerId);t.currentTime>0&&!t.paused&&!t.ended&&t.readyState>2?this.play=!0:this.play=!1},_handleEnd:function(e){var t=this;if(console.log("video finito",e),this.play=!1,this.ended=!0,this.isCurrentUserGuest)return this.getCurrentExercise.completed=!0,this.$root.$emit("completedExercise",this.getCurrentExercise),void this.$nextTick((function(){t.$root.$emit("showPager",{show:!1});var e=t.buildSuffix();e.length>0&&(e="/"+e),t.$router.push($nuxt.localePath("/ml/greetings/"+t.exid+e))}));var i=!1;this.$exerciseManager.completeExercise(this.getCurrentExercise,null,null).then((function(e){console.log("got record result",e),e.exercise&&e.response&&e.exercise.completed?(i=!0,t.getCurrentExercise.completed=e.exercise.completed):i=$nuxt.$t("errors.global.msg_restapi")})).catch((function(e){console.error("Errore invio api [breathing_exercises_video]:",e),t.$captureException(e),i=$nuxt.$t("errors.global.title"),t.$analytics.logEvent("error",{title:"cannot send exercise video"})})).finally((function(){!0===i?(t.addDoneExercise(1),t.$nextTick((function(){t.$root.$emit("showPager",{show:!1});var e=t.buildSuffix();e.length>0&&(e="/"+e),t.$router.push($nuxt.localePath("/ml/greetings/"+t.exid+e))}))):t.$root.$emit("showError",{hasretry:!0,title:$nuxt.$t("errors.global.uhoh"),error:i,leaveBtn:t.$t("generic.startanyway"),click:function(){return t.startAgain(),!0},resetEvent:function(){return $nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl)),$nuxt.$airlyn.finishExercise({reason:"exercise-finish-fail",result:{finish:!0}}).finally((function(){console.log("exercise cannot store exercise result, error")})),!0}})}))},startAgain:function(){this.ended=!1,this.video&&(this.video.currentTime=0),this.currentTimeS=0,this.play=!1},init:function(){this.ended=!1,this.video.addEventListener("timeupdate",this._handlePlayingUI),this.video.addEventListener("loadeddata",this._handleLoaded),this.video.addEventListener("pause",this._handlePlayPause),this.video.addEventListener("play",this._handlePlayPause),this.video.addEventListener("ended",this._handleEnd),this.video.addEventListener("fullscreenchange",this._handleFullScreenMode)},getVideo:function(){return this.$el.querySelectorAll("video")[0]},handleBack:function(){this.prevStep()},retrieveCurrentExerciseAndSet:function(){var e=this;if(this.hasJoinedProgramById(this.programid)){var t=this.getProgramById(this.programid);if(this.withindex>-1){var i=t.exercises.filter((function(t){return t.id===e.exid&&t.program_index==e.withindex}));i.length>0&&this.setCurrentExerciseByData(i[0])}else this.setCurrentExerciseByData(null)}else this.setCurrentExerciseById(this.exid)},fixVideoHeight:function(e,t){var i=e/t,r=document.getElementById("playerAreaContainer");if(r){var n=document.body.clientHeight,o=document.body.clientWidth,s=r.closest(".fullPageCard"),a=s.querySelector("div.header"),c=s.querySelector("div.footer"),l=s.querySelector("div.runningTime");a&&(n-=a.scrollHeight),c&&(n-=c.scrollHeight),n-=l?l.scrollHeight:36;var u=Math.min(n,s.scrollHeight-((a?a.scrollHeight:0)+(c?c.scrollHeight:0)))-(l?l.scrollHeight:36);console.log("computed h",u,n,s.scrollHeight-((a?a.scrollHeight:0)+(c?c.scrollHeight:0))),s.querySelector("div.body").style.height=u-4+"px",s.querySelector("div.body").style.overflow="hidden",r.style.height=u+"px",r.style.width=u*i+"px",s.querySelector("div.body").classList.remove("horizontal"),u*i>o&&(s.querySelector("div.body").classList.add("horizontal"),r.style.width=o+"px",r.style.height=o/i+"px")}},startMediaExcerise:function(){this.video=this.getVideo(),this.init(),this.video.load()}}),mounted:function(){var e=this;this.$capacitor&&this.$capacitor.isNativePlatform()&&(this.$backEmitter.callback=this.handleBack),this.uuid=this.generateUUID(),this.exid?(this.retrieveCurrentExerciseAndSet(),this.getCurrentExercise?this.videofile=this.getCurrentExercise.video:(console.error("cannot find exercise ",this.exid),$nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl)),$nuxt.$airlyn.finishExercise({reason:"exercise-load-fail",result:{}}).finally((function(){console.log("exercise cannot be loaded, error")}))),this.$nextTick((function(){e.name="videoPlayer",e.$root.$emit("showNext",!1),e.$root.$emit("showPager",{show:!1}),e.$root.$emit("showOverlay",{show:!1}),e.video&&(e.$analytics.logEvent("exercise_seeing",{id:e.getCurrentExercise.id,name:e.getCurrentExercise.title,program_id:e.getCurrentExercise.program_id||null,program_name:e.hasJoinedProgramById(e.getCurrentExercise.program_id)?e.getProgramById(e.getCurrentExercise.program_id).name:null,type:e.getCurrentExercise.type}),e.$exerciseManager.startExercise(e.getCurrentExercise),e.$analytics.setScreenName(e.getCurrentExercise.title+" seeing page"))}))):(console.error("cannot find exercise[2] ",this.exid),$nuxt.$router.replace($nuxt.localePath(this.defaultHomeUrl)),$nuxt.$airlyn.finishExercise({reason:"exercise-load-fail",result:{}}).finally((function(){console.log("exercise cannot be loaded, error")})))},beforeDestroy:function(){this.$capacitor&&this.$capacitor.isNativePlatform()&&(this.$backEmitter.callback=null),this.video&&(this.video.removeEventListener("timeupdate",this._handlePlayingUI),this.video.removeEventListener("loadeddata",this._handleLoaded),this.video.removeEventListener("pause",this._handlePlayPause),this.video.removeEventListener("play",this._handlePlayPause),this.video.removeEventListener("ended",this._handleEnd),this.video.removeEventListener("fullscreenchange",this._handleFullScreenMode))}},l=i(42),u=Object(l.a)(c,(function(){var e=this,t=e._self._c;return t("fullpage-card",{class:["videoExercise withpage","mediaexercise_step_"+e.step],attrs:{hidefooter:!1},scopedSlots:e._u([{key:"header",fn:function(){return[e.step>0?t("v-row",{staticClass:"navigation",attrs:{"align-content":"center",justify:"space-between"}},[t("v-btn",{attrs:{icon:""},on:{click:e.exitClick}},[t("v-icon",[e._v("mdi-close-circle-outline")])],1),e._v(" "),e.getCurrentExercise?t("div",{staticClass:"exercise__title"},[t("span",{domProps:{innerHTML:e._s(e.getCurrentExercise.title)}})]):e._e(),e._v(" "),t("v-btn",{attrs:{icon:""},on:{click:e.infoStep}},[t("v-icon",[e._v("mdi-information-outline")])],1)],1):e._e()]},proxy:!0},{key:"body",fn:function(){return[t("transition",{attrs:{appear:"",name:"fade"}},[0==e.step?t("div",{staticClass:"tutorial_info"},[t("div",{staticClass:"tutorial__header header"},[t("div",{class:["exercise_type icon_holder",e.getCurrentExercise.type]},[e._v(" ")])]),e._v(" "),t("div",{staticClass:"tutorial__body body"},[t("div",{staticClass:"tutorial__title"},[e._v(e._s(e.getCurrentExercise.title))]),e._v(" "),t("div",{staticClass:"tutorial_exinfo"},[t("v-icon",[e._v("mdi-clock-time-four-outline")]),e._v(" \n            "+e._s(e.$humanizeTime(e.getCurrentExercise.duration))+"\n          ")],1),e._v(" "),t("div",{staticClass:"tutorial__content",domProps:{innerHTML:e._s(e.getCurrentExercise.about||"")}})])]):t("div",[t("div",{staticClass:"playerArea video",attrs:{id:"playerAreaContainer"}},[t("video",{ref:"videofile",staticClass:"hide",attrs:{id:e.playerId,loop:!1,src:e.videofile,playsinline:"",poster:e.getCurrentExercise.videoThumbnail?e.getCurrentExercise.videoThumbnail:"",preload:"auto"}}),e._v(" "),!1===e.loaded?t("div",{staticClass:"videoOverlayWaiting"},[t("v-progress-circular",{attrs:{indeterminate:!0,color:"primary"}})],1):e._e()]),e._v(" "),t("div",{staticClass:"runningTime"},[e.play?t("span",[e._v("-"+e._s(e.currentTime))]):e._e(),e._v(" "),e.play?e._e():t("span",[e._v(e._s(e.duration))]),e._v(" "),t("v-btn",{attrs:{icon:""},on:{click:e.requestFullScreen}},[t("v-icon",[e._v("mdi-fullscreen")])],1)],1)])])]},proxy:!0},{key:"footer",fn:function(){return[0===e.step?t("div",{staticClass:"steps"},[t("v-btn",{attrs:{color:"backvm",text:"",nuxt:""},on:{click:e.backStep}},[e._v("\n        "+e._s(e.$t("generic.back"))+"\n      ")]),e._v(" "),t("v-spacer",{staticClass:"spacer"}),e._v(" "),t("v-btn",{staticClass:"nextController",attrs:{color:"nextvm"},on:{click:e.nextStep}},[e._v("\n        "+e._s(e.$t("generic.start_arrow"))+" \n      ")])],1):e._e(),e._v(" "),e.loaded&&e.step>0?t("v-row",{staticClass:"player",attrs:{"align-content":"center",justify:"space-between"}},[t("v-btn",{attrs:{icon:"",disabled:e.video.currentTime<10},on:{click:e.rewindClick}},[t("v-icon",[e._v("mdi-rewind-10")])],1),e._v(" "),t("v-btn",{class:["btn_play",e.play?"playing":""],attrs:{disabled:!e.loaded},on:{click:e.playClick}},[e.play?e._e():t("v-icon",[e._v("mdi-play")]),e._v(" "),e.play?t("v-icon",[e._v("mdi-pause")]):e._e()],1),e._v(" "),t("v-btn",{attrs:{icon:"",disabled:e.video.currentTime>e.totalDuration-10},on:{click:e.forwardClick}},[t("v-icon",[e._v("mdi-fast-forward-10")])],1)],1):e._e(),e._v(" "),e.getCurrentExercise?t("infodialog",{attrs:{show:e.about.show,contentclasses:"infoContent",title:e.getCurrentExercise.title,description:e.getCurrentExercise.about||"",infoImage:e.getCurrentExercise.aboutImage||e.getCurrentExercise.thumbnail},on:{close:e.closeInfo},scopedSlots:e._u([{key:"closebtn",fn:function(){return[e._v("Alright")]},proxy:!0}],null,!1,2600066686)}):e._e()]},proxy:!0}])})}),[],!1,null,null,null);t.default=u.exports;installComponents(u,{Infodialog:i(924).default,FullpageCard:i(219).default})}}]);
//# sourceMappingURL=1419191.js.map