(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{923:function(t,e,i){"use strict";i(5),i(7),i(8),i(9);var r=i(179),o=i(24),n=i(26),a=(i(98),i(0),i(28),i(62),i(63),i(27),i(37),i(221),i(10),i(6),i(220),i(112),i(3),i(46));function s(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,r)}return i}function c(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?s(Object(i),!0).forEach((function(e){Object(n.a)(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):s(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}e.a={name:"basePage",transition:{name:"slide",mode:"out-in",css:!1,beforeEnter:function(t){if(!document.querySelector("#__nuxt").classList.contains("quit")){var e=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime.set(t,{scale:1,opacity:0,translateX:e})}},enter:function(t,e){var i=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime({targets:t,opacity:[0,1],translateX:[i,"0"],duration:500,easing:"easeInOutSine",complete:e})},leave:function(t,e){if(document.querySelector("#__nuxt").classList.contains("quit"))this.$anime({targets:t,translateY:[0,"100%"],duration:500,easing:"easeInOutSine",complete:e});else{var i=document.querySelector("#__nuxt").classList.contains("back")?"100%":"-100%";this.$anime({targets:t,opacity:[1,0],translateX:["0",i],duration:500,easing:"easeInOutSine",complete:e})}},afterLeave:function(t){document.querySelector("#__nuxt").classList.remove("quit"),document.querySelector("#__nuxt").classList.remove("back")}},data:function(){return{name:"basePage",exid:this.$route.params.id,programid:this.$route.params.fromprogram||!1,withindex:this.$route.params.withindex||-1,backto:this.$route.params.backto||!1,hasBack:!1,hasNext:!1,hasInfo:!1,currentTutorial:!1,tutorialList:[],tutorialShownHard:!1}},computed:c(c({},Object(a.d)({getCurrentPagerHeight:"getCurrentPagerHeight",getTutorialShown:"getTutorialShown",getLocalTutorialShown:"getLocalTutorialShown"})),{},{isVoicemed:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")>-1},isAirlyn:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")<0},nuxtloading:function(){return $nuxt.$loading.loading},defaultHomeUrl:function(){return"/user/today"}}),methods:c(c({},Object(a.c)({setCurrentPage:"setCurrentPage",setCurrentPagerHeight:"setCurrentPagerHeight",setTutorialRunPerPage:"setTutorialRunPerPage",setTutorialRun:"setTutorialRun"})),{},{setTutorialRunLocal:function(){this.setPreferenceTutorial()},tutorialClose:function(){this.$set(this,"tutorialList",[]),this.setTutorialRunLocal(),this.currentTutorial=null},tutorialHasNext:function(){var t=this.currentTutorial.index;return!!this.tutorialList.find((function(e){return e.index===t+1}))},exerciseStepBack:function(){console.log("exit test",this.backto,this.programid),"standalone"!=this.backto?"today"!=this.backto?"discovery"!=this.backto?this.programid?"-1"==this.programid||-1==this.programid||"false"==this.programid||0==this.programid?$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/ml/programs/"+this.programid)):$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/home")):$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$airlyn.finishExercise({reason:"user-cancelled",result:{}}).finally((function(){console.log("exercise finished by user")}))},buildSuffix:function(){var t=[],e=!!this.programid&&this.programid;return t.push("-1"!==e&&e),t.push(this.withindex?this.withindex:"-1"),t.push(!!this.backto&&this.backto),t.join("/")},tutorialNext:function(){var t=this.currentTutorial?this.currentTutorial.index:0;this.currentTutorial?(this.currentTutorial.visible=!1,this.setTutorialRunLocal()):t=this.tutorialList[0].index-1;var e=this.tutorialList.find((function(e){return e.index===t+1}));if(e){this.currentTutorial=e;e.position.height;var i=e.position.top>this.appHeight/2?e.position.top-210:e.position.top-10;e.arrowTop&&(i=e.position.top-(e.position.height+10)),i=Math.max(0,i),console.warn("Nuovo scroll Top:",i,this.appHeight,this.footerHeight,e.position.height),this.$nextTick((function(){document.querySelector(".indexPage").scrollTo({top:i,left:0,behavior:"smooth"})})),e.visible=!0}else this.tutorialClose()},getTutorialIndex:function(){return this.currentTutorial?this.currentTutorial.index>this.tutorialList.length?this.tutorialList.length:this.currentTutorial.index:""},getTutorialText:function(t){return this.$t("tutorials."+this.name+".text_"+t.index,{title:t.title})},getTutorialDialogStyle:function(t){var e={},i=t.position,r=i.top;return this.$capacitor&&this.$capacitor.isNativePlatform()&&0==t.updated&&(r=i.top,t.updated=!0,console.warn("apply tutorial offset for mobile phones")),e.top=r>300?r-200+"px":r+i.height+10+"px",console.warn("DialogStyle for tutorial",t,e),"fill"!==t.width?e.left="calc("+i.left+"px - 75vw + "+i.width+"px )":(e.left="0px",e.right="0px"),Object.entries(e).map((function(t){var e=Object(o.a)(t,2),i=e[0],r=e[1];return"".concat(i,":").concat(r)})).join(";")},getTutorialStyle:function(t){var e={},i=t.position,r=i.top;return this.$capacitor&&this.$capacitor.isNativePlatform()&&0==t.updated&&(r=i.top,t.updated=!0),console.warn("Style for tutorial",t,r),"fill"===t.width?(e.top=r-4+"px",e.left="0px",e.right="0px",e.height=i.height+8+"px"):(e.top=r-4+"px",e.left=i.left-4+"px",e.right="0px",e.height=i.height+8+"px",e.width=i.width+8+"px"),Object.entries(e).map((function(t){var e=Object(o.a)(t,2),i=e[0],r=e[1];return"".concat(i,":").concat(r)})).join(";")},initTutorial:function(){var t=this,e=Object(r.a)(document.querySelectorAll(".hastutorial")),i=!1;if(this.$capacitor&&this.$capacitor.isNativePlatform()?i=this.tutorialShownHard:(this.tutorialShownHard=this.$nuxt.$store.getters.getTutorialRun(this.name),i=this.$nuxt.$store.getters.getTutorialRunPerPage(this.name)),void 0!==this.getTutorialShown[this.name]||i||this.tutorialShownHard)console.warn("hide tutorial, not needed at this round");else{if(this.$set(this,"tutorialList",[]),e.length>0){document.querySelector(".indexPage").scrollTo({top:0,left:0,behavior:"smooth"});var o=this.getLocalTutorialShown;console.warn("got local tutorials",o),e.forEach((function(e){var i=parseInt(e.dataset.tutorialindex);if(void 0===o[t.name+"_"+i]){var r=e.getBoundingClientRect();t.tutorialList.push({position:r,visible:!1,itemRef:e,updated:!1,arrowTop:"top"==e.dataset.tutorialarrow,title:e.dataset.tutorial,width:e.dataset.tutorialwidth,index:i})}})),window.tutorialList=this.tutorialList}this.tutorialList.length>0&&(this.tutorialList=this.tutorialList.sort((function(t,e){return t.index>e.index?1:e.index>t.index?-1:0}))),this.tutorialList.length>0&&(this.currentTutorial=0,this.$nextTick((function(){setTimeout((function(){t.tutorialList.forEach((function(t){t.position=t.itemRef.getBoundingClientRect()})),t.tutorialNext(),t.setTutorialRunPerPage(t.name)}),200)})))}},hasJoinedProgramById:function(t){return this.$nuxt.$store.getters.hasJoinedProgramById(t)},getProgramJoinedAtById:function(t){return this.$nuxt.$store.getters.getProgramJoinedAtById(t)},getProgramById:function(t){return this.$nuxt.$store.getters.getProgramById(t)},getOverallProgressProgramById:function(t){return this.$nuxt.$store.getters.getOverallProgressProgramById(t)},getDoneCountByProgramId:function(t){return this.$nuxt.$store.getters.getDoneCountByProgramId(t)},getNextExerciseByProgramId:function(t){return this.$nuxt.$store.getters.getNextExerciseByProgramId(t)},getExercisetocompleteCountProgramById:function(t){return this.$nuxt.$store.getters.getExercisetocompleteCountProgramById(t)},getExercisecompletedCountProgramById:function(t){return this.$nuxt.$store.getters.getExercisecompletedCountProgramById(t)},printDeviceError:function(t,e,i,r){this.$analytics.logEvent("permission_error",{title:"errors."+t+"."+e.name.toLowerCase()+".title",kind:t}),console.error("Got device error",e),!e||"NotAllowedError"!==e.name&&"NotFoundError"!==e.name&&"denied"!=e.exception.state&&"DENIED"!=e.exception.state?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),i,r):this.$root.$emit("showPermssionError",!0)},printDeviceErrorOLD:function(t,e,i,r){if(this.$analytics.logEvent("permission_error",{title:"errors."+t+"."+e.name.toLowerCase()+".title",kind:t}),console.error("Got device error",e),e.exception&&"mic"==t&&("denied"==e.exception.state||"DENIED"==e.exception.state))return e.name="DeniedError",void this.$root.$emit("showError",{title:this.$t("errors."+t+"."+e.name.toLowerCase()+".title"),error:this.$t("errors."+t+"."+e.name.toLowerCase()+".description"),hasretry:!0,click:function(){return $nuxt.$airlyn.openPermissionPanel().then((function(t){console.log("got openPermission Panel then",t,JSON.stringify(t))})).catch((function(t){console.log("got openPermission Panel catch",t,JSON.stringify(t))})).finally((function(){"function"==typeof r&&(console.log("dopo il setting riport cmq a inizio"),r())})),!0},resetEvent:r||function(){},retryBtn:"Settings"});!e||"NotAllowedError"!==e.name&&"NotFoundError"!==e.name?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),i,r):this.showError(this.$t("errors."+t+"."+e.name.toLowerCase()+".title"),this.$t("errors."+t+"."+e.name.toLowerCase()+".description"),i,r)},manageMicError:function(t,e,i){this.printDeviceError("mic",t,e,i)},manageCamError:function(t,e,i){this.printDeviceError("cam",t,e,i)},manageMicCamError:function(t,e,i){this.printDeviceError("miccam",t,e,i)},showError:function(t,e,i,r){this.$root.$emit("showError",{title:t,error:e,hasretry:null!==i,click:i||function(){},resetEvent:r||function(){}})},swipeEvent:function(t){this.$root.$emit("swipe",t)},attachSwipeListener:function(){document.addEventListener("swiped-left",this.swipeEvent),document.addEventListener("swiped-right",this.swipeEvent)},detachSwipeListeners:function(){document.removeEventListener("swiped-left",this.swipeEvent),document.removeEventListener("swiped-right",this.swipeEvent)},retrievePreferenceTutorial:function(){var t=this;this.$capacitor&&this.$capacitor.isNativePlatform()&&this.$airlyn.preferenceConfigure({group:"airlyn"}).finally((function(){console.log("preferences ready");var e="tutorial_"+t.name;t.$airlyn.preferenceGet({key:e}).then((function(i){console.log("preference read ("+e+")!",i),i&&i.value&&(1===i.value||"1"==i.value)&&(console.log("got preference Tutorial SEEN for",e,i.value),t.tutorialShownHard=!0)}))}))},setPreferenceTutorial:function(){if(this.$capacitor&&this.$capacitor.isNativePlatform()){var t="tutorial_"+this.name;this.$airlyn.preferenceSet({key:t,value:"1"}).finally((function(){console.log("preference stored for!",t)}))}this.setTutorialRun({page:this.name,index:this.currentTutorial.index}),this.tutorialShownHard=!0}}),beforeMount:function(){console.log("PRE loaded base Page"),this.setCurrentPage(this)},beforeDestroy:function(){this.detachSwipeListeners()},mounted:function(){var t=this;console.log("loaded base Page"),this.tutorialShownHard=!1,this.retrievePreferenceTutorial(),console.log("try Load index",this.name,this.dynamicTexts),this.dynamicTexts&&Object.keys(this.dynamicTexts).length>0&&Object.keys(this.dynamicTexts).map((function(e){t.$appConfiguration.getText(e).then((function(i){t.dynamicTexts[e]=i})).catch((function(i){t.dynamicTexts[e]=t.$t(t.name+"."+e)}))})),null!==this.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager")&&(document.querySelector(".v-main__wrap > div.pager").style.height=this.getCurrentPagerHeight+"px"),this.$nextTick((function(){if(t.$capacitor&&t.$capacitor.isNativePlatform())console.log("Richiesto al passaggio precedente");else{var e=t.getLocalTutorialShown;e&&void 0!==e[t.name]?t.tutorialShownHard=!0:t.tutorialShownHard=!1}t.attachSwipeListener(),null===t.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager")&&t.setCurrentPagerHeight(Math.max(document.querySelector(".v-main__wrap > div.pager").clientHeight,document.querySelector(".v-main__wrap > div.pager").offsetHeight))}))}}},959:function(t,e,i){"use strict";i.r(e);var r={name:"welcome",mixins:[i(923).a],transition:{name:"fade"},beforeMount:function(){console.log("sono la index opening"),this.$analytics.setScreenName("WelcomeSDKPage")},mounted:function(){var t=this;console.log("ready to get device info"),console.log("check echo"),this.$airlyn.echo({test:"ciao"}).then((function(t){console.log("echo test?",t)})).catch((function(t){console.error("e",t)})),this.$deviceInfo.getInfo().then((function(e){t.deviceInfo=e,t.$exerciseManager.setDeviceCode(e)}))}},o=i(42),n=Object(o.a)(r,(function(){return(0,this._self._c)("div",{staticClass:"opening"},[this._v("\n  Voicemed Proxy,\n  Identify user, provide auth token, redirect to exercise\n")])}),[],!1,null,null,null);e.default=n.exports}}]);
//# sourceMappingURL=43a8611.js.map