(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{1015:function(e,i,t){"use strict";t.r(i);t(316);var r={inheritAttrs:!0,name:"exerciseCard",props:{index:{type:Number,default:0},exercise:{type:Object,default:function(){}},disable:{type:Boolean,default:!1},programview:{type:Boolean,default:!1}},computed:{nuxtloading:function(){return $nuxt.$loading.loading}},methods:{pickMe:function(){this.$analytics.logEvent("exercise_opened",{id:this.exercise.id,type:this.exercise.type,name:this.exercise.title,program_id:void 0!==this.exercise.program_id?this.exercise.program_id:null}),this.$emit("click",this.exercise)}}},s=t(42),a=Object(s.a)(r,(function(){var e=this,i=e._self._c;return i("v-card",e._b({class:["exercisecard exercise","exidx_"+e.index,e.programview?"programview":"",e.exercise.type],attrs:{elevation:"1"},on:{click:e.pickMe}},"v-card",e.$attrs,!1),[i("v-list-item",{attrs:{ripple:!e.disable}},[!1===e.programview?i("v-list-item-avatar",{attrs:{tile:!1,rounded:"0"}},[i("v-img",{attrs:{src:e.exercise.thumb,contain:""}})],1):e._e(),e._v(" "),i("v-list-item-content",{staticClass:"card-texts"},[i("v-list-item-title",{domProps:{innerHTML:e._s(e.exercise.title)}}),e._v(" "),e.exercise.type!==e.$exerciseManager.kindPOST?i("v-list-item-subtitle",[i("v-icon",[e._v("mdi-clock-time-four-outline")]),e._v(" \n        "+e._s(e.$humanizeTime(e.exercise.duration))+"\n        "),!0===e.programview?[i("v-icon",{staticClass:"program"},[e._v("$program")]),e._v("\n          "+e._s(e.exercise.program_name)+"\n        ")]:e._e()],2):e._e()],1),e._v(" "),e.disable?e._e():i("v-list-item-action",[i("v-btn",{attrs:{icon:"",loading:e.nuxtloading}},[i("v-icon",[e._v("mdi-play")])],1)],1)],1)],1)}),[],!1,null,null,null);i.default=a.exports}}]);
//# sourceMappingURL=6a73ce1.js.map