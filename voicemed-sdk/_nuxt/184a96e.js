(window.webpackJsonp=window.webpackJsonp||[]).push([[22,11],{1010:function(e,t,r){"use strict";r.r(t);r(3),r(4),r(8),r(5),r(9);var i=r(26),n=(r(28),r(344),r(320),r(0),r(62),r(40),r(7),r(27),r(930)),s=r(46);r(936);function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,i)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){Object(i.a)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var a={name:"postPlayer",mixins:[n.a],data:function(){return{exid:this.$route.params.id,programid:this.$route.params.fromprogram||!1,withindex:this.$route.params.withindex||!1,backto:this.$route.params.backto||!1,name:"postPlayer",exerciseThumb:null,loaded:!1,ended:!1,hasScrollToEnd:!1,uuid:"0",about:{show:!1},readingtime:0}},transition:{name:"fade",mode:"out-in",css:!1,beforeEnter:function(e){this.$anime.set(e,{scale:1,opacity:0})},enter:function(e,t){this.$anime({targets:e,opacity:[0,1],duration:500,easing:"easeInOutSine",complete:t})},leave:function(e,t){this.$anime({targets:e,opacity:[1,0],duration:500,easing:"easeInOutSine",complete:t}),document.body.classList.remove("bodyblock")}},computed:c(c({},Object(s.d)({getCurrentUser:"getCurrentUser",getExercises:"getExercises",getCurrentExercise:"getCurrentExercise",skipTutorial:"skipTutorial",isCurrentUserGuest:"isCurrentUserGuest"})),{},{localCurrentUser:function(){return $nuxt.$config.env.environment.indexOf("library")>-1?$nuxt.$useractions.retrieveMeta():this.getCurrentUser},exercise:function(){return this.getCurrentExercise}}),methods:c(c({},Object(s.c)({setCurrentExerciseIndex:"setCurrentExerciseIndex",setCurrentExerciseById:"setCurrentExerciseById",setCurrentUser:"setCurrentUser",setIsGuest:"setIsGuest",addDoneExercise:"addDoneExercise",setCurrentExerciseByData:"setCurrentExerciseByData"})),{},{readingTime:function(){var e=this.$refs.articleText.innerText.trim().split(/\s+/).length,t=Math.ceil(e/225);this.readingtime=t},imageError:function(){this.exerciseThumb=null},closeInfo:function(){this.about.show=!1},infoStep:function(){this.play&&this.playClick(),this.about.show=!0},prevStep:function(){!0!==this.about.show?this.exitClick():this.closeInfo()},nextStep:function(){var e=this;if(this.isCurrentUserGuest)return this.getCurrentExercise.completed=!0,this.$root.$emit("completedExercise",this.getCurrentExercise),void this.$nextTick((function(){e.$root.$emit("showPager",{show:!1});var t=e.buildSuffix();t.length>0&&(t="/"+t),e.$router.push($nuxt.localePath("/ml/greetings/"+e.exid+t))}));var t=!1;this.$exerciseManager.completeExercise(this.getCurrentExercise,null,null,{},this.localCurrentUser).then((function(r){r.exercise&&r.response&&r.exercise.completed?(t=!0,e.getCurrentExercise.completed=r.exercise.completed):t=$nuxt.$t("errors.global.msg_restapi")})).catch((function(r){e.$captureException(r),t=$nuxt.$t("errors.global.title"),e.$analytics.logEvent("error",{title:"cannot send exercise video"})})).finally((function(){!0===t?(e.addDoneExercise(1),e.$nextTick((function(){e.$root.$emit("showPager",{show:!1});var t=e.buildSuffix();t.length>0&&(t="/"+t),e.$router.push($nuxt.localePath("/ml/greetings/"+e.exid+t))}))):e.$root.$emit("showError",{hasretry:!0,title:"Uh-oh!<br/>",error:t,leaveBtn:e.$t("generic.startanyway"),click:function(){return e.startAgain(),!0},resetEvent:function(){return this.exerciseStepBack(),!0}})}))},generateUUID:function(){return"xxxxxxxx-xxxx-4xxx".replace(/[xy]/g,(function(e){var t;return t=16*Math.random()|0,("x"===e?t:3&t|8).toString(16)}))},exitClick:function(){this.$analytics.logEvent("exercise_quit",{id:this.getCurrentExercise.id,name:this.getCurrentExercise.title,program_id:this.getCurrentExercise.program_id||null,type:this.getCurrentExercise.type}),document.querySelector("#__nuxt")&&document.querySelector("#__nuxt").classList.add("quit"),this.exerciseStepBack()},init:function(){var e=this;this.ended=!1,this.getCurrentExercise.thumbnail&&(this.exerciseThumb=this.getCurrentExercise.thumbnail),document.querySelector(".postExercise.fullPageCard").addEventListener("scroll",(function(t){var r=t.target,i=r.scrollHeight,n=r.scrollTop;.9*i-r.clientHeight-n<1&&(e.hasScrollToEnd=!0)})),this.$nextTick((function(){e.ensureArticleHeight()}))},ensureArticleHeight:function(){var e=document.querySelector(".postExercise.fullPageCard .post__exercise__container"),t=document.querySelector(".postExercise");e.clientHeight<t.clientHeight&&(this.hasScrollToEnd=!0),this.readingTime()},handleBack:function(){this.prevStep()},retrieveCurrentExerciseAndSet:function(){var e=this;if(this.hasJoinedProgramById(this.programid)){var t=this.getProgramById(this.programid);if(this.withindex>-1){var r=t.exercises.filter((function(t){return t.id===e.exid&&t.program_index==e.withindex}));r.length>0&&this.setCurrentExerciseByData(r[0])}else this.setCurrentExerciseByData(null)}else this.setCurrentExerciseById(this.exid)}}),mounted:function(){var e=this;this.$capacitor&&this.$capacitor.isNativePlatform()&&(this.$backEmitter.callback=this.handleBack),this.uuid=this.generateUUID(),this.exid?(this.retrieveCurrentExerciseAndSet(),this.getCurrentExercise?this.init():this.exerciseStepBack(),this.$nextTick((function(){e.name="postPlayer",e.hasNext=!0,e.hasInfo=!1,e.hasBack=!1,e.$root.$emit("showPager",{show:!1}),e.$root.$emit("setNextText",e.$t("generic.done")),e.$root.$emit("showOverlay",{show:!1}),e.$analytics.logEvent("exercise_reading",{id:e.getCurrentExercise.id,name:e.getCurrentExercise.title,program_id:e.getCurrentExercise.program_id||null,program_name:e.hasJoinedProgramById(e.getCurrentExercise.program_id)?e.getProgramById(e.getCurrentExercise.program_id).name:null,type:e.getCurrentExercise.type}),e.$exerciseManager.startExercise(e.getCurrentExercise),e.$analytics.setScreenName(e.getCurrentExercise.title+" reading page")}))):this.exerciseStepBack()},beforeDestroy:function(){this.$capacitor&&this.$capacitor.isNativePlatform()&&(this.$backEmitter.callback=null)}},l=r(42),u=Object(l.a)(a,(function(){var e=this,t=e._self._c;return t("fullpage-card",{staticClass:"postExercise",attrs:{hidefooter:!0},scopedSlots:e._u([{key:"header",fn:function(){return[t("v-row",{staticClass:"navigation",attrs:{"align-content":"center",justify:"space-between"}},[t("v-btn",{attrs:{icon:""},on:{click:e.exitClick}},[t("v-icon",[e._v("mdi-close-circle-outline")])],1),e._v(" "),e.getCurrentExercise?t("div",{staticClass:"exercise__title"},[t("span",[e._v(e._s(e.$t("generic.exercisetype."+e.getCurrentExercise.type)))])]):e._e(),e._v(" "),t("v-btn",{staticStyle:{opacity:"0"},attrs:{icon:""},on:{click:e.infoStep}},[t("v-icon",[e._v("mdi-information-outline")])],1)],1)]},proxy:!0},{key:"body",fn:function(){return[t("div",{staticClass:"post__exercise__container"},[e.exerciseThumb?t("div",{staticClass:"post__thumb"},[t("v-img",{attrs:{src:e.exerciseThumb,height:"10vh"},on:{error:e.imageError}})],1):e._e(),e._v(" "),t("h3",{staticClass:"post__title",domProps:{innerHTML:e._s(e.getCurrentExercise.title)}}),e._v(" "),e.readingtime>0?t("div",{staticStyle:{"font-style":"italic","font-size":"80%",display:"none"}},[e._v("[DEV] Computed reading time: "+e._s(e.readingtime)+" minutes")]):e._e(),e._v(" "),t("div",{ref:"articleText",staticClass:"post__content",staticStyle:{"padding-bottom":"20px"},domProps:{innerHTML:e._s(e.getCurrentExercise.postDescription)}}),e._v(" "),t("div",{class:["post__actions",e.hasScrollToEnd?"sticky-actions":""]},[t("v-btn",{staticClass:"nextvm",staticStyle:{width:"100%"},attrs:{color:"nextvm"},on:{click:e.nextStep}},[t("span",{domProps:{innerHTML:e._s(e.$t("generic.done"))}})])],1)])]},proxy:!0},{key:"footer",fn:function(){return[e.getCurrentExercise?t("infodialog",{attrs:{show:e.about.show,contentclasses:"infoContent",title:e.getCurrentExercise.title,description:e.getCurrentExercise.about||"",infoImage:e.getCurrentExercise.aboutImage||e.getCurrentExercise.thumbnail},on:{close:e.closeInfo},scopedSlots:e._u([{key:"closebtn",fn:function(){return[e._v("Alright")]},proxy:!0}],null,!1,2600066686)}):e._e()]},proxy:!0}])})}),[],!1,null,null,null);t.default=u.exports;installComponents(u,{Infodialog:r(929).default,FullpageCard:r(221).default})},929:function(e,t,r){"use strict";r.r(t);r(4),r(51);var i={props:{title:{type:String,default:"Info"},transition:{type:String,default:"dialog-bottom-transition"},contentclasses:{type:String,default:""},description:{type:String,default:"Info text"},infoImage:{type:String,default:null},showSuperTitle:{type:Boolean,default:!0},thumbInTitle:{type:Boolean,default:!0},show:{type:Boolean,default:!1}},data:function(){return{}},computed:{showDialog:function(){return this.show}},methods:{closeClick:function(e){this.$emit("close",e)}},mounted:function(){}},n=r(42),s=Object(n.a)(i,(function(){var e=this,t=e._self._c;return t("v-dialog",{attrs:{fullscreen:"","hide-overlay":"",transition:e.transition,scrollable:"","content-class":"infoDialog "+e.contentclasses},model:{value:e.showDialog,callback:function(t){e.showDialog=t},expression:"showDialog"}},[t("fullpage-card",{scopedSlots:e._u([{key:"header",fn:function(){return[t("div",{class:[(e.showSuperTitle?"with":"without")+"__supertitle",(e.thumbInTitle?"with":"without")+"__thumbInTitle"]},[e.showSuperTitle?t("div",{staticClass:"text-center supertitle"},[e._v("About")]):e._e(),e._v(" "),e.infoImage&&!0===e.thumbInTitle?t("img",{staticClass:"titleImage",attrs:{src:e.infoImage}}):e._e(),e._v(" "),t("div",{staticClass:"text-center infodialog__title",domProps:{innerHTML:e._s(e.title)}})])]},proxy:!0},{key:"body",fn:function(){return[t("div",{staticClass:"text-center content"},[e.infoImage&&!1===e.thumbInTitle?t("img",{staticClass:"errorimage",attrs:{src:e.infoImage}}):e._e(),e._v(" "),t("span",{class:[e.contentclasses,"withdynamicTexts"],domProps:{innerHTML:e._s(e.description)}})])]},proxy:!0},{key:"footer",fn:function(){return[t("div",{class:["pager"]},[t("v-btn",{attrs:{color:"nextvm",nuxt:""},on:{click:e.closeClick}},[e._t("closebtn",(function(){return[t("v-icon",[e._v("mdi-reload")]),e._v(" "),t("span",{domProps:{innerHTML:e._s(e.$t("generic.done"))}})]}))],2)],1)]},proxy:!0}],null,!0)})],1)}),[],!1,null,null,null);t.default=s.exports;installComponents(s,{FullpageCard:r(221).default})}}]);
//# sourceMappingURL=184a96e.js.map