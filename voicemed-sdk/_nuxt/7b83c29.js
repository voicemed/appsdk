(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{972:function(e,i,t){"use strict";t.r(i);t(314);var s={inheritAttrs:!0,name:"exerciseCard",props:{index:{type:Number,default:0},exercise:{type:Object,default:function(){}},isguest:{type:Boolean,default:!1},disable:{type:Boolean,default:!1},programview:{type:Boolean,default:!1}},computed:{nuxtloading:function(){return $nuxt.$loading.loading}},methods:{pickMe:function(){this.$analytics.logEvent("exercise_opened",{id:this.exercise.id,type:this.exercise.type,name:this.exercise.title,program_id:void 0!==this.exercise.program_id?this.exercise.program_id:null}),this.$emit("click",this.exercise)}}},a=t(42),r=Object(a.a)(s,(function(){var e=this,i=e._self._c;return i("v-card",e._b({class:["exercisecard v2 exercise","exidx_"+e.index,e.programview?"programview":"",e.exercise.type,e.disable?"disabled":""],on:{click:e.pickMe}},"v-card",e.$attrs,!1),[i("div",{staticClass:"card__header"},[i("div",{class:["type",e.exercise.type]},[e._v(e._s(e.$t("generic.exercisetype."+e.exercise.type)))]),e._v(" "),i("div",{class:["exercise_type icon_holder",e.exercise.type]},[e._v(" ")])]),e._v(" "),i("v-row",{staticClass:"ma-0"},[i("div",{staticClass:"flex-grow-1 texts card-texts"},[i("v-card-title",{domProps:{innerHTML:e._s(e.exercise.title)}}),e._v(" "),i("v-card-subtitle",[e.exercise.duration&&e.exercise.duration>0?i("div",{staticClass:"duration inner"},[e._v(e._s(e.$humanizeTime(e.exercise.duration)))]):e._e()])],1),e._v(" "),i("div",{staticClass:"action ma-0 pa-0"},[e.isguest||e.disable?i("v-btn",{attrs:{icon:"",loading:e.nuxtloading}},[i("v-icon",[e._v("$lock")])],1):i("v-btn",{attrs:{icon:"",loading:e.nuxtloading}},[i("v-icon",[e._v("mdi-play")])],1)],1)])],1)}),[],!1,null,null,null);i.default=r.exports}}]);
//# sourceMappingURL=7b83c29.js.map