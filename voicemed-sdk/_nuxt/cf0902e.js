(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{935:function(t,i,e){"use strict";e.r(i);e(319);var n="abort",s="progress",o="start",a="visibilitychange",l={name:"CountDown",props:{interval:{type:Number,default:1e3},timerLength:{type:Number,default:1e4},reverse:{type:Boolean,default:!1},now:{type:Function,default:function(){return Date.now()}},emits:{EVENT_ABORT:n,EVENT_END:"end",EVENT_PROGRESS:s,EVENT_START:o}},data:function(){return{counting:!1,totalMilliseconds:0,requestId:0,endTime:0,elapsed:0}},computed:{totalSeconds:function(){return Math.floor(this.totalMilliseconds/1e3)}},watch:{$props:{deep:!0,immediate:!0,handler:function(){this.totalMilliseconds=this.timerLength,this.endTime=this.now()+this.timerLength}}},mounted:function(){document.addEventListener(a,this.handleVisibilityChange)},beforeUnmount:function(){document.removeEventListener(a,this.handleVisibilityChange),this.pause()},methods:{restart:function(){this.totalMilliseconds=this.timerLength,this.endTime=this.now()+this.timerLength,this.elapsed=0,this.start()},start:function(){this.counting||(this.counting=!0,this.$emit(o),"visible"===document.visibilityState&&this.continue())},getElapsed:function(){return this.elapsed},continue:function(){var t=this;if(this.counting){var i=Math.min(this.totalMilliseconds,this.interval);if(i>0){var e,n;this.requestId=requestAnimationFrame((function s(o){e||(e=o),n||(n=o);var a=o-e;a>=i||a+(o-n)/2>=i?t.progress():t.requestId=requestAnimationFrame(s),n=o}))}else this.end()}},pause:function(){cancelAnimationFrame(this.requestId)},progress:function(){this.counting&&(this.totalMilliseconds-=this.interval,this.elapsed+=this.interval,this.totalMilliseconds>0&&this.$emit(s,{totalSeconds:this.totalSeconds,totalMilliseconds:this.totalMilliseconds,interval:this.interval,elapsed:this.elapsed}),this.continue())},abort:function(){this.counting&&(this.pause(),this.counting=!1,this.$emit(n))},end:function(){this.counting&&(this.pause(),this.counting=!1,this.$emit("end",{totalSeconds:this.totalSeconds,totalMilliseconds:this.totalMilliseconds,interval:this.interval,elapsed:this.elapsed}),this.totalMilliseconds=0)},update:function(){this.counting&&(this.totalMilliseconds=Math.max(0,this.endTime-this.now()))},handleVisibilityChange:function(){switch(document.visibilityState){case"visible":this.update(),this.continue();break;case"hidden":this.pause()}}}},h=e(36),u=Object(h.a)(l,(function(){return(0,this._self._c)("div",{staticClass:"countdown_wrapper"})}),[],!1,null,null,null);i.default=u.exports}}]);
//# sourceMappingURL=cf0902e.js.map