(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{923:function(e,t,r){"use strict";r(5),r(7),r(8),r(6),r(9);var n=r(26),o=(r(0),r(28),r(61),r(62),r(27),r(3),r(37),r(46));function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){Object(n.a)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}t.a={name:"basePage",transition:{name:"slide",mode:"out-in",css:!1,beforeEnter:function(e){if(!document.querySelector("#__nuxt").classList.contains("quit")){var t=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime.set(e,{scale:1,opacity:0,translateX:t})}},enter:function(e,t){var r=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime({targets:e,opacity:[0,1],translateX:[r,"0"],duration:500,easing:"easeInOutSine",complete:t})},leave:function(e,t){if(document.querySelector("#__nuxt").classList.contains("quit"))this.$anime({targets:e,translateY:[0,"100%"],duration:500,easing:"easeInOutSine",complete:t});else{var r=document.querySelector("#__nuxt").classList.contains("back")?"100%":"-100%";this.$anime({targets:e,opacity:[1,0],translateX:["0",r],duration:500,easing:"easeInOutSine",complete:t})}},afterLeave:function(e){document.querySelector("#__nuxt").classList.remove("quit"),document.querySelector("#__nuxt").classList.remove("back")}},data:function(){return{name:"basePage",exid:this.$route.params.id,programid:this.$route.params.fromprogram||!1,withindex:this.$route.params.withindex||-1,backto:this.$route.params.backto||!1,hasBack:!1,hasNext:!1,hasInfo:!1}},computed:s(s({},Object(o.d)({getCurrentPagerHeight:"getCurrentPagerHeight"})),{},{isVoicemed:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")>-1},isAirlyn:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")<0},nuxtloading:function(){return $nuxt.$loading.loading},defaultHomeUrl:function(){return"/"}}),methods:s(s({},Object(o.c)({setCurrentPage:"setCurrentPage",setCurrentPagerHeight:"setCurrentPagerHeight"})),{},{exerciseStepBack:function(){if(console.log("exit test",this.backto,this.programid),"standalone"==this.backto)return $nuxt.$airlyn.finishExercise({reason:"user-cancelled",result:{}}).finally((function(){console.log("exercise finished by user")})),void $nuxt.$airlyn.closeExercise().finally((function(){console.log("exercise closed, success")}));"today"!=this.backto?"discovery"!=this.backto?this.programid?"-1"==this.programid||-1==this.programid||"false"==this.programid||0==this.programid?$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/ml/programs/"+this.programid)):$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/home")):$nuxt.$router.replace($nuxt.localePath("/user/today"))},buildSuffix:function(){var e=[],t=!!this.programid&&this.programid;return e.push("-1"!==t&&t),e.push(this.withindex?this.withindex:"-1"),e.push(!!this.backto&&this.backto),e.join("/")},hasJoinedProgramById:function(e){return this.$nuxt.$store.getters.hasJoinedProgramById(e)},getProgramJoinedAtById:function(e){return this.$nuxt.$store.getters.getProgramJoinedAtById(e)},getProgramById:function(e){return this.$nuxt.$store.getters.getProgramById(e)},getOverallProgressProgramById:function(e){return this.$nuxt.$store.getters.getOverallProgressProgramById(e)},getDoneCountByProgramId:function(e){return this.$nuxt.$store.getters.getDoneCountByProgramId(e)},getNextExerciseByProgramId:function(e){return this.$nuxt.$store.getters.getNextExerciseByProgramId(e)},getExercisetocompleteCountProgramById:function(e){return this.$nuxt.$store.getters.getExercisetocompleteCountProgramById(e)},getExercisecompletedCountProgramById:function(e){return this.$nuxt.$store.getters.getExercisecompletedCountProgramById(e)},printDeviceError:function(e,t,r,n){this.$analytics.logEvent("permission_error",{title:"errors."+e+"."+t.name.toLowerCase()+".title",kind:e}),console.error("Got device error",t),!t||"NotAllowedError"!==t.name&&"NotFoundError"!==t.name&&"denied"!=t.exception.state&&"DENIED"!=t.exception.state?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),r,n):this.$root.$emit("showPermssionError",!0)},printDeviceErrorOLD:function(e,t,r,n){if(this.$analytics.logEvent("permission_error",{title:"errors."+e+"."+t.name.toLowerCase()+".title",kind:e}),console.error("Got device error",t),t.exception&&"mic"==e&&("denied"==t.exception.state||"DENIED"==t.exception.state))return t.name="DeniedError",void this.$root.$emit("showError",{title:this.$t("errors."+e+"."+t.name.toLowerCase()+".title"),error:this.$t("errors."+e+"."+t.name.toLowerCase()+".description"),hasretry:!0,click:function(){return $nuxt.$airlyn.openPermissionPanel().then((function(e){console.log("got openPermission Panel then",e,JSON.stringify(e))})).catch((function(e){console.log("got openPermission Panel catch",e,JSON.stringify(e))})).finally((function(){"function"==typeof n&&(console.log("dopo il setting riport cmq a inizio"),n())})),!0},resetEvent:n||function(){},retryBtn:"Settings"});!t||"NotAllowedError"!==t.name&&"NotFoundError"!==t.name?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),r,n):this.showError(this.$t("errors."+e+"."+t.name.toLowerCase()+".title"),this.$t("errors."+e+"."+t.name.toLowerCase()+".description"),r,n)},manageMicError:function(e,t,r){this.printDeviceError("mic",e,t,r)},manageCamError:function(e,t,r){this.printDeviceError("cam",e,t,r)},manageMicCamError:function(e,t,r){this.printDeviceError("miccam",e,t,r)},showError:function(e,t,r,n){this.$root.$emit("showError",{title:e,error:t,hasretry:null!==r,click:r||function(){},resetEvent:n||function(){}})},swipeEvent:function(e){this.$root.$emit("swipe",e)},attachSwipeListener:function(){document.addEventListener("swiped-left",this.swipeEvent),document.addEventListener("swiped-right",this.swipeEvent)},detachSwipeListeners:function(){document.removeEventListener("swiped-left",this.swipeEvent),document.removeEventListener("swiped-right",this.swipeEvent)},fixWindowVariables:function(e){void 0===window[e]&&"undefined"!==window.top[e]&&(window[e]=window.top[e])}}),beforeMount:function(){var e=this;console.log("PRE loaded base Page"),console.log("fix loading variables"),["currentExercise","currentVMToken","currentVMKey","currentVMUrl"].forEach((function(t){e.fixWindowVariables(t)})),this.setCurrentPage(this)},beforeDestroy:function(){this.detachSwipeListeners()},mounted:function(){var e=this;console.log("loaded base Page"),console.log("try Load index",this.name,this.dynamicTexts),this.dynamicTexts&&Object.keys(this.dynamicTexts).length>0&&Object.keys(this.dynamicTexts).map((function(t){e.$appConfiguration.getText(t).then((function(r){e.dynamicTexts[t]=r})).catch((function(r){e.dynamicTexts[t]=e.$t(e.name+"."+t)}))})),null!==this.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager")&&(document.querySelector(".v-main__wrap > div.pager").style.height=this.getCurrentPagerHeight+"px"),this.$nextTick((function(){e.attachSwipeListener(),null===e.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager")&&e.setCurrentPagerHeight(Math.max(document.querySelector(".v-main__wrap > div.pager").clientHeight,document.querySelector(".v-main__wrap > div.pager").offsetHeight))}))}}},959:function(e,t,r){"use strict";r.r(t);var n={name:"welcome",mixins:[r(923).a],transition:{name:"fade"},beforeMount:function(){console.log("sono la index opening"),this.$analytics.setScreenName("WelcomeSDKPage")},mounted:function(){var e=this;console.log("ready to load airlyn features"),window.currentVMToken&&console.log("Current VM Token",window.currentVMToken),console.log("Check environment ready:",window.currentExercise,window.currentVMToken),this.$deviceInfo.getInfo().then((function(t){e.deviceInfo=t,e.$exerciseManager.setDeviceCode(t)}))}},o=r(42),i=Object(o.a)(n,(function(){return(0,this._self._c)("div",{staticClass:"opening"},[this._v("\n  Exercise\n")])}),[],!1,null,null,null);t.default=i.exports}}]);
//# sourceMappingURL=186d6ef.js.map