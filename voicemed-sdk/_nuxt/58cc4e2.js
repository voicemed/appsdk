(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{927:function(t,o,n){"use strict";n(4),n(7),n(8),n(5),n(9);var i=n(26),e=(n(0),n(28),n(62),n(63),n(27),n(3),n(37),n(46));function s(t,o){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);o&&(i=i.filter((function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable}))),n.push.apply(n,i)}return n}function r(t){for(var o=1;o<arguments.length;o++){var n=null!=arguments[o]?arguments[o]:{};o%2?s(Object(n),!0).forEach((function(o){Object(i.a)(t,o,n[o])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(n,o))}))}return t}o.a={name:"basePage",transition:{name:"slide",mode:"out-in",css:!1,beforeEnter:function(t){if(!document.querySelector("#__nuxt").classList.contains("quit")){var o=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime.set(t,{scale:1,opacity:0,translateX:o})}},enter:function(t,o){var n=document.querySelector("#__nuxt").classList.contains("back")?"-100%":"100%";this.$anime({targets:t,opacity:[0,1],translateX:[n,"0"],duration:500,easing:"easeInOutSine",complete:o})},leave:function(t,o){if(document.querySelector("#__nuxt").classList.contains("quit"))this.$anime({targets:t,translateY:[0,"100%"],duration:500,easing:"easeInOutSine",complete:o});else{var n=document.querySelector("#__nuxt").classList.contains("back")?"100%":"-100%";this.$anime({targets:t,opacity:[1,0],translateX:["0",n],duration:500,easing:"easeInOutSine",complete:o})}},afterLeave:function(t){document.querySelector("#__nuxt").classList.remove("quit"),document.querySelector("#__nuxt").classList.remove("back")}},data:function(){return{name:"basePage",exid:this.$route.params.id,programid:this.$route.params.fromprogram||!1,withindex:this.$route.params.withindex||-1,backto:this.$route.params.backto||!1,hasBack:!1,hasNext:!1,hasInfo:!1}},computed:r(r({},Object(e.d)({getCurrentPagerHeight:"getCurrentPagerHeight"})),{},{isVoicemed:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")>-1},isAirlyn:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")<0},nuxtloading:function(){return $nuxt.$loading.loading},defaultHomeUrl:function(){return"/"}}),methods:r(r({},Object(e.c)({setCurrentPage:"setCurrentPage",setCurrentPagerHeight:"setCurrentPagerHeight"})),{},{exerciseStepBack:function(){if(console.log("exit test",this.backto,this.programid),"standalone"==this.backto||"challengemode"==this.backto)return $nuxt.$airlyn.finishExercise({reason:"user-cancelled",result:{}}).finally((function(){console.log("exercise finished by user")})),void $nuxt.$airlyn.closeExercise().finally((function(){console.log("exercise closed, success")}));"today"!=this.backto?"discovery"!=this.backto?this.programid?"-1"==this.programid||-1==this.programid||"false"==this.programid||0==this.programid?$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/ml/programs/"+this.programid)):$nuxt.$router.replace($nuxt.localePath("/user/today")):$nuxt.$router.replace($nuxt.localePath("/home")):$nuxt.$router.replace($nuxt.localePath("/user/today"))},buildSuffix:function(){var t=[],o=!!this.programid&&this.programid;return t.push("-1"!==o&&o),t.push(this.withindex?this.withindex:"-1"),t.push(!!this.backto&&this.backto),t.join("/")},hasJoinedProgramById:function(t){return this.$nuxt.$store.getters.hasJoinedProgramById(t)},getProgramJoinedAtById:function(t){return this.$nuxt.$store.getters.getProgramJoinedAtById(t)},getProgramById:function(t){return this.$nuxt.$store.getters.getProgramById(t)},getOverallProgressProgramById:function(t){return this.$nuxt.$store.getters.getOverallProgressProgramById(t)},getDoneCountByProgramId:function(t){return this.$nuxt.$store.getters.getDoneCountByProgramId(t)},getNextExerciseByProgramId:function(t){return this.$nuxt.$store.getters.getNextExerciseByProgramId(t)},getExercisetocompleteCountProgramById:function(t){return this.$nuxt.$store.getters.getExercisetocompleteCountProgramById(t)},getExercisecompletedCountProgramById:function(t){return this.$nuxt.$store.getters.getExercisecompletedCountProgramById(t)},printDeviceError:function(t,o,n,i){this.$analytics.logEvent("permission_error",{title:"errors."+t+"."+o.name.toLowerCase()+".title",kind:t}),console.error("Got device error",o),!o||"NotAllowedError"!==o.name&&"NotFoundError"!==o.name&&"denied"!=o.exception.state&&"DENIED"!=o.exception.state?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),n,i):this.$root.$emit("showPermssionError",!0)},printDeviceErrorOLD:function(t,o,n,i){if(this.$analytics.logEvent("permission_error",{title:"errors."+t+"."+o.name.toLowerCase()+".title",kind:t}),console.error("Got device error",o),o.exception&&"mic"==t&&("denied"==o.exception.state||"DENIED"==o.exception.state))return o.name="DeniedError",void this.$root.$emit("showError",{title:this.$t("errors."+t+"."+o.name.toLowerCase()+".title"),error:this.$t("errors."+t+"."+o.name.toLowerCase()+".description"),hasretry:!0,click:function(){return $nuxt.$airlyn.openPermissionPanel().then((function(t){console.log("got openPermission Panel then",t,JSON.stringify(t))})).catch((function(t){console.log("got openPermission Panel catch",t,JSON.stringify(t))})).finally((function(){"function"==typeof i&&(console.log("dopo il setting riport cmq a inizio"),i())})),!0},resetEvent:i||function(){},retryBtn:"Settings"});!o||"NotAllowedError"!==o.name&&"NotFoundError"!==o.name?this.showError(this.$t("errors.generic.title"),this.$t("errors.generic.description"),n,i):this.showError(this.$t("errors."+t+"."+o.name.toLowerCase()+".title"),this.$t("errors."+t+"."+o.name.toLowerCase()+".description"),n,i)},manageMicError:function(t,o,n){this.printDeviceError("mic",t,o,n)},manageCamError:function(t,o,n){this.printDeviceError("cam",t,o,n)},manageMicCamError:function(t,o,n){this.printDeviceError("miccam",t,o,n)},showError:function(t,o,n,i){this.$root.$emit("showError",{title:t,error:o,hasretry:null!==n,click:n||function(){},resetEvent:i||function(){}})},swipeEvent:function(t){this.$root.$emit("swipe",t)},attachSwipeListener:function(){document.addEventListener("swiped-left",this.swipeEvent),document.addEventListener("swiped-right",this.swipeEvent)},detachSwipeListeners:function(){document.removeEventListener("swiped-left",this.swipeEvent),document.removeEventListener("swiped-right",this.swipeEvent)},fixWindowVariables:function(t){void 0===window[t]&&"undefined"!==window.top[t]&&(window[t]=window.top[t])}}),beforeMount:function(){var t=this;console.log("PRE loaded base Page"),console.log("fix loading variables"),["currentChallenge","currentExercise","currentVMToken","currentVMKey","currentVMUrl"].forEach((function(o){t.fixWindowVariables(o)})),this.setCurrentPage(this)},beforeDestroy:function(){this.detachSwipeListeners()},mounted:function(){var t=this;console.log("loaded base Page"),console.log("try Load index",this.name,this.dynamicTexts),this.dynamicTexts&&Object.keys(this.dynamicTexts).length>0&&Object.keys(this.dynamicTexts).map((function(o){t.$appConfiguration.getText(o).then((function(n){t.dynamicTexts[o]=n})).catch((function(n){t.dynamicTexts[o]=t.$t(t.name+"."+o)}))})),null!==this.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager")&&(document.querySelector(".v-main__wrap > div.pager").style.height=this.getCurrentPagerHeight+"px"),this.$nextTick((function(){t.attachSwipeListener(),null===t.getCurrentPagerHeight&&document.querySelector(".v-main__wrap > div.pager")&&t.setCurrentPagerHeight(Math.max(document.querySelector(".v-main__wrap > div.pager").clientHeight,document.querySelector(".v-main__wrap > div.pager").offsetHeight))}))}}},929:function(t,o,n){"use strict";n(3),n(4),n(7),n(0),n(8),n(5),n(9);var i=n(26),e=n(927),s=n(46);function r(t,o){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);o&&(i=i.filter((function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable}))),n.push.apply(n,i)}return n}function a(t){for(var o=1;o<arguments.length;o++){var n=null!=arguments[o]?arguments[o]:{};o%2?r(Object(n),!0).forEach((function(o){Object(i.a)(t,o,n[o])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(n,o))}))}return t}o.a={name:"expage",mixins:[e.a],computed:a(a({},Object(s.d)({getExercises:"getExercises",getCurrentExercise:"getCurrentExercise"})),{},{exercise:function(){return this.getCurrentExercise}}),mounted:function(){console.log("monti pagina interna ex",this.getExercises,this.getCurrentExercise),this.getExercises||console.warn("Cannot retrieve exercise list in page"),0===this.getExercises.length&&console.error("Cannot retrieve exercise list in page")}}},935:function(t,o,n){var i;i=()=>(()=>{"use strict";var t={935:function(t,o,n){var i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var o,n=1,i=arguments.length;n<i;n++)for(var e in o=arguments[n])Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e]);return t},i.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Arcs=void 0;var e=n(426),s=n(941),r=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var n=o.canvas,r=n.height,a=n.width,h=new e.Shapes(o),c=new s.AudioData(t),u=r/2,l=a/2;this._options=i({count:30,diameter:r/3,lineWidth:3,frequencyBand:"mids",rounded:!0},this._options),this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(a,r));for(var p=0;p<=this._options.count/2;p++){var d=Math.floor(c.data.length/this._options.count)*p,f=c.data[d],_=(a-this._options.diameter)/this._options.count*p,v=180-45/(255/f/2),g=180+45/(255/f/2),y=2*f;h.arc(_+y/2,u,y,v,g,this._options)}var m=Math.floor(c.data.length/2),x=c.data[m];for(h.circle(l,u,this._options.diameter*(x/255),this._options),p=this._options.count/2;p<=this._options.count;p++){var b=Math.floor(c.data.length/this._options.count)*p,w=c.data[b];_=(a-this._options.diameter)/this._options.count*p+this._options.diameter,v=180-45/(255/w/2),g=180+45/(255/w/2),y=2*w,h.arc(_-y/2,u,y,v+180,g+180,this._options)}},t}();o.Arcs=r},519:function(t,o,n){var i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var o,n=1,i=arguments.length;n<i;n++)for(var e in o=arguments[n])Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e]);return t},i.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Circles=void 0;var e=n(426),s=n(941),r=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var n=o.canvas,r=n.height,a=n.width,h=new e.Shapes(o),c=new s.AudioData(t),u=a/2,l=r/2;this._options=i({count:40,diameter:0,fillColor:"rgba(0,0,0,0)",frequencyBand:"mids"},this._options),this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(a,r));for(var p=0;p<this._options.count;p++){var d=Math.floor(c.data.length/this._options.count)*p,f=c.data[d];h.circle(u,l,this._options.diameter+f,this._options)}},t}();o.Circles=r},938:function(t,o,n){var i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var o,n=1,i=arguments.length;n<i;n++)for(var e in o=arguments[n])Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e]);return t},i.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Cubes=void 0;var e=n(426),s=n(941),r=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var n,r,a,h,c,u,l,p,d,f,_,v,g=o.canvas,y=g.height,m=g.width,x=new e.Shapes(o),b=new s.AudioData(t);this._options=i({count:20,frequencyBand:"mids",gap:5},this._options);var w=Math.floor((m-this._options.gap*this._options.count)/this._options.count);if((null===(n=this._options)||void 0===n?void 0:n.cubeHeight)||(this._options.cubeHeight=w),this._options.frequencyBand&&b.setFrequencyBand(this._options.frequencyBand),b.scaleData(Math.min(m,y)),null===(r=this._options)||void 0===r?void 0:r.mirroredX)for(var C=1,M=Math.ceil(b.data.length/2);M<b.data.length;M++)b.data[M]=b.data[Math.ceil(b.data.length/2)-C],C++;if(null===(a=this._options)||void 0===a?void 0:a.top)for(M=0;M<this._options.count;M++)for(var O=Math.floor(b.data.length/this._options.count)*M,P=b.data[O],E=(this._options.gap+w)*M,$=Math.ceil(P/w),S=0;S<$;S++){var q=S*(this._options.cubeHeight+this._options.gap);x.rectangle(E,q,w,this._options.cubeHeight,this._options)}if(null===(h=this._options)||void 0===h?void 0:h.right)for(M=0;M<this._options.count;M++)for(O=Math.floor(b.data.length/this._options.count)*M,P=b.data[O],q=M*(this._options.cubeHeight+this._options.gap),$=Math.ceil(P/w),S=0;S<$;S++)E=m-(this._options.gap+w)*S,x.rectangle(E,q,w,this._options.cubeHeight,this._options);if((null===(c=this._options)||void 0===c?void 0:c.bottom)||!(null===(u=this._options)||void 0===u?void 0:u.top)&&!(null===(l=this._options)||void 0===l?void 0:l.right)&&!(null===(p=this._options)||void 0===p?void 0:p.left)&&!(null===(d=this._options)||void 0===d?void 0:d.center))for(M=0;M<this._options.count;M++)for(O=Math.floor(b.data.length/this._options.count)*M,P=b.data[O],E=(this._options.gap+w)*M,$=Math.ceil(P/w),S=0;S<$;S++)q=y-S*(this._options.cubeHeight+this._options.gap),x.rectangle(E,q,w,this._options.cubeHeight,this._options);if(null===(f=this._options)||void 0===f?void 0:f.left)for(M=0;M<this._options.count;M++)for(O=Math.floor(b.data.length/this._options.count)*M,P=b.data[O],q=M*(this._options.cubeHeight+this._options.gap),$=Math.ceil(P/w),S=0;S<$;S++)E=(this._options.gap+w)*S,x.rectangle(E,q,w,this._options.cubeHeight,this._options);if(null===(_=this._options)||void 0===_?void 0:_.center){for(M=0;M<this._options.count;M++)for(O=Math.floor(b.data.length/this._options.count)*M,P=b.data[O],E=(this._options.gap+w)*M,$=Math.ceil(P/w),S=0;S<$;S++)q=y/2-S*(this._options.cubeHeight+this._options.gap),x.rectangle(E,q,w,this._options.cubeHeight,this._options);if(null===(v=this._options)||void 0===v?void 0:v.mirroredY)for(M=0;M<this._options.count;M++)for(O=Math.floor(b.data.length/this._options.count)*M,P=b.data[O],E=(this._options.gap+w)*M,$=Math.ceil(P/w),S=0;S<$;S++)q=y/2+S*(this._options.cubeHeight+this._options.gap),x.rectangle(E,q,w,this._options.cubeHeight,this._options)}},t}();o.Cubes=r},540:function(t,o,n){var i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var o,n=1,i=arguments.length;n<i;n++)for(var e in o=arguments[n])Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e]);return t},i.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Flower=void 0;var e=n(426),s=n(941),r=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var n=o.canvas,r=n.height,a=n.width,h=new e.Shapes(o),c=new s.AudioData(t);this._options=i({count:20,diameter:r/3,frequencyBand:"mids",rotate:0},this._options);var u=a/2,l=r/2,p=360/this._options.count;this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(a,r));for(var d=0;d<this._options.count;d++){var f=Math.floor(c.data.length/this._options.count)*d,_=c.data[f],v=h.toRadians(p*d+this._options.rotate),g=h.toRadians(p*(d+1)+this._options.rotate),y=this._options.diameter/2*Math.cos(v)+u,m=this._options.diameter/2*Math.sin(v)+l,x=this._options.diameter/2*Math.cos(g)+u,b=this._options.diameter/2*Math.sin(g)+l,w=this._options.diameter+_,C=w/2*Math.cos(v)+u,M=w/2*Math.sin(v)+l,O=w/2*Math.cos(g)+u,P=w/2*Math.sin(g)+l;h.polygon([{x:y,y:m},{x:C,y:M},{x:O,y:P},{x:x,y:b}],this._options)}},t}();o.Flower=r},522:function(t,o,n){var i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var o,n=1,i=arguments.length;n<i;n++)for(var e in o=arguments[n])Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e]);return t},i.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Glob=void 0;var e=n(426),s=n(941),r=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var n,r=o.canvas,a=r.height,h=r.width,c=new e.Shapes(o),u=new s.AudioData(t),l=h/2,p=a/2;if(this._options=i({count:100,diameter:a/3,frequencyBand:"mids",rounded:!0},this._options),this._options.frequencyBand&&u.setFrequencyBand(this._options.frequencyBand),u.scaleData(Math.min(h,a)),null===(n=this._options)||void 0===n?void 0:n.mirroredX)for(var d=1,f=Math.ceil(u.data.length/2);f<u.data.length;f++)u.data[f]=u.data[Math.ceil(u.data.length/2)-d],d++;var _=[];for(f=0;f<this._options.count;f++){var v=Math.floor(u.data.length/this._options.count)*f,g=u.data[v],y=360/this._options.count,m=this._options.diameter+g,x=l+m/2*Math.cos(c.toRadians(y*f)),b=p+m/2*Math.sin(c.toRadians(y*f));_.push({x:x,y:b})}_.push(_[0]),c.polygon(_,this._options)},t}();o.Glob=r},658:function(t,o,n){var i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var o,n=1,i=arguments.length;n<i;n++)for(var e in o=arguments[n])Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e]);return t},i.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Lines=void 0;var e=n(426),s=n(941),r=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var n,r,a,h,c,u,l,p,d,f,_,v=o.canvas,g=v.height,y=v.width,m=new e.Shapes(o),x=new s.AudioData(t);if(this._options=i({count:64,frequencyBand:"mids"},this._options),this._options.frequencyBand&&x.setFrequencyBand(this._options.frequencyBand),x.scaleData(Math.min(y,g)),null===(n=this._options)||void 0===n?void 0:n.mirroredX)for(var b=1,w=Math.ceil(x.data.length/2);w<x.data.length;w++)x.data[w]=x.data[Math.ceil(x.data.length/2)-b],b++;if(null===(r=this._options)||void 0===r?void 0:r.top)for(w=1;w<=this._options.count;w++){var C=Math.floor(x.data.length/this._options.count)*w,M=x.data[C],O=0,P=$=y/this._options.count*w,E=M;m.line($,O,P,E,this._options)}if(null===(a=this._options)||void 0===a?void 0:a.right)for(w=1;w<=this._options.count;w++){C=Math.floor(x.data.length/this._options.count)*w;var $=y;P=y-(M=x.data[C]),E=O=g/this._options.count*w,m.line($,O,P,E,this._options)}if((null===(h=this._options)||void 0===h?void 0:h.bottom)||!(null===(c=this._options)||void 0===c?void 0:c.top)&&!(null===(u=this._options)||void 0===u?void 0:u.right)&&!(null===(l=this._options)||void 0===l?void 0:l.left)&&!(null===(p=this._options)||void 0===p?void 0:p.center))for(w=1;w<=this._options.count;w++)C=Math.floor(x.data.length/this._options.count)*w,M=x.data[C],P=$=y/this._options.count*w,E=(O=g)-M,m.line($,O,P,E,this._options);if(null===(d=this._options)||void 0===d?void 0:d.left)for(w=1;w<=this._options.count;w++)C=Math.floor(x.data.length/this._options.count)*w,$=0,P=M=x.data[C],E=O=g/this._options.count*w,m.line($,O,P,E,this._options);if(null===(f=this._options)||void 0===f?void 0:f.center)for(w=1;w<=this._options.count;w++)C=Math.floor(x.data.length/this._options.count)*w,M=x.data[C],P=$=y/this._options.count*w,E=(O=g/2)-M,m.line($,O,P,E,this._options),(null===(_=this._options)||void 0===_?void 0:_.mirroredY)&&(P=$=y/this._options.count*w,E=(O=g/2)+M,m.line($,O,P,E,this._options))},t}();o.Lines=r},817:function(t,o,n){var i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var o,n=1,i=arguments.length;n<i;n++)for(var e in o=arguments[n])Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e]);return t},i.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Shine=void 0;var e=n(426),s=n(941),r=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var n,r=o.canvas,a=r.height,h=r.width,c=new e.Shapes(o),u=new s.AudioData(t);this._options=i({count:30,rotate:0,diameter:a/3,frequencyBand:"mids"},this._options);var l=h/2,p=a/2,d=360/this._options.count;this._options.frequencyBand&&u.setFrequencyBand(this._options.frequencyBand),u.scaleData(Math.min(h,a));for(var f=0;f<this._options.count;f++){var _=Math.floor(u.data.length/this._options.count)*f,v=u.data[_],g=c.toRadians(d*f+this._options.rotate),y=(null===(n=this._options)||void 0===n?void 0:n.offset)?this._options.diameter-v/2:this._options.diameter,m=this._options.diameter+v,x=y/2*Math.cos(g)+l,b=y/2*Math.sin(g)+p,w=m/2*Math.cos(g)+l,C=m/2*Math.sin(g)+p;c.line(x,b,w,C,this._options)}},t}();o.Shine=r},123:function(t,o,n){var i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var o,n=1,i=arguments.length;n<i;n++)for(var e in o=arguments[n])Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e]);return t},i.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Square=void 0;var e=n(426),s=n(941),r=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var n=o.canvas,r=n.height,a=n.width,h=new e.Shapes(o),c=new s.AudioData(t);this._options=i({count:40,diameter:r/3,frequencyBand:"mids"},this._options);var u=this._options.count/4,l=a/2,p=r/2;this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(a,r));for(var d=0;d<u;d++){var f=Math.floor(c.data.length/this._options.count)*d,_=c.data[f],v=this._options.diameter/u,g=l-this._options.diameter/2+v*d,y=p-this._options.diameter/2;h.line(g,y,g,y-_,this._options)}for(d=0;d<u;d++){f=Math.floor(c.data.length/this._options.count)*(2*d),_=c.data[f];var m=this._options.diameter/u;g=l+this._options.diameter/2,y=p-this._options.diameter/2+m*d,h.line(g,y,g+_,y,this._options)}for(d=0;d<u;d++)f=Math.floor(c.data.length/this._options.count)*(3*d),_=c.data[f],v=this._options.diameter/u,g=l-this._options.diameter/2+v*d,y=p+this._options.diameter/2,h.line(g,y,g,y+_,this._options);for(d=0;d<u;d++)f=Math.floor(c.data.length/this._options.count)*(4*d),_=c.data[f],m=this._options.diameter/u,g=l-this._options.diameter/2,y=p-this._options.diameter/2+m*d,h.line(g,y,g-_,y,this._options)},t}();o.Square=r},270:function(t,o,n){var i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var o,n=1,i=arguments.length;n<i;n++)for(var e in o=arguments[n])Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e]);return t},i.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Turntable=void 0;var e=n(426),s=n(941),r=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var n=o.canvas,r=n.height,a=n.width,h=new e.Shapes(o),c=new s.AudioData(t);this._options=i({count:20,rotate:0,diameter:r/3,cubeHeight:20,frequencyBand:"mids",gap:5},this._options);var u=a/2,l=r/2,p=360/this._options.count;this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(a,r));for(var d=0;d<this._options.count;d++)for(var f=Math.floor(c.data.length/this._options.count)*d,_=c.data[f],v=0;v<_/this._options.cubeHeight;v++){var g=this._options.diameter+this._options.cubeHeight*v+this._options.gap,y=this._options.diameter+this._options.cubeHeight*(v+1),m=h.toRadians(p*d+this._options.rotate+this._options.gap/4),x=h.toRadians(p*(d+1)+this._options.rotate),b=g/2*Math.cos(m)+u,w=g/2*Math.sin(m)+l,C=g/2*Math.cos(x)+u,M=g/2*Math.sin(x)+l,O=y/2*Math.cos(m)+u,P=y/2*Math.sin(m)+l,E=y/2*Math.cos(x)+u,$=y/2*Math.sin(x)+l;h.polygon([{x:b,y:w},{x:O,y:P},{x:E,y:$},{x:C,y:M}],this._options)}},t}();o.Turntable=r},857:function(t,o,n){var i=this&&this.__assign||function(){return i=Object.assign||function(t){for(var o,n=1,i=arguments.length;n<i;n++)for(var e in o=arguments[n])Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e]);return t},i.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Wave=void 0;var e=n(426),s=n(941),r=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var n=o.canvas,r=n.height,a=n.width,h=new s.AudioData(t),c=new e.Shapes(o);if(this._options=i({count:64,frequencyBand:"mids"},this._options),this._options.frequencyBand&&h.setFrequencyBand(this._options.frequencyBand),h.scaleData(Math.min(a,r)),this._options.mirroredX)for(var u=1,l=Math.ceil(h.data.length/2);l<h.data.length;l++)h.data[l]=h.data[Math.ceil(h.data.length/2)-u],u++;if(this._options.top){var p=[{x:0,y:0}];for(l=0;l<=this._options.count;l++){var d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d];p.push({x:Math.floor(a/this._options.count)*l,y:f})}p.push({x:a,y:0}),c.polygon(p,this._options)}if(this._options.right){for(p=[{x:a,y:0}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d],p.push({x:a-f,y:Math.floor(a/this._options.count)*l});p.push({x:a,y:r}),c.polygon(p,this._options)}if(this._options.bottom||!this._options.top&&!this._options.right&&!this._options.left&&!this._options.center){for(p=[{x:0,y:r}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d],p.push({x:Math.floor(a/this._options.count)*l,y:r-f});p.push({x:a,y:r}),c.polygon(p,this._options)}if(this._options.left){for(p=[{x:0,y:0}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d],p.push({x:f,y:Math.floor(a/this._options.count)*l});p.push({x:0,y:r}),c.polygon(p,this._options)}if(this._options.center){for(p=[{x:0,y:r/2}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d],p.push({x:Math.floor(a/this._options.count)*l,y:r/2-f});if(p.push({x:a,y:r/2}),c.polygon(p,this._options),this._options.mirroredY){for(p=[{x:0,y:r/2}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,f=h.data[d],p.push({x:Math.floor(a/this._options.count)*l,y:r/2+f});p.push({x:a,y:r/2}),c.polygon(p,this._options)}}},t}();o.Wave=r},941:(t,o)=>{Object.defineProperty(o,"__esModule",{value:!0}),o.AudioData=void 0;var n=function(){function t(t){this.data=t}return t.prototype.setFrequencyBand=function(t){var o=Math.floor(.0625*this.data.length),n=Math.floor(.0625*this.data.length),i=Math.floor(.375*this.data.length),e={base:this.data.slice(0,o),lows:this.data.slice(o+1,o+n),mids:this.data.slice(o+n+1,o+n+i),highs:this.data.slice(o+n+i+1)};this.data=e[t]},t.prototype.scaleData=function(t){t<255&&(this.data=this.data.map((function(o){var n=Math.round(o/255*100)/100;return t*n})))},t}();o.AudioData=n},426:function(t,o){var n=this&&this.__awaiter||function(t,o,n,i){return new(n||(n=Promise))((function(e,s){function r(t){try{h(i.next(t))}catch(t){s(t)}}function a(t){try{h(i.throw(t))}catch(t){s(t)}}function h(t){var o;t.done?e(t.value):(o=t.value,o instanceof n?o:new n((function(t){t(o)}))).then(r,a)}h((i=i.apply(t,o||[])).next())}))},i=this&&this.__generator||function(t,o){var n,i,e,s,r={label:0,sent:function(){if(1&e[0])throw e[1];return e[1]},trys:[],ops:[]};return s={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function a(s){return function(a){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;r;)try{if(n=1,i&&(e=2&s[0]?i.return:s[0]?i.throw||((e=i.return)&&e.call(i),0):i.next)&&!(e=e.call(i,s[1])).done)return e;switch(i=0,e&&(s=[2&s[0],e.value]),s[0]){case 0:case 1:e=s;break;case 4:return r.label++,{value:s[1],done:!1};case 5:r.label++,i=s[1],s=[0];continue;case 7:s=r.ops.pop(),r.trys.pop();continue;default:if(!((e=(e=r.trys).length>0&&e[e.length-1])||6!==s[0]&&2!==s[0])){r=0;continue}if(3===s[0]&&(!e||s[1]>e[0]&&s[1]<e[3])){r.label=s[1];break}if(6===s[0]&&r.label<e[1]){r.label=e[1],e=s;break}if(e&&r.label<e[2]){r.label=e[2],r.ops.push(s);break}e[2]&&r.ops.pop(),r.trys.pop();continue}s=o.call(t,r)}catch(t){s=[6,t],i=0}finally{n=e=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,a])}}};Object.defineProperty(o,"__esModule",{value:!0}),o.Shapes=void 0;var e=function(){function t(t){this._canvasContext=t}return t.prototype.toRadians=function(t){return t*Math.PI/180},t.prototype.toDegrees=function(t){return 180*t/Math.PI},t.prototype._rotatePoint=function(t,o,n,i,e){var s=this.toRadians(e);return{x:Math.cos(s)*(n-t)-Math.sin(s)*(i-o)+t,y:Math.sin(s)*(n-t)+Math.cos(s)*(i-o)+o}},t.prototype._makeGradient=function(t,o){var n=0,i=this._canvasContext.canvas.height/2,e=this._canvasContext.canvas.width,s=this._canvasContext.canvas.height/2;if(o){var r=this._canvasContext.canvas.width/2,a=this._canvasContext.canvas.height/2,h=this._rotatePoint(r,a,n,i,o);n=h.x,i=h.y;var c=this._rotatePoint(r,a,e,s,o);e=c.x,s=c.y}var u=this._canvasContext.createLinearGradient(n,i,e,s);return t.forEach((function(o,n){u.addColorStop(1/t.length*n,o)})),u},t.prototype._makeImage=function(t){return n(this,void 0,void 0,(function(){var o,n=this;return i(this,(function(i){return(o=new Image).src=t,[2,new Promise((function(t,i){o.onload=function(){var i=n._canvasContext.createPattern(o,"repeat");t(i)}}))]}))}))},t.prototype._implementOptions=function(t,o){var n,i,e,s,r,a,h,c,u,l,p,d,f=this;void 0===o&&(o=!0),"string"==typeof(null==t?void 0:t.lineColor)?this._canvasContext.strokeStyle=t.lineColor:(null===(n=null==t?void 0:t.lineColor)||void 0===n?void 0:n.gradient)?this._canvasContext.strokeStyle=this._makeGradient(t.lineColor.gradient,t.lineColor.rotate):(null===(i=null==t?void 0:t.lineColor)||void 0===i?void 0:i.image)?this._makeImage(null===(e=null==t?void 0:t.lineColor)||void 0===e?void 0:e.image).then((function(t){return f._canvasContext.strokeStyle=t})):this._canvasContext.strokeStyle="#000","string"==typeof(null==t?void 0:t.fillColor)?this._canvasContext.fillStyle=t.fillColor:(null===(s=null==t?void 0:t.fillColor)||void 0===s?void 0:s.gradient)?this._canvasContext.fillStyle=this._makeGradient(t.fillColor.gradient,t.fillColor.rotate):(null===(r=null==t?void 0:t.fillColor)||void 0===r?void 0:r.image)?this._makeImage(null===(a=null==t?void 0:t.fillColor)||void 0===a?void 0:a.image).then((function(t){return f._canvasContext.fillStyle=t})):this._canvasContext.fillStyle="#000",this._canvasContext.lineCap=null!==(h=(null==t?void 0:t.rounded)?"round":"butt")&&void 0!==h?h:"butt",this._canvasContext.lineWidth=null!==(c=null==t?void 0:t.lineWidth)&&void 0!==c?c:1,this._canvasContext.shadowColor=null!==(l=null===(u=null==t?void 0:t.glow)||void 0===u?void 0:u.color)&&void 0!==l?l:"rgba(0,0,0,0)",this._canvasContext.shadowBlur=null!==(d=null===(p=null==t?void 0:t.glow)||void 0===p?void 0:p.strength)&&void 0!==d?d:0,this._canvasContext.shadowOffsetX=0,this._canvasContext.shadowOffsetY=0,o&&this._canvasContext.closePath(),this._canvasContext.stroke(),o&&this._canvasContext.fill()},t.prototype.arc=function(t,o,n,i,e,s){return this._canvasContext.beginPath(),this._canvasContext.arc(t,o,n/2,this.toRadians(i),this.toRadians(e)),this._implementOptions(s,!1),this},t.prototype.circle=function(t,o,n,i){return this._canvasContext.beginPath(),this._canvasContext.arc(t,o,n/2,0,2*Math.PI),this._implementOptions(i),this},t.prototype.line=function(t,o,n,i,e){return this._canvasContext.beginPath(),this._canvasContext.moveTo(t,o),this._canvasContext.lineTo(n,i),this._implementOptions(e),this},t.prototype.polygon=function(t,o){var n;this._canvasContext.beginPath(),this._canvasContext.moveTo(t[0].x,t[0].y);for(var i=0;i<t.length;i++){var e=t[i],s=null!==(n=t[i+1])&&void 0!==n?n:e,r=(e.x+s.x)/2,a=(e.y+s.y)/2;(null==o?void 0:o.rounded)?this._canvasContext.quadraticCurveTo(t[i].x,t[i].y,r,a):this._canvasContext.lineTo(t[i].x,t[i].y)}return this._implementOptions(o),this},t.prototype.rectangle=function(t,o,n,i,e){var s,r=null!==(s=null==e?void 0:e.radius)&&void 0!==s?s:0;return n<2*r&&(r=n/2),i<2*r&&(r=i/2),this._canvasContext.beginPath(),this._canvasContext.moveTo(t+r,o),this._canvasContext.arcTo(t+n,o,t+n,o+i,r),this._canvasContext.arcTo(t+n,o+i,t,o+i,r),this._canvasContext.arcTo(t,o+i,t,o,r),this._canvasContext.arcTo(t,o,t+n,o,r),this._implementOptions(e),this},t}();o.Shapes=e}},o={};function n(i){var e=o[i];if(void 0!==e)return e.exports;var s=o[i]={exports:{}};return t[i].call(s.exports,s,s.exports,n),s.exports}var i={};return(()=>{var t=i;Object.defineProperty(t,"__esModule",{value:!0}),t.Wave=void 0;var o=n(935),e=n(519),s=n(938),r=n(540),a=n(522),h=n(658),c=n(817),u=n(123),l=n(270),p=n(857),d=function(){function t(t,n,i){void 0===i&&(i=!1);var d=this;this.animations={Arcs:o.Arcs,Circles:e.Circles,Cubes:s.Cubes,Flower:r.Flower,Glob:a.Glob,Lines:h.Lines,Shine:c.Shine,Square:u.Square,Turntable:l.Turntable,Wave:p.Wave},this._activeAnimations=[],this._canvasElement=n,this._canvasContext=this._canvasElement.getContext("2d"),this._muteAudio=i,this._interacted=!1,t instanceof HTMLAudioElement?(this._audioElement=t,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)?["touchstart","touchmove","touchend","mouseup","click"].forEach((function(t){document.body.addEventListener(t,(function(){return d.connectAnalyser()}),{once:!0})})):this._audioElement.addEventListener("play",(function(){return d.connectAnalyser()}),{once:!0})):t instanceof AnalyserNode?(this._audioAnalyser=t,this._audioContext=null,this._audioSource=null,this._play()):t&&(this._audioContext=t.context,this._audioSource=t.source,this._audioAnalyser=this._audioContext.createAnalyser(),this._play())}return t.prototype.connectAnalyser=function(){this._interacted||(this._interacted=!0,this._audioContext=new AudioContext,this._audioSource=this._audioContext.createMediaElementSource(this._audioElement),this._audioAnalyser=this._audioContext.createAnalyser(),this._play())},t.prototype._play=function(){var t=this;this._audioSource&&(this._audioSource.connect(this._audioAnalyser),this._muteAudio||this._audioSource.connect(this._audioContext.destination)),this._audioAnalyser.smoothingTimeConstant=.85,this._audioAnalyser.fftSize=1024;var o=new Uint8Array(this._audioAnalyser.frequencyBinCount),n=function(){t._audioAnalyser.getByteFrequencyData(o),t._canvasContext.clearRect(0,0,t._canvasContext.canvas.width,t._canvasContext.canvas.height),t._activeAnimations.forEach((function(n){n.draw(o,t._canvasContext)})),window.requestAnimationFrame(n)};n()},t.prototype.addAnimation=function(t){this._activeAnimations.push(t)},t.prototype.clearAnimations=function(){this._activeAnimations=[]},t}();t.Wave=d})(),i})(),t.exports=i()}}]);
//# sourceMappingURL=58cc4e2.js.map