(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{929:function(r,e,t){r.exports=t.p+"img/errorprogram.13f9d1b.png"},974:function(r,e,t){"use strict";t.r(e);t(3),t(5),t(7),t(8),t(6),t(9);var o=t(26),s=(t(314),t(0),t(46));function a(r,e){var t=Object.keys(r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(r);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),t.push.apply(t,o)}return t}function n(r){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?a(Object(t),!0).forEach((function(e){Object(o.a)(r,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(t,e))}))}return r}var i={name:"programCard",props:{index:{type:Number,default:0},program:{type:Object,default:function(){}},showprogress:{type:Boolean,default:!1}},data:function(){return{programThumb:void 0}},computed:n(n({},Object(s.d)({getRunningProgram:"getRunningProgram",isCurrentUserGuest:"isCurrentUserGuest"})),{},{overallProgress:function(){if(void 0===this.program.exercises)return 0;var r=this.program.exercises.reduce((function(r,e){return r+(e.completed?0:1)}),0);return Math.round(100*(1-r/this.program.exercises.length))},nuxtloading:function(){return $nuxt.$loading.loading},programImage:function(){return this.program&&void 0!==this.program.thumb&&null!==this.program.thumb&&this.program.thumb.length>0?this.program.thumb:""}}),methods:{imageError:function(){console.log("program image error"),this.programThumb=t(929)},pickMe:function(){this.$analytics.logEvent("program_opened",{id:this.program.id,name:this.program.title}),this.$emit("click",this.program)}}},c=t(42),p=Object(c.a)(i,(function(){var r=this,e=r._self._c;return e("v-card",{class:["program v2","prgdx_"+r.index],on:{click:r.pickMe}},[e("div",{staticClass:"card__header"},[e("div",{staticClass:"type"},[e("span",[r._v(r._s(r.$t("program.baseTag")))])]),r._v(" "),e("div",{class:["program_type icon_holder"]},[r._v(" ")])]),r._v(" "),e("v-row",{staticClass:"ma-0"},[e("div",{staticClass:"flex-grow-1 texts card-texts"},[e("v-card-title",{domProps:{innerHTML:r._s(r.program.title)}}),r._v(" "),e("v-card-subtitle",[void 0!==r.program.exercises&&r.program.exercises.length>0?e("div",{staticClass:"text-lowercase"},[r._v(r._s(r.program.exercises.length)+" "+r._s(r.$t("program.exercises")))]):r._e()])],1),r._v(" "),r.showprogress?e("div",{staticClass:"action ma-0 pa-0 progress"},[e("v-progress-circular",{attrs:{rotate:-90,size:38,value:r.overallProgress}},[r._v("\n        "+r._s(r.overallProgress)+"%\n      ")])],1):e("div",{staticClass:"action flex row align-content-center justify-center ma-0 pa-0"},[e("v-btn",{attrs:{icon:""}},[e("v-icon",[r._v("mdi-play")])],1)],1)])],1)}),[],!1,null,null,null);e.default=p.exports}}]);
//# sourceMappingURL=4d9feb9.js.map