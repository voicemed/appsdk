(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{927:function(e,t,r){"use strict";r.r(t);r(314);var n={props:{value:{type:Number,default:0},exerciseSteps:{type:Number,default:1},startPercent:{type:Number,default:0},doneClass:{type:String,default:"done"},maxPercent:{type:Number,default:1},runningPercent:{type:Number,default:0}},computed:{primaryColor:function(){return $nuxt.$config.env.environment.indexOf("voicemed_")>-1?"#EC483F":"#848CE6"},exercisescount:function(){return this.exerciseSteps},currentExercise:function(){return this.value},currentPercent:function(){return this.runningPercent}},methods:{getRotation:function(e){return 0===e?"transform:rotate(0deg);":"transform:rotate("+360/this.exercisescount*e+"deg);"}}},u=r(42),o=Object(u.a)(n,(function(){var e=this,t=e._self._c;return t("div",{class:["donut_progress"]},[t("vc-donut",{attrs:{background:"#FFFFFF",foreground:"#848CE633",size:100,unit:"%",thickness:5,sections:[{label:"progress",value:e.currentPercent,color:e.primaryColor}],total:100,"start-angle":0,"auto-adjust-text-size":!0}},[e._t("inside")],2)],1)}),[],!1,null,null,null);t.default=o.exports}}]);
//# sourceMappingURL=2469fb1.js.map