(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{1017:function(r,t,e){"use strict";e.r(t);e(3),e(4),e(7),e(0),e(8),e(5),e(9);var n=e(26),o=(e(316),e(46));function i(r,t){var e=Object.keys(r);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(r);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable}))),e.push.apply(e,n)}return e}function a(r){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{};t%2?i(Object(e),!0).forEach((function(t){Object(n.a)(r,t,e[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(e)):i(Object(e)).forEach((function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(e,t))}))}return r}var s={name:"programCard",props:{index:{type:Number,default:0},program:{type:Object,default:function(){}}},data:function(){return{programThumb:void 0}},computed:a(a({},Object(o.d)({getRunningProgram:"getRunningProgram",isCurrentUserGuest:"isCurrentUserGuest"})),{},{nuxtloading:function(){return $nuxt.$loading.loading},programImage:function(){return this.program&&void 0!==this.program.thumb&&null!==this.program.thumb&&this.program.thumb.length>0?this.program.thumb:e(934)}}),methods:{imageError:function(){console.log("program image error"),this.programThumb=e(934)},pickMe:function(){this.$analytics.logEvent("program_opened",{id:this.program.id,name:this.program.title}),this.$emit("click",this.program)}}},c=e(42),p=Object(c.a)(s,(function(){var r=this,t=r._self._c;return t("v-card",{class:["program","prgdx_"+r.index],attrs:{elevation:"1"},on:{click:r.pickMe}},[t("v-img",{attrs:{src:r.programThumb||r.programImage,height:"152px"},on:{error:r.imageError}}),r._v(" "),t("v-row",{staticClass:"ma-0",attrs:{"align-content":"center",justify:"center"}},[t("div",{staticClass:"flex-grow-1 texts card-texts"},[t("v-card-title",{domProps:{innerHTML:r._s(r.program.title)}}),r._v(" "),t("v-card-subtitle",[t("v-icon",{staticClass:"program"},[r._v("$program")]),r._v(" Program · "+r._s(r.program.exercises_ids.length)+" exercises\n      ")],1)],1),r._v(" "),t("div",{staticClass:"action flex row align-content-center justify-center ma-0 pr-2"},[r.isCurrentUserGuest?t("v-btn",{attrs:{icon:""}},[t("v-icon",[r._v("$lock")])],1):void 0],2)])],1)}),[],!1,null,null,null);t.default=p.exports},934:function(r,t,e){r.exports=e.p+"img/errorprogram.13f9d1b.png"}}]);
//# sourceMappingURL=471cb6c.js.map