(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{923:function(t,o,i){"use strict";i(5),i(7),i(8),i(9);var e=i(179),n=i(24),r=i(26),a=(i(98),i(0),i(28),i(62),i(63),i(27),i(37),i(221),i(10),i(6),i(220),i(112),i(3),i(46));function s(t,o){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(t);o&&(e=e.filter((function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable}))),i.push.apply(i,e)}return i}function h(t){for(var o=1;o<arguments.length;o++){var i=null!=arguments[o]?arguments[o]:{};o%2?s(Object(i),!0).forEach((function(o){Object(r.a)(t,o,i[o])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):s(Object(i)).forEach((function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(i,o))}))}return t}o.a={name:"basePage",transition:{name:"slide",mode:"out-in",css:!1,beforeEnter:function(t){if(!document.querySelector("#__nuxt").classList.contains("quit")){var o=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime.set(t,{scale:1,opacity:0,translateX:o})}},enter:function(t,o){var i=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime({targets:t,opacity:[0,1],translateX:[i,"0"],duration:500,easing:"easeInOutSine",complete:o})},leave:function(t,o){if(document.querySelector("#__nuxt").classList.contains("quit"))this.$anime({targets:t,translateY:[0,"100%"],duration:500,easing:"easeInOutSine",complete:o});else{var i=document.querySelector("#__nuxt").classList.contains("back")?"100%":"-100%";this.$anime({targets:t,opacity:[1,0],translateX:["0",i],duration:500,easing:"easeInOutSine",complete:o})}},afterLeave:function(t){document.querySelector("#__nuxt").classList.remove("quit"),document.querySelector("#__nuxt").classList.remove("back")}},data:function(){return{name:"basePage",exid:this.$route.params.id,programid:this.$route.params.fromprogram||!1,withindex:this.$route.params.withindex||-1,backto:this.$route.params.backto||!1,hasBack:!1,hasNext:!1,hasInfo:!1,currentTutorial:!1,tutorialList:[],tutorialShownHard:!1}},computed:h(h({},Object(a.d)({getCurrentPagerHeight:"getCurrentPagerHeight",getTutorialShown:"getTutorialShown",getLocalTutorialShown:"getLocalTutorialShown"})),{},{isVoicemed:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")>-1},isAirlyn:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")<0},nuxtloading:function(){return $nuxt.$loading.loading},defaultHomeUrl:function(){return"/user/today"}}),methods:h(h({},Object(a.c)({setCurrentPage:"setCurrentPage",setCurrentPagerHeight:"setCurrentPagerHeight",setTutorialRunPerPage:"setTutorialRunPerPage",setTutorialRun:"setTutorialRun"})),{},{setTutorialRunLocal:function(){this.setPreferenceTutorial()},tutorialClose:function(){this.$set(this,"tutorialList",[]),this.setTutorialRunLocal(),this.currentTutorial=null},tutorialHasNext:function(){var t=this.currentTutorial.index;return!!this.tutorialList.find((function(o){return o.index===t+1}))},exerciseStepBack:function(){console.log("exit test",this.backto,this.programid),"today"!=this.backto?"discovery"!=this.backto?this.programid?"-1"==this.programid||-1==this.programid||"false"==this.programid||0==this.programid?$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/ml/programs/"+this.programid)):$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/home")):$nuxt.$router.replace($nuxt.localePath("/user/today"))},buildSuffix:function(){var t=[],o=!!this.programid&&this.programid;return t.push("-1"!==o&&o),t.push(this.withindex?this.withindex:"-1"),t.push(!!this.backto&&this.backto),t.join("/")},tutorialNext:function(){var t=this.currentTutorial?this.currentTutorial.index:0;this.currentTutorial?(this.currentTutorial.visible=!1,this.setTutorialRunLocal()):t=this.tutorialList[0].index-1;var o=this.tutorialList.find((function(o){return o.index===t+1}));if(o){this.currentTutorial=o;o.position.height;var i=o.position.top>this.appHeight/2?o.position.top-210:o.position.top-10;o.arrowTop&&(i=o.position.top-(o.position.height+10)),i=Math.max(0,i),console.warn("Nuovo scroll Top:",i,this.appHeight,this.footerHeight,o.position.height),this.$nextTick((function(){document.querySelector(".indexPage").scrollTo({top:i,left:0,behavior:"smooth"})})),o.visible=!0}else this.tutorialClose()},getTutorialIndex:function(){return this.currentTutorial?this.currentTutorial.index>this.tutorialList.length?this.tutorialList.length:this.currentTutorial.index:""},getTutorialText:function(t){return this.$t("tutorials."+this.name+".text_"+t.index,{title:t.title})},getTutorialDialogStyle:function(t){var o={},i=t.position,e=i.top;return this.$capacitor&&this.$capacitor.isNativePlatform()&&0==t.updated&&(e=i.top,t.updated=!0,console.warn("apply tutorial offset for mobile phones")),o.top=e>300?e-200+"px":e+i.height+10+"px",console.warn("DialogStyle for tutorial",t,o),"fill"!==t.width?o.left="calc("+i.left+"px - 75vw + "+i.width+"px )":(o.left="0px",o.right="0px"),Object.entries(o).map((function(t){var o=Object(n.a)(t,2),i=o[0],e=o[1];return"".concat(i,":").concat(e)})).join(";")},getTutorialStyle:function(t){var o={},i=t.position,e=i.top;return this.$capacitor&&this.$capacitor.isNativePlatform()&&0==t.updated&&(e=i.top,t.updated=!0),console.warn("Style for tutorial",t,e),"fill"===t.width?(o.top=e-4+"px",o.left="0px",o.right="0px",o.height=i.height+8+"px"):(o.top=e-4+"px",o.left=i.left-4+"px",o.right="0px",o.height=i.height+8+"px",o.width=i.width+8+"px"),Object.entries(o).map((function(t){var o=Object(n.a)(t,2),i=o[0],e=o[1];return"".concat(i,":").concat(e)})).join(";")},initTutorial:function(){var t=this,o=Object(e.a)(document.querySelectorAll(".hastutorial")),i=!1;if(this.$capacitor&&this.$capacitor.isNativePlatform()?i=this.tutorialShownHard:(this.tutorialShownHard=this.$nuxt.$store.getters.getTutorialRun(this.name),i=this.$nuxt.$store.getters.getTutorialRunPerPage(this.name)),void 0!==this.getTutorialShown[this.name]||i||this.tutorialShownHard)console.warn("hide tutorial, not needed at this round");else{if(this.$set(this,"tutorialList",[]),o.length>0){document.querySelector(".indexPage").scrollTo({top:0,left:0,behavior:"smooth"});var n=this.getLocalTutorialShown;console.warn("got local tutorials",n),o.forEach((function(o){var i=parseInt(o.dataset.tutorialindex);if(void 0===n[t.name+"_"+i]){var e=o.getBoundingClientRect();t.tutorialList.push({position:e,visible:!1,itemRef:o,updated:!1,arrowTop:"top"==o.dataset.tutorialarrow,title:o.dataset.tutorial,width:o.dataset.tutorialwidth,index:i})}})),window.tutorialList=this.tutorialList}this.tutorialList.length>0&&(this.tutorialList=this.tutorialList.sort((function(t,o){return t.index>o.index?1:o.index>t.index?-1:0}))),this.tutorialList.length>0&&(this.currentTutorial=0,this.$nextTick((function(){setTimeout((function(){t.tutorialList.forEach((function(t){t.position=t.itemRef.getBoundingClientRect()})),t.tutorialNext(),t.setTutorialRunPerPage(t.name)}),200)})))}},hasJoinedProgramById:function(t){return this.$nuxt.$store.getters.hasJoinedProgramById(t)},getProgramJoinedAtById:function(t){return this.$nuxt.$store.getters.getProgramJoinedAtById(t)},getProgramById:function(t){return this.$nuxt.$store.getters.getProgramById(t)},getOverallProgressProgramById:function(t){return this.$nuxt.$store.getters.getOverallProgressProgramById(t)},getDoneCountByProgramId:function(t){return this.$nuxt.$store.getters.getDoneCountByProgramId(t)},getNextExerciseByProgramId:function(t){return this.$nuxt.$store.getters.getNextExerciseByProgramId(t)},getExercisetocompleteCountProgramById:function(t){return this.$nuxt.$store.getters.getExercisetocompleteCountProgramById(t)},getExercisecompletedCountProgramById:function(t){return this.$nuxt.$store.getters.getExercisecompletedCountProgramById(t)},printDeviceError:function(t,o,i,e){this.$analytics.logEvent("permission_error",{title:"errors."+t+"."+o.name.toLowerCase()+".title",kind:t}),console.error("Got device error",o),!o||"NotAllowedError"!==o.name&&"NotFoundError"!==o.name&&"denied"!=o.exception.state&&"DENIED"!=o.exception.state?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),i,e):this.$root.$emit("showPermssionError",!0)},printDeviceErrorOLD:function(t,o,i,e){if(this.$analytics.logEvent("permission_error",{title:"errors."+t+"."+o.name.toLowerCase()+".title",kind:t}),console.error("Got device error",o),o.exception&&"mic"==t&&("denied"==o.exception.state||"DENIED"==o.exception.state))return o.name="DeniedError",void this.$root.$emit("showError",{title:this.$t("errors."+t+"."+o.name.toLowerCase()+".title"),error:this.$t("errors."+t+"."+o.name.toLowerCase()+".description"),hasretry:!0,click:function(){return $nuxt.$airlyn.openPermissionPanel().then((function(t){console.log("got openPermission Panel then",t,JSON.stringify(t))})).catch((function(t){console.log("got openPermission Panel catch",t,JSON.stringify(t))})).finally((function(){"function"==typeof e&&(console.log("dopo il setting riport cmq a inizio"),e())})),!0},resetEvent:e||function(){},retryBtn:"Settings"});!o||"NotAllowedError"!==o.name&&"NotFoundError"!==o.name?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),i,e):this.showError(this.$t("errors."+t+"."+o.name.toLowerCase()+".title"),this.$t("errors."+t+"."+o.name.toLowerCase()+".description"),i,e)},manageMicError:function(t,o,i){this.printDeviceError("mic",t,o,i)},manageCamError:function(t,o,i){this.printDeviceError("cam",t,o,i)},manageMicCamError:function(t,o,i){this.printDeviceError("miccam",t,o,i)},showError:function(t,o,i,e){this.$root.$emit("showError",{title:t,error:o,hasretry:null!==i,click:i||function(){},resetEvent:e||function(){}})},swipeEvent:function(t){this.$root.$emit("swipe",t)},attachSwipeListener:function(){document.addEventListener("swiped-left",this.swipeEvent),document.addEventListener("swiped-right",this.swipeEvent)},detachSwipeListeners:function(){document.removeEventListener("swiped-left",this.swipeEvent),document.removeEventListener("swiped-right",this.swipeEvent)},retrievePreferenceTutorial:function(){var t=this;this.$capacitor&&this.$capacitor.isNativePlatform()&&this.$airlyn.preferenceConfigure({group:"airlyn"}).finally((function(){console.log("preferences ready");var o="tutorial_"+t.name;t.$airlyn.preferenceGet({key:o}).then((function(i){console.log("preference read ("+o+")!",i),i&&i.value&&(1===i.value||"1"==i.value)&&(console.log("got preference Tutorial SEEN for",o,i.value),t.tutorialShownHard=!0)}))}))},setPreferenceTutorial:function(){if(this.$capacitor&&this.$capacitor.isNativePlatform()){var t="tutorial_"+this.name;this.$airlyn.preferenceSet({key:t,value:"1"}).finally((function(){console.log("preference stored for!",t)}))}this.setTutorialRun({page:this.name,index:this.currentTutorial.index}),this.tutorialShownHard=!0}}),beforeMount:function(){console.log("PRE loaded base Page"),this.setCurrentPage(this)},beforeDestroy:function(){this.detachSwipeListeners()},mounted:function(){var t=this;console.log("loaded base Page"),this.tutorialShownHard=!1,this.retrievePreferenceTutorial(),console.log("try Load index",this.name,this.dynamicTexts),this.dynamicTexts&&Object.keys(this.dynamicTexts).length>0&&Object.keys(this.dynamicTexts).map((function(o){t.$appConfiguration.getText(o).then((function(i){t.dynamicTexts[o]=i})).catch((function(i){t.dynamicTexts[o]=t.$t(t.name+"."+o)}))})),null!==this.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager")&&(document.querySelector(".v-main__wrap > div.pager").style.height=this.getCurrentPagerHeight+"px"),this.$nextTick((function(){if(t.$capacitor&&t.$capacitor.isNativePlatform())console.log("Richiesto al passaggio precedente");else{var o=t.getLocalTutorialShown;o&&void 0!==o[t.name]?t.tutorialShownHard=!0:t.tutorialShownHard=!1}t.attachSwipeListener(),null===t.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager")&&t.setCurrentPagerHeight(Math.max(document.querySelector(".v-main__wrap > div.pager").clientHeight,document.querySelector(".v-main__wrap > div.pager").offsetHeight))}))}}},925:function(t,o,i){"use strict";i(3),i(5),i(7),i(0),i(8),i(6),i(9);var e=i(26),n=i(923),r=i(46);function a(t,o){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(t);o&&(e=e.filter((function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable}))),i.push.apply(i,e)}return i}function s(t){for(var o=1;o<arguments.length;o++){var i=null!=arguments[o]?arguments[o]:{};o%2?a(Object(i),!0).forEach((function(o){Object(e.a)(t,o,i[o])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):a(Object(i)).forEach((function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(i,o))}))}return t}o.a={name:"expage",mixins:[n.a],computed:s(s({},Object(r.d)({getExercises:"getExercises",getCurrentExercise:"getCurrentExercise"})),{},{exercise:function(){return this.getCurrentExercise}}),mounted:function(){console.log("monti pagina interna ex",this.getExercises,this.getCurrentExercise),this.getExercises||console.warn("Cannot retrieve exercise list in page"),0===this.getExercises.length&&console.error("Cannot retrieve exercise list in page")}}},930:function(t,o,i){var e;e=()=>(()=>{"use strict";var t={935:function(t,o,i){var e=this&&this.__assign||function(){return e=Object.assign||function(t){for(var o,i=1,e=arguments.length;i<e;i++)for(var n in o=arguments[i])Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n]);return t},e.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Arcs=void 0;var n=i(426),r=i(941),a=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,a=i.height,s=i.width,h=new n.Shapes(o),c=new r.AudioData(t),u=a/2,l=s/2;this._options=e({count:30,diameter:a/3,lineWidth:3,frequencyBand:"mids",rounded:!0},this._options),this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(s,a));for(var p=0;p<=this._options.count/2;p++){var d=Math.floor(c.data.length/this._options.count)*p,f=c.data[d],_=(s-this._options.diameter)/this._options.count*p,v=180-45/(255/f/2),g=180+45/(255/f/2),y=2*f;h.arc(_+y/2,u,y,v,g,this._options)}var m=Math.floor(c.data.length/2),x=c.data[m];for(h.circle(l,u,this._options.diameter*(x/255),this._options),p=this._options.count/2;p<=this._options.count;p++){var w=Math.floor(c.data.length/this._options.count)*p,b=c.data[w];_=(s-this._options.diameter)/this._options.count*p+this._options.diameter,v=180-45/(255/b/2),g=180+45/(255/b/2),y=2*b,h.arc(_-y/2,u,y,v+180,g+180,this._options)}},t}();o.Arcs=a},519:function(t,o,i){var e=this&&this.__assign||function(){return e=Object.assign||function(t){for(var o,i=1,e=arguments.length;i<e;i++)for(var n in o=arguments[i])Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n]);return t},e.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Circles=void 0;var n=i(426),r=i(941),a=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,a=i.height,s=i.width,h=new n.Shapes(o),c=new r.AudioData(t),u=s/2,l=a/2;this._options=e({count:40,diameter:0,fillColor:"rgba(0,0,0,0)",frequencyBand:"mids"},this._options),this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(s,a));for(var p=0;p<this._options.count;p++){var d=Math.floor(c.data.length/this._options.count)*p,f=c.data[d];h.circle(u,l,this._options.diameter+f,this._options)}},t}();o.Circles=a},938:function(t,o,i){var e=this&&this.__assign||function(){return e=Object.assign||function(t){for(var o,i=1,e=arguments.length;i<e;i++)for(var n in o=arguments[i])Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n]);return t},e.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Cubes=void 0;var n=i(426),r=i(941),a=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i,a,s,h,c,u,l,p,d,f,_,v,g=o.canvas,y=g.height,m=g.width,x=new n.Shapes(o),w=new r.AudioData(t);this._options=e({count:20,frequencyBand:"mids",gap:5},this._options);var b=Math.floor((m-this._options.gap*this._options.count)/this._options.count);if((null===(i=this._options)||void 0===i?void 0:i.cubeHeight)||(this._options.cubeHeight=b),this._options.frequencyBand&&w.setFrequencyBand(this._options.frequencyBand),w.scaleData(Math.min(m,y)),null===(a=this._options)||void 0===a?void 0:a.mirroredX)for(var C=1,P=Math.ceil(w.data.length/2);P<w.data.length;P++)w.data[P]=w.data[Math.ceil(w.data.length/2)-C],C++;if(null===(s=this._options)||void 0===s?void 0:s.top)for(P=0;P<this._options.count;P++)for(var M=Math.floor(w.data.length/this._options.count)*P,O=w.data[M],S=(this._options.gap+b)*P,$=Math.ceil(O/b),E=0;E<$;E++){var T=E*(this._options.cubeHeight+this._options.gap);x.rectangle(S,T,b,this._options.cubeHeight,this._options)}if(null===(h=this._options)||void 0===h?void 0:h.right)for(P=0;P<this._options.count;P++)for(M=Math.floor(w.data.length/this._options.count)*P,O=w.data[M],T=P*(this._options.cubeHeight+this._options.gap),$=Math.ceil(O/b),E=0;E<$;E++)S=m-(this._options.gap+b)*E,x.rectangle(S,T,b,this._options.cubeHeight,this._options);if((null===(c=this._options)||void 0===c?void 0:c.bottom)||!(null===(u=this._options)||void 0===u?void 0:u.top)&&!(null===(l=this._options)||void 0===l?void 0:l.right)&&!(null===(p=this._options)||void 0===p?void 0:p.left)&&!(null===(d=this._options)||void 0===d?void 0:d.center))for(P=0;P<this._options.count;P++)for(M=Math.floor(w.data.length/this._options.count)*P,O=w.data[M],S=(this._options.gap+b)*P,$=Math.ceil(O/b),E=0;E<$;E++)T=y-E*(this._options.cubeHeight+this._options.gap),x.rectangle(S,T,b,this._options.cubeHeight,this._options);if(null===(f=this._options)||void 0===f?void 0:f.left)for(P=0;P<this._options.count;P++)for(M=Math.floor(w.data.length/this._options.count)*P,O=w.data[M],T=P*(this._options.cubeHeight+this._options.gap),$=Math.ceil(O/b),E=0;E<$;E++)S=(this._options.gap+b)*E,x.rectangle(S,T,b,this._options.cubeHeight,this._options);if(null===(_=this._options)||void 0===_?void 0:_.center){for(P=0;P<this._options.count;P++)for(M=Math.floor(w.data.length/this._options.count)*P,O=w.data[M],S=(this._options.gap+b)*P,$=Math.ceil(O/b),E=0;E<$;E++)T=y/2-E*(this._options.cubeHeight+this._options.gap),x.rectangle(S,T,b,this._options.cubeHeight,this._options);if(null===(v=this._options)||void 0===v?void 0:v.mirroredY)for(P=0;P<this._options.count;P++)for(M=Math.floor(w.data.length/this._options.count)*P,O=w.data[M],S=(this._options.gap+b)*P,$=Math.ceil(O/b),E=0;E<$;E++)T=y/2+E*(this._options.cubeHeight+this._options.gap),x.rectangle(S,T,b,this._options.cubeHeight,this._options)}},t}();o.Cubes=a},540:function(t,o,i){var e=this&&this.__assign||function(){return e=Object.assign||function(t){for(var o,i=1,e=arguments.length;i<e;i++)for(var n in o=arguments[i])Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n]);return t},e.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Flower=void 0;var n=i(426),r=i(941),a=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,a=i.height,s=i.width,h=new n.Shapes(o),c=new r.AudioData(t);this._options=e({count:20,diameter:a/3,frequencyBand:"mids",rotate:0},this._options);var u=s/2,l=a/2,p=360/this._options.count;this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(s,a));for(var d=0;d<this._options.count;d++){var f=Math.floor(c.data.length/this._options.count)*d,_=c.data[f],v=h.toRadians(p*d+this._options.rotate),g=h.toRadians(p*(d+1)+this._options.rotate),y=this._options.diameter/2*Math.cos(v)+u,m=this._options.diameter/2*Math.sin(v)+l,x=this._options.diameter/2*Math.cos(g)+u,w=this._options.diameter/2*Math.sin(g)+l,b=this._options.diameter+_,C=b/2*Math.cos(v)+u,P=b/2*Math.sin(v)+l,M=b/2*Math.cos(g)+u,O=b/2*Math.sin(g)+l;h.polygon([{x:y,y:m},{x:C,y:P},{x:M,y:O},{x:x,y:w}],this._options)}},t}();o.Flower=a},522:function(t,o,i){var e=this&&this.__assign||function(){return e=Object.assign||function(t){for(var o,i=1,e=arguments.length;i<e;i++)for(var n in o=arguments[i])Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n]);return t},e.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Glob=void 0;var n=i(426),r=i(941),a=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i,a=o.canvas,s=a.height,h=a.width,c=new n.Shapes(o),u=new r.AudioData(t),l=h/2,p=s/2;if(this._options=e({count:100,diameter:s/3,frequencyBand:"mids",rounded:!0},this._options),this._options.frequencyBand&&u.setFrequencyBand(this._options.frequencyBand),u.scaleData(Math.min(h,s)),null===(i=this._options)||void 0===i?void 0:i.mirroredX)for(var d=1,f=Math.ceil(u.data.length/2);f<u.data.length;f++)u.data[f]=u.data[Math.ceil(u.data.length/2)-d],d++;var _=[];for(f=0;f<this._options.count;f++){var v=Math.floor(u.data.length/this._options.count)*f,g=u.data[v],y=360/this._options.count,m=this._options.diameter+g,x=l+m/2*Math.cos(c.toRadians(y*f)),w=p+m/2*Math.sin(c.toRadians(y*f));_.push({x:x,y:w})}_.push(_[0]),c.polygon(_,this._options)},t}();o.Glob=a},658:function(t,o,i){var e=this&&this.__assign||function(){return e=Object.assign||function(t){for(var o,i=1,e=arguments.length;i<e;i++)for(var n in o=arguments[i])Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n]);return t},e.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Lines=void 0;var n=i(426),r=i(941),a=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i,a,s,h,c,u,l,p,d,f,_,v=o.canvas,g=v.height,y=v.width,m=new n.Shapes(o),x=new r.AudioData(t);if(this._options=e({count:64,frequencyBand:"mids"},this._options),this._options.frequencyBand&&x.setFrequencyBand(this._options.frequencyBand),x.scaleData(Math.min(y,g)),null===(i=this._options)||void 0===i?void 0:i.mirroredX)for(var w=1,b=Math.ceil(x.data.length/2);b<x.data.length;b++)x.data[b]=x.data[Math.ceil(x.data.length/2)-w],w++;if(null===(a=this._options)||void 0===a?void 0:a.top)for(b=1;b<=this._options.count;b++){var C=Math.floor(x.data.length/this._options.count)*b,P=x.data[C],M=0,O=$=y/this._options.count*b,S=P;m.line($,M,O,S,this._options)}if(null===(s=this._options)||void 0===s?void 0:s.right)for(b=1;b<=this._options.count;b++){C=Math.floor(x.data.length/this._options.count)*b;var $=y;O=y-(P=x.data[C]),S=M=g/this._options.count*b,m.line($,M,O,S,this._options)}if((null===(h=this._options)||void 0===h?void 0:h.bottom)||!(null===(c=this._options)||void 0===c?void 0:c.top)&&!(null===(u=this._options)||void 0===u?void 0:u.right)&&!(null===(l=this._options)||void 0===l?void 0:l.left)&&!(null===(p=this._options)||void 0===p?void 0:p.center))for(b=1;b<=this._options.count;b++)C=Math.floor(x.data.length/this._options.count)*b,P=x.data[C],O=$=y/this._options.count*b,S=(M=g)-P,m.line($,M,O,S,this._options);if(null===(d=this._options)||void 0===d?void 0:d.left)for(b=1;b<=this._options.count;b++)C=Math.floor(x.data.length/this._options.count)*b,$=0,O=P=x.data[C],S=M=g/this._options.count*b,m.line($,M,O,S,this._options);if(null===(f=this._options)||void 0===f?void 0:f.center)for(b=1;b<=this._options.count;b++)C=Math.floor(x.data.length/this._options.count)*b,P=x.data[C],O=$=y/this._options.count*b,S=(M=g/2)-P,m.line($,M,O,S,this._options),(null===(_=this._options)||void 0===_?void 0:_.mirroredY)&&(O=$=y/this._options.count*b,S=(M=g/2)+P,m.line($,M,O,S,this._options))},t}();o.Lines=a},817:function(t,o,i){var e=this&&this.__assign||function(){return e=Object.assign||function(t){for(var o,i=1,e=arguments.length;i<e;i++)for(var n in o=arguments[i])Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n]);return t},e.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Shine=void 0;var n=i(426),r=i(941),a=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i,a=o.canvas,s=a.height,h=a.width,c=new n.Shapes(o),u=new r.AudioData(t);this._options=e({count:30,rotate:0,diameter:s/3,frequencyBand:"mids"},this._options);var l=h/2,p=s/2,d=360/this._options.count;this._options.frequencyBand&&u.setFrequencyBand(this._options.frequencyBand),u.scaleData(Math.min(h,s));for(var f=0;f<this._options.count;f++){var _=Math.floor(u.data.length/this._options.count)*f,v=u.data[_],g=c.toRadians(d*f+this._options.rotate),y=(null===(i=this._options)||void 0===i?void 0:i.offset)?this._options.diameter-v/2:this._options.diameter,m=this._options.diameter+v,x=y/2*Math.cos(g)+l,w=y/2*Math.sin(g)+p,b=m/2*Math.cos(g)+l,C=m/2*Math.sin(g)+p;c.line(x,w,b,C,this._options)}},t}();o.Shine=a},123:function(t,o,i){var e=this&&this.__assign||function(){return e=Object.assign||function(t){for(var o,i=1,e=arguments.length;i<e;i++)for(var n in o=arguments[i])Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n]);return t},e.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Square=void 0;var n=i(426),r=i(941),a=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,a=i.height,s=i.width,h=new n.Shapes(o),c=new r.AudioData(t);this._options=e({count:40,diameter:a/3,frequencyBand:"mids"},this._options);var u=this._options.count/4,l=s/2,p=a/2;this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(s,a));for(var d=0;d<u;d++){var f=Math.floor(c.data.length/this._options.count)*d,_=c.data[f],v=this._options.diameter/u,g=l-this._options.diameter/2+v*d,y=p-this._options.diameter/2;h.line(g,y,g,y-_,this._options)}for(d=0;d<u;d++){f=Math.floor(c.data.length/this._options.count)*(2*d),_=c.data[f];var m=this._options.diameter/u;g=l+this._options.diameter/2,y=p-this._options.diameter/2+m*d,h.line(g,y,g+_,y,this._options)}for(d=0;d<u;d++)f=Math.floor(c.data.length/this._options.count)*(3*d),_=c.data[f],v=this._options.diameter/u,g=l-this._options.diameter/2+v*d,y=p+this._options.diameter/2,h.line(g,y,g,y+_,this._options);for(d=0;d<u;d++)f=Math.floor(c.data.length/this._options.count)*(4*d),_=c.data[f],m=this._options.diameter/u,g=l-this._options.diameter/2,y=p-this._options.diameter/2+m*d,h.line(g,y,g-_,y,this._options)},t}();o.Square=a},270:function(t,o,i){var e=this&&this.__assign||function(){return e=Object.assign||function(t){for(var o,i=1,e=arguments.length;i<e;i++)for(var n in o=arguments[i])Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n]);return t},e.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Turntable=void 0;var n=i(426),r=i(941),a=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,a=i.height,s=i.width,h=new n.Shapes(o),c=new r.AudioData(t);this._options=e({count:20,rotate:0,diameter:a/3,cubeHeight:20,frequencyBand:"mids",gap:5},this._options);var u=s/2,l=a/2,p=360/this._options.count;this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(s,a));for(var d=0;d<this._options.count;d++)for(var f=Math.floor(c.data.length/this._options.count)*d,_=c.data[f],v=0;v<_/this._options.cubeHeight;v++){var g=this._options.diameter+this._options.cubeHeight*v+this._options.gap,y=this._options.diameter+this._options.cubeHeight*(v+1),m=h.toRadians(p*d+this._options.rotate+this._options.gap/4),x=h.toRadians(p*(d+1)+this._options.rotate),w=g/2*Math.cos(m)+u,b=g/2*Math.sin(m)+l,C=g/2*Math.cos(x)+u,P=g/2*Math.sin(x)+l,M=y/2*Math.cos(m)+u,O=y/2*Math.sin(m)+l,S=y/2*Math.cos(x)+u,$=y/2*Math.sin(x)+l;h.polygon([{x:w,y:b},{x:M,y:O},{x:S,y:$},{x:C,y:P}],this._options)}},t}();o.Turntable=a},857:function(t,o,i){var e=this&&this.__assign||function(){return e=Object.assign||function(t){for(var o,i=1,e=arguments.length;i<e;i++)for(var n in o=arguments[i])Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n]);return t},e.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Wave=void 0;var n=i(426),r=i(941),a=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,a=i.height,s=i.width,h=new r.AudioData(t),c=new n.Shapes(o);if(this._options=e({count:64,frequencyBand:"mids"},this._options),this._options.frequencyBand&&h.setFrequencyBand(this._options.frequencyBand),h.scaleData(Math.min(s,a)),this._options.mirroredX)for(var u=1,l=Math.ceil(h.data.length/2);l<h.data.length;l++)h.data[l]=h.data[Math.ceil(h.data.length/2)-u],u++;if(this._options.top){var p=[{x:0,y:0}];for(l=0;l<=this._options.count;l++){var d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d];p.push({x:Math.floor(s/this._options.count)*l,y:f})}p.push({x:s,y:0}),c.polygon(p,this._options)}if(this._options.right){for(p=[{x:s,y:0}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d],p.push({x:s-f,y:Math.floor(s/this._options.count)*l});p.push({x:s,y:a}),c.polygon(p,this._options)}if(this._options.bottom||!this._options.top&&!this._options.right&&!this._options.left&&!this._options.center){for(p=[{x:0,y:a}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d],p.push({x:Math.floor(s/this._options.count)*l,y:a-f});p.push({x:s,y:a}),c.polygon(p,this._options)}if(this._options.left){for(p=[{x:0,y:0}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d],p.push({x:f,y:Math.floor(s/this._options.count)*l});p.push({x:0,y:a}),c.polygon(p,this._options)}if(this._options.center){for(p=[{x:0,y:a/2}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d],p.push({x:Math.floor(s/this._options.count)*l,y:a/2-f});if(p.push({x:s,y:a/2}),c.polygon(p,this._options),this._options.mirroredY){for(p=[{x:0,y:a/2}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d],p.push({x:Math.floor(s/this._options.count)*l,y:a/2+f});p.push({x:s,y:a/2}),c.polygon(p,this._options)}}},t}();o.Wave=a},941:(t,o)=>{Object.defineProperty(o,"__esModule",{value:!0}),o.AudioData=void 0;var i=function(){function t(t){this.data=t}return t.prototype.setFrequencyBand=function(t){var o=Math.floor(.0625*this.data.length),i=Math.floor(.0625*this.data.length),e=Math.floor(.375*this.data.length),n={base:this.data.slice(0,o),lows:this.data.slice(o+1,o+i),mids:this.data.slice(o+i+1,o+i+e),highs:this.data.slice(o+i+e+1)};this.data=n[t]},t.prototype.scaleData=function(t){t<255&&(this.data=this.data.map((function(o){var i=Math.round(o/255*100)/100;return t*i})))},t}();o.AudioData=i},426:function(t,o){var i=this&&this.__awaiter||function(t,o,i,e){return new(i||(i=Promise))((function(n,r){function a(t){try{h(e.next(t))}catch(t){r(t)}}function s(t){try{h(e.throw(t))}catch(t){r(t)}}function h(t){var o;t.done?n(t.value):(o=t.value,o instanceof i?o:new i((function(t){t(o)}))).then(a,s)}h((e=e.apply(t,o||[])).next())}))},e=this&&this.__generator||function(t,o){var i,e,n,r,a={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return r={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(r[Symbol.iterator]=function(){return this}),r;function s(r){return function(s){return function(r){if(i)throw new TypeError("Generator is already executing.");for(;a;)try{if(i=1,e&&(n=2&r[0]?e.return:r[0]?e.throw||((n=e.return)&&n.call(e),0):e.next)&&!(n=n.call(e,r[1])).done)return n;switch(e=0,n&&(r=[2&r[0],n.value]),r[0]){case 0:case 1:n=r;break;case 4:return a.label++,{value:r[1],done:!1};case 5:a.label++,e=r[1],r=[0];continue;case 7:r=a.ops.pop(),a.trys.pop();continue;default:if(!((n=(n=a.trys).length>0&&n[n.length-1])||6!==r[0]&&2!==r[0])){a=0;continue}if(3===r[0]&&(!n||r[1]>n[0]&&r[1]<n[3])){a.label=r[1];break}if(6===r[0]&&a.label<n[1]){a.label=n[1],n=r;break}if(n&&a.label<n[2]){a.label=n[2],a.ops.push(r);break}n[2]&&a.ops.pop(),a.trys.pop();continue}r=o.call(t,a)}catch(t){r=[6,t],e=0}finally{i=n=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}([r,s])}}};Object.defineProperty(o,"__esModule",{value:!0}),o.Shapes=void 0;var n=function(){function t(t){this._canvasContext=t}return t.prototype.toRadians=function(t){return t*Math.PI/180},t.prototype.toDegrees=function(t){return 180*t/Math.PI},t.prototype._rotatePoint=function(t,o,i,e,n){var r=this.toRadians(n);return{x:Math.cos(r)*(i-t)-Math.sin(r)*(e-o)+t,y:Math.sin(r)*(i-t)+Math.cos(r)*(e-o)+o}},t.prototype._makeGradient=function(t,o){var i=0,e=this._canvasContext.canvas.height/2,n=this._canvasContext.canvas.width,r=this._canvasContext.canvas.height/2;if(o){var a=this._canvasContext.canvas.width/2,s=this._canvasContext.canvas.height/2,h=this._rotatePoint(a,s,i,e,o);i=h.x,e=h.y;var c=this._rotatePoint(a,s,n,r,o);n=c.x,r=c.y}var u=this._canvasContext.createLinearGradient(i,e,n,r);return t.forEach((function(o,i){u.addColorStop(1/t.length*i,o)})),u},t.prototype._makeImage=function(t){return i(this,void 0,void 0,(function(){var o,i=this;return e(this,(function(e){return(o=new Image).src=t,[2,new Promise((function(t,e){o.onload=function(){var e=i._canvasContext.createPattern(o,"repeat");t(e)}}))]}))}))},t.prototype._implementOptions=function(t,o){var i,e,n,r,a,s,h,c,u,l,p,d,f=this;void 0===o&&(o=!0),"string"==typeof(null==t?void 0:t.lineColor)?this._canvasContext.strokeStyle=t.lineColor:(null===(i=null==t?void 0:t.lineColor)||void 0===i?void 0:i.gradient)?this._canvasContext.strokeStyle=this._makeGradient(t.lineColor.gradient,t.lineColor.rotate):(null===(e=null==t?void 0:t.lineColor)||void 0===e?void 0:e.image)?this._makeImage(null===(n=null==t?void 0:t.lineColor)||void 0===n?void 0:n.image).then((function(t){return f._canvasContext.strokeStyle=t})):this._canvasContext.strokeStyle="#000","string"==typeof(null==t?void 0:t.fillColor)?this._canvasContext.fillStyle=t.fillColor:(null===(r=null==t?void 0:t.fillColor)||void 0===r?void 0:r.gradient)?this._canvasContext.fillStyle=this._makeGradient(t.fillColor.gradient,t.fillColor.rotate):(null===(a=null==t?void 0:t.fillColor)||void 0===a?void 0:a.image)?this._makeImage(null===(s=null==t?void 0:t.fillColor)||void 0===s?void 0:s.image).then((function(t){return f._canvasContext.fillStyle=t})):this._canvasContext.fillStyle="#000",this._canvasContext.lineCap=null!==(h=(null==t?void 0:t.rounded)?"round":"butt")&&void 0!==h?h:"butt",this._canvasContext.lineWidth=null!==(c=null==t?void 0:t.lineWidth)&&void 0!==c?c:1,this._canvasContext.shadowColor=null!==(l=null===(u=null==t?void 0:t.glow)||void 0===u?void 0:u.color)&&void 0!==l?l:"rgba(0,0,0,0)",this._canvasContext.shadowBlur=null!==(d=null===(p=null==t?void 0:t.glow)||void 0===p?void 0:p.strength)&&void 0!==d?d:0,this._canvasContext.shadowOffsetX=0,this._canvasContext.shadowOffsetY=0,o&&this._canvasContext.closePath(),this._canvasContext.stroke(),o&&this._canvasContext.fill()},t.prototype.arc=function(t,o,i,e,n,r){return this._canvasContext.beginPath(),this._canvasContext.arc(t,o,i/2,this.toRadians(e),this.toRadians(n)),this._implementOptions(r,!1),this},t.prototype.circle=function(t,o,i,e){return this._canvasContext.beginPath(),this._canvasContext.arc(t,o,i/2,0,2*Math.PI),this._implementOptions(e),this},t.prototype.line=function(t,o,i,e,n){return this._canvasContext.beginPath(),this._canvasContext.moveTo(t,o),this._canvasContext.lineTo(i,e),this._implementOptions(n),this},t.prototype.polygon=function(t,o){var i;this._canvasContext.beginPath(),this._canvasContext.moveTo(t[0].x,t[0].y);for(var e=0;e<t.length;e++){var n=t[e],r=null!==(i=t[e+1])&&void 0!==i?i:n,a=(n.x+r.x)/2,s=(n.y+r.y)/2;(null==o?void 0:o.rounded)?this._canvasContext.quadraticCurveTo(t[e].x,t[e].y,a,s):this._canvasContext.lineTo(t[e].x,t[e].y)}return this._implementOptions(o),this},t.prototype.rectangle=function(t,o,i,e,n){var r,a=null!==(r=null==n?void 0:n.radius)&&void 0!==r?r:0;return i<2*a&&(a=i/2),e<2*a&&(a=e/2),this._canvasContext.beginPath(),this._canvasContext.moveTo(t+a,o),this._canvasContext.arcTo(t+i,o,t+i,o+e,a),this._canvasContext.arcTo(t+i,o+e,t,o+e,a),this._canvasContext.arcTo(t,o+e,t,o,a),this._canvasContext.arcTo(t,o,t+i,o,a),this._implementOptions(n),this},t}();o.Shapes=n}},o={};function i(e){var n=o[e];if(void 0!==n)return n.exports;var r=o[e]={exports:{}};return t[e].call(r.exports,r,r.exports,i),r.exports}var e={};return(()=>{var t=e;Object.defineProperty(t,"__esModule",{value:!0}),t.Wave=void 0;var o=i(935),n=i(519),r=i(938),a=i(540),s=i(522),h=i(658),c=i(817),u=i(123),l=i(270),p=i(857),d=function(){function t(t,i,e){void 0===e&&(e=!1);var d=this;this.animations={Arcs:o.Arcs,Circles:n.Circles,Cubes:r.Cubes,Flower:a.Flower,Glob:s.Glob,Lines:h.Lines,Shine:c.Shine,Square:u.Square,Turntable:l.Turntable,Wave:p.Wave},this._activeAnimations=[],this._canvasElement=i,this._canvasContext=this._canvasElement.getContext("2d"),this._muteAudio=e,this._interacted=!1,t instanceof HTMLAudioElement?(this._audioElement=t,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)?["touchstart","touchmove","touchend","mouseup","click"].forEach((function(t){document.body.addEventListener(t,(function(){return d.connectAnalyser()}),{once:!0})})):this._audioElement.addEventListener("play",(function(){return d.connectAnalyser()}),{once:!0})):t instanceof AnalyserNode?(this._audioAnalyser=t,this._audioContext=null,this._audioSource=null,this._play()):t&&(this._audioContext=t.context,this._audioSource=t.source,this._audioAnalyser=this._audioContext.createAnalyser(),this._play())}return t.prototype.connectAnalyser=function(){this._interacted||(this._interacted=!0,this._audioContext=new AudioContext,this._audioSource=this._audioContext.createMediaElementSource(this._audioElement),this._audioAnalyser=this._audioContext.createAnalyser(),this._play())},t.prototype._play=function(){var t=this;this._audioSource&&(this._audioSource.connect(this._audioAnalyser),this._muteAudio||this._audioSource.connect(this._audioContext.destination)),this._audioAnalyser.smoothingTimeConstant=.85,this._audioAnalyser.fftSize=1024;var o=new Uint8Array(this._audioAnalyser.frequencyBinCount),i=function(){t._audioAnalyser.getByteFrequencyData(o),t._canvasContext.clearRect(0,0,t._canvasContext.canvas.width,t._canvasContext.canvas.height),t._activeAnimations.forEach((function(i){i.draw(o,t._canvasContext)})),window.requestAnimationFrame(i)};i()},t.prototype.addAnimation=function(t){this._activeAnimations.push(t)},t.prototype.clearAnimations=function(){this._activeAnimations=[]},t}();t.Wave=d})(),e})(),t.exports=e()}}]);
//# sourceMappingURL=8c7f5da.js.map