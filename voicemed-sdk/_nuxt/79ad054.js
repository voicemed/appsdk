(window.webpackJsonp=window.webpackJsonp||[]).push([[30,14],{1010:function(e,t,r){"use strict";r.r(t);r(322),r(4),r(7),r(8),r(9);var i=r(22),a=r(113),n=r(26),s=(r(0),r(5),r(963),r(36),r(40),r(3),r(223),r(10),r(37),r(28),r(62),r(63),r(99),r(47));function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,i)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){Object(n.a)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var l=r(965),d=r(966),u=r(967),h=r(968),g={targets:".fromAbove",translateY:["+10%","0%"],opacity:[0,1],easing:"easeInOutQuad",duration:500},m={targets:".screenAnimation",scaleY:["5px","5%"],scaleX:["5px","5%"],opacity:[0,1],easing:"easeInOutQuad",duration:500},v={targets:".screenAnimation",scaleY:["5px","5%"],scaleX:["5px","100%"],easing:"easeInOutQuad",duration:300},p={targets:".screenAnimation",scaleY:["5px","100%"],easing:"easeInOutQuad",duration:300},b={targets:".screenAnimation_inner",opacity:[0,1],easing:"easeInOutQuad",duration:300},f={targets:".coverImage",translateY:["0%","-100%"],easing:"easeInOutQuad",duration:1500},C={targets:".circle",opacity:[0,1],easing:"easeInOutQuad",duration:800,loop:!1},x={targets:".circle",opacity:[1,0],easing:"easeInOutQuad",duration:1200,loop:!1},y={beforeRouteLeave:function(e,t,r){r()},data:function(){return{showTrend:!1,exid:this.$route.params.fromexercise,programid:this.$route.params.fromprogram||!1,withindex:this.$route.params.withindex||!1,backto:this.$route.params.backto||!1,scoreDialog:{show:!1},dobDialog:{focus:null,show:!1,kind:"howimprove",currentSheet:"track",graphReady:!1,scores:{},lineChartData:{labels:[0,1,2,3,4,5,6],datasets:[{label:"",data:[]}]},barChartOptions:{plugins:{legend:{display:!1},tooltip:{enabled:!1}},layout:{padding:{right:10,top:20,left:0,bottom:0}},responsive:!0,maintainAspectRatio:!1,pointStyle:"circle",barThickness:3,hoverOffset:4,legend:{display:!1},subtitle:!1,tooltip:!1,scales:{x:{grid:{display:!1},ticks:{display:!0}},y:{min:0,max:100,offset:!0,grid:{borderColor:"rgba(81, 85, 112, 0.1)",borderWidth:0},ticks:{maxTicksLimit:3}}},elements:{line:{backgroundColor:"#848CE6",borderColor:"#848CE6",borderWidth:3},point:{radius:10,backgroundColor:"#515570",borderWidth:2,borderColor:"#FFFFFF"}}},since:"",sinceobj:null,currentCalendarView:null,events:[],currentDay:null,currentDayEvents:null,eventsCache:{}},breathscores:[{key:"flowScore",active:!0,img:d},{key:"timeScore",active:!1,img:l},{key:"cyclesScore",active:!1,img:u}],breathscoresVoices:[{key:"flowScore",active:!0,img:d},{key:"timeScore",active:!1,img:l},{key:"cyclesScore",active:!1,img:u}],currentProgram:null}},computed:c(c({},Object(s.d)({getExercises:"getExercises",getCurrentExercise:"getCurrentExercise",getCurrentUser:"getCurrentUser",isCurrentUserGuest:"isCurrentUserGuest",doneExercices:"doneExercices",getPrograms:"getPrograms"})),{},{relaxingFinish:function(){return h},breathingScore:function(){return this.getCurrentExercise?void 0===this.getCurrentExercise.breathingScore?0:parseInt(this.getCurrentExercise.breathingScore):0},getStaminaResult:function(){var e=this.getStaminaScore();if(e>0){var t=this.$t("dob.result_"+e);return t.length<1||t=="dob.result_"+e?this.$t("dob.result_generic"):t}return this.$t("dob.result_generic")},getStaminaTitle:function(){var e=this.getStaminaScore();if(e>0){var t=this.$t("dob.title_"+e);return t.length<1||t=="dob.title_"+e?this.$t("dob.title_10030"):t}return this.$t("dob.title_10030")},___staminaScore:function(){if(!this.getCurrentExercise)return 0;if(void 0===this.getCurrentExercise.breathingServiceSoundCode)return 0;var e=parseInt(this.getCurrentExercise.breathingServiceSoundCode);return e>=10030&&e<=10037?e:1},medalScore:function(){return this.getCurrentExercise?void 0===this.getCurrentExercise.medal?0:parseInt(this.getCurrentExercise.medal):0},breathingScoreShow:function(){return this.getCurrentExercise.type==this.$exerciseManager.kindRECORDING},breathingClass:function(){if(this.medalScore){if(5===this.medalScore)return"medal_gotzero";if(4===this.medalScore)return"medal_improve";if(3===this.medalScore)return"medal_bronze";if(2===this.medalScore)return"medal_silver";if(1===this.medalScore)return"medal_gold"}if(!this.breathingScoreShow)return"medal_gold";var e=this.breathingScore;return e>50?e>85?"medal_gold":e>70?"medal_silver":"medal_bronze":e>0?"medal_improve":"medal_gotzero"},minCalendar:function(){return this.dobDialog.sinceobj?this.$exerciseManager.formatDateYmd(this.dobDialog.sinceobj):null},maxCalendarObj:function(){return new Date},maxCalendar:function(){return this.$exerciseManager.formatDateYmd(this.maxCalendarObj)},isPrevDisabled:function(){return!!this.dobDialog.currentCalendarView&&(!!this.isCurrentUserGuest||!!this.dobDialog.currentCalendarView&&this.dobDialog.currentCalendarView.getFullYear()+"_"+this.dobDialog.currentCalendarView.getMonth()===this.dobDialog.sinceobj.getFullYear()+"_"+this.dobDialog.sinceobj.getMonth())},isNextDisabled:function(){return!!this.dobDialog.currentCalendarView&&(!!this.dobDialog.maxCalendarObj&&(!!this.isCurrentUserGuest||!!this.dobDialog.currentCalendarView&&this.currentCalendarView.getFullYear()+"_"+this.currentCalendarView.getMonth()===this.dobDialog.maxCalendarObj.getFullYear()+"_"+this.dobDialog.maxCalendarObj.getMonth()))}}),watch:{"scoreDialog.show":function(){var e=this;this.$nextTick((function(){e.updateExternalLink()}))},"dobDialog.show":function(){var e=this;this.$nextTick((function(){e.updateExternalLink()}))}},mounted:function(){var e=this;if(this.dobDialog.currentCalendarView=new Date,this.dobDialog.sinceobj=new Date((new Date).getFullYear(),0,1),this.dobDialog.since=this.$t("months.short-"+this.dobDialog.sinceobj.getMonth())+" "+this.dobDialog.sinceobj.getFullYear(),this.$capacitor&&this.$capacitor.isNativePlatform()&&(this.$backEmitter.callback=this.handleBack),null!==this.getCurrentPagerHeight&&document.querySelector("div.finishcard > div.footer")&&(document.querySelector("div.finishcard > div.footer").style.height=this.getCurrentPagerHeight+"px",document.querySelector("div.finishcard > div.footer").style.maxHeight=this.getCurrentPagerHeight+"px"),this.getCurrentUser&&this.getCurrentUser.createdAt)try{var t=new Date(this.getCurrentUser.createdAt);t.setHours(0,0,0,0),t&&(this.dobDialog.sinceobj=t,this.dobDialog.since=this.$t("months.short-"+t.getMonth())+" "+t.getFullYear())}catch(e){this.dobDialog.sinceobj=new Date((new Date).getFullYear(),0,1),this.dobDialog.since=this.$t("months.short-"+this.dobDialog.sinceobj.getMonth())+" "+this.dobDialog.sinceobj.getFullYear()}var r=-1;r=!1!==this.programid&&"false"!=this.programid&&"-1"!=this.programid&&-1!=this.programid?this.programid:this.getCurrentExercise.program_id,void 0===window.currentSession&&(window.currentSession={}),window.currentSession[this.getCurrentExercise.id+"_"+this.withindex]=!0;var i=this.getProgramJoinedAtById(r);i?(this.$root.$emit("showPager",{show:!1}),this.$nextTick((function(){e.$root.$emit("showPager",{show:!1})})),this.$exerciseManager.fillProgramById(r).then((function(t){t.id=r,t&&(t.joinedAt=i,e.hasJoinedProgramById(t.id)?e.setJoinedProgram({localprogram:t,remoteprogram:t}):e.addJoinedProgram({localprogram:t,remoteprogram:t}),e.currentProgram=t)})).finally((function(){e.$root.$emit("showPager",{show:!1}),e.$nextTick((function(){e.$root.$emit("showPager",{show:!1}),e.animeWorld()}))}))):!1!==r&&"false"!=r&&"-1"!=r&&-1!=r?this.$exerciseManager.fillProgramById(r).then((function(t){t.id=r,t&&(e.currentProgram=t)})).finally((function(){e.$root.$emit("showPager",{show:!1}),e.$nextTick((function(){e.$root.$emit("showPager",{show:!1}),e.animeWorld()}))})):(this.currentProgram=this.getProgramById(this.getCurrentExercise.program_id),null==this.currentProgram&&(this.currentProgram={_id:this.getCurrentExercise.program_id,id:this.getCurrentExercise.program_id,exercises:[]}),this.$root.$emit("showPager",{show:!1}),this.$nextTick((function(){e.$root.$emit("showPager",{show:!1}),e.animeWorld()}))),this.getCurrentExercise&&"dob"===this.getCurrentExercise.subtype&&(this.showTrend=!1,this.$nextTick((function(){e.fillScoreList().then((function(e){}))}))),this.$nextTick((function(){e.updateExternalLink()}))},methods:c(c({},Object(s.c)({addDoneExercise:"addDoneExercise",addJoinedProgram:"addJoinedProgram",setJoinedProgram:"setJoinedProgram"})),{},{updateExternalLink:function(){var e=this;Object(a.a)(document.querySelectorAll("a:not(.vm_managed)")).forEach((function(t){if("undefined"!==t.getAttribute("href")){var r=t.getAttribute("href");if(r.length>=1&&"/"===r.substr(0,1))return;if(r.length>=1&&"#"===r.substr(0,1))return;if(r.length>=8&&"https://"===r.substr(0,8)||r.length>=7&&"http://"===r.substr(0,8))return t.classList.add("vm_managed"),t.removeEventListener("click",e.consumeExternalLink),void t.addEventListener("click",e.consumeExternalLink)}}))},consumeExternalLink:function(e){e.stopPropagation(),e.preventDefault();var t=e.target.getAttribute("href");e.target.getAttribute("title")||e.target.innerText;return this.$browser.open({url:t}),!1},getStaminaScore:function(){if(!this.getCurrentExercise)return 0;if(void 0===this.getCurrentExercise.breathingServiceSoundCode)return 0;var e=parseInt(this.getCurrentExercise.breathingServiceSoundCode);return e>=10030&&e<=10037?e:1},updateActiveItem:function(e){this.breathscores.forEach((function(t){t.key!==e?t.active=!1:t.active=!0}))},animateCircle:function(){var e=C,t=x;t.delay=800,t.loop=!1,t.complete=function(e){i.restart()};var r=this.$anime(t);e.targets=".circle",e.delay=this.$anime.stagger(1500,{direction:"reverse"}),e.loop=!1,e.complete=function(e){r.play()};var i=this.$anime(e);i.play()},getProgramJoinedAtById:function(e){return this.$nuxt.$store.getters.getProgramJoinedAtById(e)},hasJoinedProgramById:function(e){return this.$nuxt.$store.getters.hasJoinedProgramById(e)},getProgramById:function(e){return this.$nuxt.$store.getters.getProgramById(e)},getDoneCountByProgramData:function(e){return this.$nuxt.$store.getters.getDoneCountByProgramData(e)},getNextExerciseByProgramData:function(e,t){if("challengemode"===this.backto){var r=this.$exerciseManager.retrieveNextExerciseByChallenge(window.currentChallenge,t,this.withindex);return!1!==r&&r}return this.$nuxt.$store.getters.getNextExerciseByProgramData(e,t)},handleBack:function(){this.scoreDialog.show&&this.closeScoreDialog(),this.dobDialog.show&&this.closeScoreDialog()},closeScoreDialog:function(){this.scoreDialog.show=!1,this.dobDialog.show=!1},openScoreDialog:function(){if("dob"===this.getCurrentExercise.subtype)return this.dobDialog.kind="howimprove",void(this.dobDialog.show=!0);this.scoreDialog.show=!0},openTrendDialog:function(){var e=this;this.dobDialog.currentCalendarView=new Date,this.dobDialog.kind="checktrend",this.fillSampleData().finally((function(){e.dobDialog.graphReady=!0})),this.dobDialog.show=!0},fillSampleData:function(){var e=this;return this.$nuxt.$loading.start(),this.isCurrentUserGuest?new Promise((function(t,r){e.dobDialog.scores.dob=[];for(var i=0;i<7;i++)e.dobDialog.scores.dob.push(0);e.reloadChartData(),e.$nuxt.$loading.finish(),t(!0)})):Promise.allSettled([this.fillScoreList(),this.fillMonthData(null)]).then((function(e){})).finally((function(){e.reloadChartData(),e.$nuxt.$loading.finish()}))},fillScoreList:function(){var e=this,t={Authorization:"Bearer "+window.currentVMToken,"api-key":window.currentVMKey,useCache:!1};return this.dobDialog.graphReady=!1,["dob"].reduce((function(r,i){return r.then((function(){return e.dobDialog.scores[i]=[],e.$axios.$post($nuxt.$apiConstants.userScoreGraph+"?subtype="+i,[],t).then((function(t){if(t&&t.lastSevenScores){var r=[];Array.isArray(t.lastSevenScores)?r=t.lastSevenScores:Object.keys(t.lastSevenScores).forEach((function(e){r.push(t.lastSevenScores[e])})),r.sort((function(e,t){return e.createdAt.localeCompare(t.createdAt,void 0,{sensitivity:"accent"})})),r.forEach((function(t){var r=t.subtype||"";e.dobDialog.scores[r].push({score:t.breathingScore||0,date:e.$exerciseManager.parseJsonDate(t.createdAt)})})),r.length>1&&(e.showTrend=!0)}})).catch((function(e){}))}))}),Promise.resolve())},fillMonthData:function(e){var t=this,r=e||new Date,i=this.getFirstDayOfMonth(r),a=this.getLastDayOfMonth(r),n={Authorization:"Bearer "+window.currentVMToken,"api-key":window.currentVMKey,useCache:!1},s=this.$exerciseManager.formatDateYmd(i),o=this.$exerciseManager.formatDateYmd(a),c="?startDate=".concat(s,"&endDate=").concat(o,"&subtype=dob&type=")+this.getCurrentExercise.type;return void 0!==this.dobDialog.eventsCache[c]?new Promise((function(e,t){e(!0)})):this.$axios.$post($nuxt.$apiConstants.userActivities+c,[],n).then((function(e){if(e&&e.activitiesHistory){var r=t.parseMonthDataResults(e.activitiesHistory),i={};r.forEach((function(e){var r=t.$exerciseManager.formatDateYmd(e.date),a=void 0!==i[r]?i[r]:[];a.push(e),i[r]=a})),Object.keys(i).map((function(e){var r=i[e];if(r.length>0){var a=r[0].date,n=new Date(a.getFullYear(),a.getMonth(),a.getDate()),s={name:"exercises_"+e,start:n,end:n,color:"blue",timed:!0,events:r};t.dobDialog.events.push(s)}})),t.dobDialog.eventsCache[c]=i}}))},parseMonthDataResults:function(e){var t=this,r=[];return e.forEach((function(e){var i=new Date(e.createdAt),a={unixTime:i.getTime(),date:i,title:e.title,time:t.$exerciseManager.formatDateHi(i),type:e.type||"exercise",programID:e.programId||"",id:e.breathingExerciseId||"",score:e.breathingScore||""};a.id===t.getCurrentExercise.id&&r.push(a)})),r.sort((function(e,t){return e.unixTime>t.unixTime?-1:t.unixTime>e.unixTime?1:0}))},getFirstDayOfMonth:function(e){return new Date(e.getFullYear(),e.getMonth(),1)},getLastDayOfMonth:function(e){return new Date(e.getFullYear(),e.getMonth()+1,0)},reloadChartData:function(){var e=this;this.dobDialog.graphReady=!1,new Promise((function(t,r){var a=e.dobDialog.scores.dob;if(void 0===a){var n={labels:s,datasets:[{label:"",data:[]}]};return e.$set(e.dobDialog,"lineChartData",n),void t(!0)}for(var s=[],o=0;o<a.length;o++){var c=a[o];if("object"===Object(i.a)(c)){var l=e.$exerciseManager.formatDateMonthDay(c.date);s.push(l)}else s.push(o)}var d={labels:s,datasets:[{label:"",data:a.map((function(e){return"object"===Object(i.a)(e)?e.score:e}))}]};e.$set(e.dobDialog,"lineChartData",d),t(!0)})).finally((function(){e.dobDialog.graphReady=!0}))},openInfoDialog:function(){this.dobDialog.kind="whatiscardio",this.dobDialog.show=!0},getRunningProgramDoneCount:function(){return this.currentProgram?this.getDoneCountByProgramData(this.currentProgram):0},pickProgram:function(e){$nuxt.$router.push($nuxt.localePath("/ml/programs/"+e.id))},pickProgramExercise:function(e){$nuxt.$router.push($nuxt.localePath("/ml/exercises/"+e.id+"/"+e.program_id+"/"+e.program_index+"/"+this.backto))},moveNextProgram:function(e){$nuxt.$router.push($nuxt.localePath("/ml/programs/"+e.id))},formatSeconds:function(e){return this.$humanizeTimeNoSuffix(e)},animeWorld:function(){this.$analytics.logEvent("exercise_completed",{id:this.getCurrentExercise.id,name:this.getCurrentExercise.title,program_id:this.getCurrentExercise.program_id||null,type:this.getCurrentExercise.type});var e=g,t=m,r=v,i=p,n=b,s=f;e.delay=this.$anime.stagger(300,{start:200}),e.autoplay=!1,s.delay=500;var o=!1,c=this.$anime(e),l=this.$anime.timeline({easing:"easeOutExpo",duration:750,autoplay:!1});l.delay=this.$anime.stagger(300,{start:200}),l.add(t),l.add(r),l.add(i),l.add(n),s.update=function(e){e.progress>=60&&!1===o&&(o=!0,Object(a.a)(document.querySelectorAll(".faded")).map((function(e){return e.classList.remove("faded")})),c.play(),l.play())},this.$anime(s),this.animateCircle(),this.updateExternalLink()},ensureProgramCompleted:function(){this.currentProgram.exercises.length===this.getDoneCountByProgramData(this.currentProgram)&&this.$exerciseManager.programCompleteCurrent(this.currentProgram.id).then((function(e){})).catch((function(e){}))},exerciseStepBack:function(){var e=this;if("standalone"==this.backto||"challengemode"==this.backto){var t={medal:this.medalScore};if(this.breathscores.forEach((function(r){void 0!==e.getCurrentExercise[r.key]&&(t[r.key]=e.getCurrentExercise[r.key])})),this.breathscoresVoices.forEach((function(r){void 0!==e.getCurrentExercise[r.key]&&(t[r.key]=e.getCurrentExercise[r.key])})),"challengemode"===this.backto){var r=this.getNextExerciseByProgramData(window.currentChallenge,this.getCurrentExercise);if(!1!==r)return window.currentExercise=r,void this.pickProgramExercise(r)}$nuxt.$airlyn.closeExercise().finally((function(){e.$disablekeepawakemanager()}))}return"today"==this.backto?(this.ensureProgramCompleted(),void $nuxt.$router.replace($nuxt.localePath("/user/today"))):"discovery"==this.backto?(this.ensureProgramCompleted(),void $nuxt.$router.replace($nuxt.localePath("/home"))):void(this.programid?"-1"==this.programid||-1==this.programid||"false"==this.programid||0==this.programid?$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/ml/programs/"+this.programid)):(this.ensureProgramCompleted(),$nuxt.$router.replace($nuxt.localePath("/user/today"))))},buildSuffix:function(){var e=[];return e.push(!!this.programid&&this.programid),e.push(this.withindex?this.withindex:"-1"),e.push(!!this.backto&&this.backto),e.join("/")},openRegister:function(){var e=this;this.$useractions.logout().then((function(t){e.setRunningProgram(null),e.setCurrentUser({}),e.setIsGuest(!1),e.$axiosService.$clearCache()})).catch((function(e){})).finally((function(){$nuxt.$router.push($nuxt.localePath("/user/signup")+"/0")}))},contactUsStep:function(){this.$browser.open({url:"https://airlyn.io/contact-us/"})},prevStep:function(){},quitStep:function(){this.exerciseStepBack()},backStep:function(){var e=this.buildSuffix();if(e.length>0&&(e="/"+e),this.exid){this.$router.push($nuxt.localePath("/ml/exercises/"+this.exid+e))}else this.exerciseStepBack();this.$gtag("event","click",{event_label:"Redo",event_category:"Exercises"})},nextStep:function(){this.hasJoinedProgramById(this.programid)&&this.getNextExerciseByProgramData(this.currentProgram,this.getCurrentExercise)&&!this.isCurrentUserGuest?this.pickProgramExercise(this.getNextExerciseByProgramData(this.currentProgram,this.getCurrentExercise)):(document.querySelector("#__nuxt")&&document.querySelector("#__nuxt").classList.add("quit"),this.$gtag("event","click",{event_label:"Done",event_category:"Exercises"}),this.exerciseStepBack())},formatDay:function(e){return this.$t("weeknames.long-"+e.getDay())+", "+e.getDate()+" "+this.$t("months.short-"+e.getMonth())},isCurrentDay:function(e,t,r){if(this.dobDialog.currentDay&&new Date(e,t-1,r).getTime()==this.dobDialog.currentDay.getTime())return"active";return""},picksingleDate:function(e,t,r){this.pickedDate({year:e,month:t,day:r})},isDisabledDay:function(e,t,r){var i=new Date(t,r-1,e);return!!(this.dobDialog.maxCalendarObj&&i.getTime()>this.dobDialog.maxCalendarObj.getTime())||!!(this.dobDialog.sinceobj&&i.getTime()<this.dobDialog.sinceobj.getTime())},calPrev:function(){this.$refs.calendar.prev()},calNext:function(){this.$refs.calendar.next()},pickedDate:function(e){var t=this;this.dobDialog.currentDay=new Date(e.year,e.month-1,e.day);var r=this.dobDialog.events.find((function(e){return e.start.getTime()===t.dobDialog.currentDay.getTime()}));r?this.dobDialog.currentDayEvents=r.events:this.$set(this.dobDialog,"currentDayEvents",[])},returnMonth:function(e){return""},returnDay:function(e){return e.day},returnWeekName:function(e){return this.$t("weeknames.ushort-"+e.weekday)},updateRange:function(e){var t=e.start,r=(e.end,new Date(t.year,t.month-1,t.day));this.dobDialog.currentCalendarView=r,this.fillMonthData(r)}})},_=r(39),D=Object(_.a)(y,(function(){var e=this,t=e._self._c;return e.currentProgram?t("fullpage-card",{class:["center-title no-header finishcard v2",e.breathingScoreShow||e.getCurrentExercise.type==e.$exerciseManager.kindHOLD?"withRecord":"noRecord"],attrs:{hiddehheader:!0},scopedSlots:e._u([{key:"body",fn:function(){return[t("div",{staticClass:"headerLine"},[t("v-btn",{staticClass:"finish-close-btn",attrs:{icon:""},on:{click:e.quitStep}},[t("v-icon",[e._v("mdi-close-circle-outline")])],1),e._v(" "),e.isCurrentUserGuest?e._e():t("div",{staticClass:"middle-title"},[t("div",{staticClass:"exerciseInfo"},[t("span",{domProps:{innerHTML:e._s(e.getCurrentExercise.title)}})])]),e._v(" "),t("v-btn",{staticClass:"finish-close-btn",staticStyle:{opacity:"0"},attrs:{icon:""},on:{click:e.quitStep}},[t("v-icon",[e._v("mdi-close-circle-outline")])],1)],1),e._v(" "),t("div",{staticClass:"coverImage"},[e._v(" ")]),e._v(" "),e.breathingScoreShow||e.getCurrentExercise.type==e.$exerciseManager.kindHOLD?t("div",{class:["recordtitle","ext_"+e.getCurrentExercise.type]},[t("div",{staticClass:"circles"},[t("div",{staticClass:"circle one"},[e._v(" ")]),e._v(" "),t("div",{staticClass:"circle two"},[e._v(" ")]),e._v(" "),t("div",{staticClass:"circle three"},[e._v(" ")])]),e._v(" "),e.getCurrentExercise.type!=e.$exerciseManager.kindRECORDING?t("v-img",{attrs:{src:e.relaxingFinish}}):e._e(),e._v(" "),e.breathingScoreShow?t("div",{class:["star big animated faded",e.breathingClass]}):e._e(),e._v(" "),t("div",{staticClass:"cardtitle"},["dob"===e.getCurrentExercise.subtype?t("div",{staticClass:"title"},[e._v("\n          "+e._s(e.getStaminaTitle)+"\n        ")]):t("div",{staticClass:"title"},[e._v("\n          "+e._s(e.$t("ml_finish.title_"+e.breathingClass))+"\n        ")])])],1):e._e(),e._v(" "),e.breathingScoreShow||e.getCurrentExercise.type==e.$exerciseManager.kindHOLD?t("div",{staticClass:"records"},[e.breathingScoreShow?t("div",{class:["score animated screenAnimation",e.breathingClass]},[t("div",{staticClass:"screenAnimation_inner",domProps:{innerHTML:e._s(e.$t("dob"===e.getCurrentExercise.subtype?"ml_finish.dob.title":"ml_finish.breathescore"))}}),e._v(" "),t("div",{staticClass:"screenAnimation_inner scorevalue"},[e._v(e._s(e.breathingScore)),t("span",{staticClass:"secondaryunit"},[e._v("/100")])]),e._v(" "),e.breathingScoreShow?t("div",{staticClass:"screenAnimation_inner alone",on:{click:e.openScoreDialog}},[e._v("\n          "+e._s(e.$t("dob"===e.getCurrentExercise.subtype?"ml_finish.dob.howimprove":"ml_finish.score_explaination_cta"))+"\n        ")]):e._e()]):e._e(),e._v(" "),e.getCurrentExercise.type==e.$exerciseManager.kindHOLD&&e.getCurrentExercise.exerciseInfo?t("div",{staticClass:"score animated screenAnimation"},[t("div",{staticClass:"screenAnimation_inner",domProps:{innerHTML:e._s(e.$t("dob"===e.getCurrentExercise.subtype?"ml_finish.dob.title":"ml_finish.breathingholdtimeaverage"))}}),e._v(" "),t("div",{staticClass:"screenAnimation_inner scorevalue"},[e._v("\n          "+e._s(e.formatSeconds(e.getCurrentExercise.exerciseInfo.averageHeldTime||0))),t("span",{staticClass:"secondaryunit"},[e._v(e._s(e.$t("generic.unit_seconds_short")))])])]):e._e(),e._v(" "),"dob"===e.getCurrentExercise.subtype&&e.showTrend?t("div",{staticClass:"innerScore fromAbove animated faded"},[t("div",{staticClass:"screenAnimation_inner alone",on:{click:e.openTrendDialog}},[t("v-icon",[e._v("$trend_icon")]),e._v(" "),t("span",{staticClass:"text"},[e._v(e._s(e.$t("ml_finish.dob.checktrend")))])],1)]):e._e(),e._v(" "),"dob"===e.getCurrentExercise.subtype?t("div",{staticClass:"innerScore fromAbove animated faded"},[t("div",{staticClass:"screenAnimation_inner alone",on:{click:e.openInfoDialog}},[t("v-icon",[e._v("$question_icon")]),e._v(" "),t("span",{staticClass:"text"},[e._v(e._s(e.$t("ml_finish.dob.whatiscardio")))])],1)]):e._e()]):t("div",{staticClass:"norecords animated faded"},[t("div",{staticClass:"circles"},[t("div",{staticClass:"circle one"},[e._v(" ")]),e._v(" "),t("div",{staticClass:"circle two"},[e._v(" ")]),e._v(" "),t("div",{staticClass:"circle three"},[e._v(" ")])]),e._v(" "),t("v-img",{attrs:{src:e.relaxingFinish}}),e._v(" "),t("div",{staticClass:"cardtitle"},[t("div",{staticClass:"title"},[e._v("\n          "+e._s(e.$t("ml_finish.title_"+e.breathingClass))+"\n        ")])])],1),e._v(" "),t("div",{staticClass:"guestmessage"},[e.isCurrentUserGuest?t("div",{domProps:{innerHTML:e._s(e.$t("ml_finish.guest_finish_message"))}}):e.getCurrentExercise.type!=e.$exerciseManager.kindHOLD&&e.getCurrentExercise.type!=e.$exerciseManager.kindRECORDING?t("div",{domProps:{innerHTML:e._s(e.$t("ml_finish.client_finish_message"))}}):e._e()]),e._v(" "),e.isCurrentUserGuest?t("div",{class:["guestbox fromAbove animated faded",e.breathingClass]},[t("v-list-item",{on:{click:e.openRegister}},[t("v-list-item-avatar",[t("v-icon",[e._v("$unlockguest")])],1),e._v(" "),t("v-list-item-title",{domProps:{innerHTML:e._s(e.$t("ml_finish.registercta_v2"))}})],1)],1):e._e()]},proxy:!0},{key:"footer",fn:function(){return[t("transition",{staticClass:"fade"},[t("v-btn",{attrs:{color:"backvm",text:"",nuxt:""},on:{click:e.backStep}},[t("v-icon",[e._v("mdi-reload")]),e._v("\n        "+e._s(e.$t("generic.redo"))+"\n      ")],1)],1),e._v(" "),t("v-spacer"),e._v(" "),t("transition",{staticClass:"fade"},[t("v-btn",{staticClass:"nextController",attrs:{color:"nextvm"},on:{click:e.nextStep}},[e.getNextExerciseByProgramData(e.currentProgram,e.getCurrentExercise)&&!e.isCurrentUserGuest?[e._v("\n          "+e._s(e.$t("generic.next"))+" \n        ")]:e.getNextExerciseByProgramData(e.currentProgram,e.getCurrentExercise)&&!e.isCurrentUserGuest?[t("span",{domProps:{innerHTML:e._s(e.$t("generic.next_program"))}}),e._v(" "),t("span",[e._v("→")])]:[e._v("\n          "+e._s(e.$t("generic.done_arrow"))+" \n        ")]],2)],1),e._v(" "),t("v-dialog",{attrs:{fullscreen:"","hide-overlay":"",transition:"dialog-bottom-transition",scrollable:"","content-class":"scoreDialog dobDialog"},model:{value:e.dobDialog.show,callback:function(t){e.$set(e.dobDialog,"show",t)},expression:"dobDialog.show"}},[t("fullpage-card",{scopedSlots:e._u([{key:"header",fn:function(){return[t("div",{staticClass:"headerLine"},[t("v-btn",{staticClass:"closebtn",attrs:{icon:""},on:{click:e.closeScoreDialog}},[t("v-icon",[e._v("mdi-chevron-left")])],1),e._v(" "),t("div",{staticClass:"middle-title"},[t("div",{staticClass:"exerciseInfo"},[t("span",{domProps:{innerHTML:e._s(e.getCurrentExercise.title)}})])]),e._v(" "),t("v-btn",{staticClass:"closebtn",staticStyle:{opacity:"0"},attrs:{icon:""},on:{click:e.closeScoreDialog}},[t("v-icon",[e._v("mdi-close-circle-outline")])],1)],1),e._v(" "),t("div",{staticClass:"cardtitle",domProps:{innerHTML:e._s(e.$t("ml_finish.dob."+e.dobDialog.kind))}}),e._v(" "),"howimprove"===e.dobDialog.kind?t("div",{staticClass:"records"},[e.breathingScoreShow?t("div",{staticClass:"score"},[t("div",[e._v(e._s(e.getCurrentExercise.breathingScore||0)+"/100")]),e._v(" "),t("div",{staticClass:"scoreBar"},[t("span",{style:"width:"+(e.getCurrentExercise.breathingScore||0)+"%;"})])]):e._e()]):e._e()]},proxy:!0},{key:"body",fn:function(){return["checktrend"===e.dobDialog.kind?t("div",{class:["home_container tabs me_container","currentsheet-"+e.dobDialog.currentSheet]},[t("v-tabs",{attrs:{"background-color":"transparent","hide-slider":!0,grow:""},model:{value:e.dobDialog.currentSheet,callback:function(t){e.$set(e.dobDialog,"currentSheet",t)},expression:"dobDialog.currentSheet"}},e._l(["track","history"],(function(r){return t("v-tab",{key:r},[e._v("\n                "+e._s(e.$t("me."+r).trim())+"\n              ")])})),1),e._v(" "),t("v-tabs-items",{model:{value:e.dobDialog.currentSheet,callback:function(t){e.$set(e.dobDialog,"currentSheet",t)},expression:"dobDialog.currentSheet"}},[t("v-tab-item",{key:"track",staticClass:"track"},[t("div",{staticClass:"track_container"},[t("h3",[e._v(e._s(e.$t("me.scoreTrend")))]),e._v(" "),e.dobDialog.graphReady?t("div",{staticClass:"chartArea"},[t("LineChart",{attrs:{chartoptions:e.dobDialog.barChartOptions,chartdata:e.dobDialog.lineChartData,height:260,width:300,chartid:"lineChart"}}),e._v(" "),!e.isCurrentUserGuest&&e.dobDialog.lineChartData.datasets[0].data.length>0?t("em",[e._v(e._s(e.$t("me.last7scores")))]):(e.isCurrentUserGuest||e.dobDialog.lineChartData.datasets[0].data.length,t("em",[e._v(e._s(e.$t("me.nodatatodisplay")))]))],1):e._e()])]),e._v(" "),t("v-tab-item",{key:"history",staticClass:"history"},[t("div",{staticClass:"hist_container"},[t("v-toolbar",{attrs:{flat:""}},[t("v-btn",{staticClass:"calbtn prev",attrs:{ripple:!1,text:"",disabled:e.isPrevDisabled},on:{click:e.calPrev}},[t("v-icon",[e._v("$chevronleft")])],1),e._v(" "),e.$refs.calendar?t("v-toolbar-title",[e._v("\n                      "+e._s(e.$refs.calendar.title)+"\n                    ")]):e._e(),e._v(" "),t("v-btn",{staticClass:"calbtn next",attrs:{ripple:!1,text:"",disabled:e.isNextDisabled},on:{click:e.calNext}},[t("v-icon",[e._v("$chevronright")])],1)],1),e._v(" "),t("v-calendar",{ref:"calendar",attrs:{color:"primary",type:"month",start:e.$exerciseManager.formatDateYmd(new Date),end:e.maxCalendar,events:e.dobDialog.events,"month-format":e.returnMonth,"weekday-format":e.returnWeekName,"day-format":e.returnDay},on:{"click:date":e.pickedDate,change:e.updateRange},scopedSlots:e._u([{key:"day-label",fn:function(r){var i=r.day,a=r.year,n=r.month,s=r.present;return[t("div",{staticClass:"v-calendar-weekly__day-label"},[e.isDisabledDay(i,a,n)?t("span",{staticClass:"disabled-day"},[e._v("\n                    "+e._s(i)+"\n                  ")]):t("v-btn",{class:e.isCurrentDay(a,n,i),attrs:{small:"",ripple:!1,fab:"",depressed:"",color:s?"primary":"transparent"},on:{click:function(t){return e.picksingleDate(a,n,i)}}},[e._v("\n                          "+e._s(i)+"\n                        ")])],1)]}}],null,!1,3866996244),model:{value:e.dobDialog.focus,callback:function(t){e.$set(e.dobDialog,"focus",t)},expression:"dobDialog.focus"}}),e._v(" "),e.dobDialog.currentDay?t("div",{staticClass:"historyContainer"},[t("h3",[e._v(e._s(e.formatDay(e.dobDialog.currentDay)))]),e._v(" "),e.isCurrentUserGuest?t("div",{staticClass:"history_item"},[t("div",[t("p",{staticClass:"nodataCalendar"},[e._v(e._s(e.$t("me.fullhistory")))])])]):e._l(e.dobDialog.currentDayEvents,(function(r){return t("div",{staticClass:"history_item"},[t("div",{staticClass:"when"},[e._v(e._s(r.time))]),e._v(" "),t("div",{class:["what","type-"+r.type]},[t("div",{staticClass:"recording"},[e._v(e._s(r.title))]),e._v(" "),"recording"===r.type?t("span",[e._v("\n                    Score: "+e._s(r.score)+"\n                  ")]):e._e()])])}))],2):e._e()],1)])],1)],1):t("div",{staticClass:"explainationstab dob"},[t("div",{staticClass:"content",staticStyle:{"min-width":"100vw"}},["howimprove"!=e.dobDialog.kind?t("div",{domProps:{innerHTML:e._s(e.$t("ml_finish.dobscore_"+e.dobDialog.kind))}}):t("div",{domProps:{innerHTML:e._s(e.getStaminaResult)}})])])]},proxy:!0}],null,!1,1435530300)})],1),e._v(" "),t("v-dialog",{attrs:{fullscreen:"","hide-overlay":"",transition:"dialog-bottom-transition",scrollable:"","content-class":"scoreDialog"},model:{value:e.scoreDialog.show,callback:function(t){e.$set(e.scoreDialog,"show",t)},expression:"scoreDialog.show"}},[t("fullpage-card",{scopedSlots:e._u([{key:"header",fn:function(){return[t("v-btn",{staticClass:"closebtn",attrs:{icon:""},on:{click:e.closeScoreDialog}},[t("v-icon",[e._v("mdi-close-circle-outline")])],1)]},proxy:!0},{key:"body",fn:function(){return[t("div",{staticClass:"cardtitle",domProps:{innerHTML:e._s(e.$t("dob"===e.getCurrentExercise.subtype?"ml_finish.breathingstaminaexplaination":"ml_finish.howisscorecalculated"))}}),e._v(" "),t("div",{staticClass:"records"},[e.breathingScoreShow?t("div",{staticClass:"score"},[t("div",[e._v(e._s(e.getCurrentExercise.breathingScore||0)+"/100")]),e._v(" "),t("div",{staticClass:"scoreBar"},[t("span",{style:"width:"+(e.getCurrentExercise.breathingScore||0)+"%;"})])]):e._e()]),e._v(" "),(e.getCurrentExercise.breathingScore||0)>0?t("div",{staticClass:"explainations",domProps:{innerHTML:e._s(e.$t("dob"===e.getCurrentExercise.subtype?"ml_finish.scoreexplainationdob":"ml_finish.scoreexplaination"))}}):e._e(),e._v(" "),(e.getCurrentExercise.breathingScore||0)<1?t("div",{staticClass:"explainationstab zeroresult"},[t("div",{staticClass:"content"},[t("div",{domProps:{innerHTML:e._s(e.$t("ml_finish.zeroscore_description"))}}),e._v(" "),t("div",{staticClass:"actions"},[t("v-btn",{attrs:{color:"backvm",text:"",nuxt:""},on:{click:e.backStep}},[t("v-icon",[e._v("mdi-reload")]),e._v("\n                  "+e._s(e.$t("generic.redo"))+"\n                ")],1),e._v(" "),t("v-btn",{staticClass:"nextController",attrs:{color:"nextvm"},on:{click:e.contactUsStep}},[e._v(e._s(e.$t("generic.contactus"))+"\n                ")])],1)])]):"dob"==e.getCurrentExercise.subtype?t("div",{staticClass:"explainationstab dob"},[t("div",{staticClass:"content"},[t("div",{domProps:{innerHTML:e._s(e.$t("ml_finish.dobscore_description"))}})])]):t("div",{staticClass:"explainationstab"},[t("div",{staticClass:"header"},e._l(e.breathscores,(function(r){return t("div",{key:r.key,class:["header__item",r.active?"active":""],on:{click:function(t){return e.updateActiveItem(r.key)}}},[t("v-img",{attrs:{src:r.img}}),e._v(" "),t("div",{staticClass:"title",domProps:{textContent:e._s(e.$t("ml_finish."+r.key))}}),e._v(" "),t("div",{staticClass:"subtitle"},[e._v(e._s(e.getCurrentExercise[r.key]||0))])],1)})),0),e._v(" "),t("div",{staticClass:"content"},e._l(e.breathscores,(function(r){return t("div",{key:r.key,class:["content__item",r.active?"active":""],domProps:{innerHTML:e._s(e.$t("ml_finish."+r.key+"_desc"))}})})),0)])]},proxy:!0}],null,!1,3365724082)})],1)]},proxy:!0}],null,!1,2364711313)}):e._e()}),[],!1,null,null,null);t.default=D.exports;installComponents(D,{LineChart:r(958).default,FullpageCard:r(181).default})},958:function(e,t,r){"use strict";r.r(t);r(319);var i=r(954),a=r(951);a.Chart.register(a.Title,a.Tooltip,a.Legend,a.LineElement,a.LinearScale,a.CategoryScale,a.PointElement);var n={props:{chartid:{type:String,default:"chart"},datasetIdKey:{type:String,default:"label"},width:{type:Number,default:400},height:{type:Number,default:400},cssClasses:{default:"",type:String},styles:{type:Object,default:function(){}},plugins:{type:Array,default:function(){return[]}},chartoptions:{type:Object,default:function(){}},chartdata:{type:Object,default:function(){}}},name:"LineChart",components:{LineChartGenerator:i.Line},mounted:function(){}},s=r(39),o=Object(s.a)(n,(function(){var e=this;return(0,e._self._c)("LineChartGenerator",{attrs:{"chart-options":e.chartoptions,"chart-data":e.chartdata,"chart-id":e.chartid,"dataset-id-key":e.datasetIdKey,plugins:e.plugins,"css-classes":e.cssClasses,styles:e.styles,width:e.width,height:e.height}})}),[],!1,null,null,null);t.default=o.exports},963:function(e,t,r){"use strict";r(964)},964:function(e,t,r){"use strict";var i=r(1),a=r(19),n=r(48),s=r(141),o=r(225),c=r(139);i({target:"Promise",stat:!0,forced:r(343)},{allSettled:function(e){var t=this,r=s.f(t),i=r.resolve,l=r.reject,d=o((function(){var r=n(t.resolve),s=[],o=0,l=1;c(e,(function(e){var n=o++,c=!1;l++,a(r,t,e).then((function(e){c||(c=!0,s[n]={status:"fulfilled",value:e},--l||i(s))}),(function(e){c||(c=!0,s[n]={status:"rejected",reason:e},--l||i(s))}))})),--l||i(s)}));return d.error&&l(d.value),r.promise}})},965:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANGSURBVHgBpVbLbtNQEJ0Zk4IEiBSJNTYBNiyI4AMIXbIhLXUFQoLQP4APgMAHwB807QpwCg0LWLbhCwg7XiVhCRIkoiBo3HuHufGjbnDzgCPFlu+9njMznjkThBHheu/yyGQz6qzcO3JvVedONkZ5FwdtXq6+Lyii68hQlMdsypEOM9Qs0EuP3BP1sUgurzRtpbiCwAUYEQyw6Ft0tzbttIaSGO810kqf5x351YH16+036bRcCzvOITS11vPLfVFhCsFawr2WGCt3N+BZ7YbT6XfI9b7I9XsJEe+IJTt6S7OeShLFJCZF4sWaGLYD+1z3N6zpNONJlNcY3nxuOXqPvi+PxXC53bXoTJS6PdFhrfQDudkhc82bPT6dZtT1PpT8jFWPDJTP9/xsus+bM/BLrSJgQZ4nM4oX5D5lNilKU+yFpGjTp5uwC5CwktGq0L9+6oLNvmXNQPD9wBTNbGA3INGMpYSVcu3K3xUyDGVEyPj726zhVmQJia7FJEB4MdzoeLPOEvwjTrlHwM9QDaJogv4CcleaeQjLkJlfwn/ARHOQVVDuAbJGKUgrZUeHJI8jycQgWGhxsp8IM0eJtM6OZUUKAxkr7vJ6pShlP+y4JjVJmqgDY8Bzc4502w3J97kJpT+61fWFYuXVro6SttpEltXadhLzZVG8YajOHV9kPnhMyObl69pJ3VCspFUoH0fC/qfe9tzyehuCj9/p/thwaqX8WNEl4XqfpHS3voX22t5s7jCFdM/CM9mJA4cujhJNGkorTbn6pZBAGgVMOYfNiLwYn0Rdbiy9noQxYTTsN4CDFt4Ol1hp3eu5OJvu8gejO+d7u4D1faSncpM5DrVpMIFE/vZJExWAjAg2jc0SxeLjS7n5OBIDy7fMQjtg5sKmxqeNTssJ5Hx341dffIVGrXV4C2A1JAj0r0v3onM73DSCRkir8TrKPGG6u3dCwt7ioNFC/JwA9LuQzfiqKKJpZD4qYxkndLY65zRSSWIioAXZcRLL/ZMRw8l4DnZO0G/CMCMDa4c8pc/4hzLAMuqObF+HIX82QnBvyEnK0xR8oIEgfYaop9Lp/1akTFmqqN/7kUmScL1mXnTINlpnpEjkopXM+yD8AcAIez5qsTvJAAAAAElFTkSuQmCC"},966:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKZSURBVHgB7Za/T1NRFMfPua/gj9TQ1tI4GRgYOoiaOJg4dcBNGfwHrBQMg9VFTNoSn7Ql0WgURl4pbg4uGBdjjJIwmigkbg40xkShNDBIUn0/jqelP14LLb72GZZ+kpv77q9zv/fc8857AB0OGQSLzN76euToiR4/IrqIaHts2rcCbWBZgBLNKogQqnQQZAggOJrsXYIWEGAVAVpNG6GPy2tlYtMPLWBZgCN/7AEBXjMMCvLp07sawAld+h1oActXUE8qll3lapDLSijRe77cPxfZOFeIk6JoIenBuGd5v/UOaANl4udFPsPpQiAw26bNrwuBC+W2TjqkotkMEMVD0750QwFKdGOGVYfBElSq8HnTacVYwfn05KbzRtw7W+02we7c4soFVkF8FIp775m75mO5y0R6T2mCnxDuFmOFPSX9cvQHn7mLHqu7AgwCGsPwrxCqKODFyJT3Q/3QSOLkW3NbiWULrpri4tKdKl8dvNkjIJTwLnK1CP8DguWKvxE95W7reaAFZJkECKrEFoJYqz6bSMVytwmMq2izMPb9WbbpLm35hT19pjxWGwNETzjNSmAzWLWfUTXtinmsRoBBxmN+DYNI1HaCqpOww3ZfarTzdPxh3w/oYKLG1Yq8PgiaGAYy2ooDjnKDQF8dTZ56dfBcE5yv14op0y74X0HtcgTGZXem0RRRJ+c72AkfpkvV3smyLBpPqYFwbjJ3AdpEgN4NIN3n126oaJUg0OiPqf5bQGNx+Ag2kIpkZ1jJrgDUB7hagoMFtMeCvOVS9fyAMI6zZ//crAwY+K3RGtsSTmFzXdU+7wlizn6hpK+/0Trbcr4Eju79Nlc1PdBsna0pV4msD7HFSxJKqibwU97reR8O42/o0KEJfwGgU9Ws5wxaRgAAAABJRU5ErkJggg=="},967:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMrSURBVHgBtVbdThNBFD7nTIsEEgRjQLzp9t5EGtRbi0/QlJh4J/gAAm+ALyDoE8C1CuUJLLeKtCTesyYaBDQUEyuynTmeme22S6ltTeOXdLszc+b8fnNmAf4zsFfB3EHJA6h5zZmEX5jM+N32YWel77OImEPCx8Aw2kbER6RVrWErbmz2aGdBa+Xm2hrI7ZdGcUivIoji3iCKaPnNRGZ99nAnx4Cbdm5jYjqduOx1ySMybyU4rzGJUAEDBSQus4ZTVHCVGbKAmK1H5jGYtfxxyeNaTWwhMLJvtybaK4dIuW+MmS9M3i228fqFlUfUi5LGBTdjzDIQ+eE7nNo/iu+IK2fgdVOlzF+UhziDCv9Sy6DNUmzWi5y7EEH+YGcuvrg5cWcOOqAe7b4bIFXkWYkTAZkrFyMgWIhejaEZ6AW2NhZWcQvLKJkoNSLIfX43JdJTdeG1XvhtZYRtaRgOPGDyFELK1CAtBEjZ9VoAew0DlBA2RJYTVIAeUUhnbATl+q8BS/P6Wpgi4a0XLdZM8An6gK0lDZmT/OGH/YYBxDAs59X4vTL0AQY5HyE8G0kYATtKyRrsQ79Q1HRW0uRqwFfUMwq0r8FsQ5+QM+zIwojlcFzHo+Nd1MpIEQZhOBnwQFXDyc1BeIW3etXt2EhJ5ehp2bhxY3reRfCQP8Lvo/NdZJSecl7+caa3DeIeHFf9/Pe98si1EV7DdFcDmKTF6D1iozMQfKlay1O2ChJiVnpGNiyOkohqfuXrt3kZFTt6b/sSmPv1of/6embLGbIPlSTvsjtwAmHhU4oSKegCUq4TeM4v5q1oPiyykcJQy9WA9NJAYAW5MD7dkbr5o9KKKInS4zOr1aafVuBwRy4IzEnli5Ki2+L3WCQs7frJYEIV9cAADJuA18YyDcXuxiO1EjHH9iYDeiZ+liIDJdeL2CwZ4iKx2pDpRlXlpJdlbTvqkBJdSpKbu9Dg2ihvpsjS1mZKlFsBKdgDQv1cjngO3EEXDxHtr7mTY6/MRTZKLqZpH1qAYajyxaCC0VbrNgVE+DR2NTb2uFxr3pKrsdDpUvr3zxYlafqZ9KNu2Q1/AIp2a4mvOW6fAAAAAElFTkSuQmCC"},968:function(e,t,r){e.exports=r.p+"img/finishimage.99e12c5.png"}}]);
//# sourceMappingURL=79ad054.js.map