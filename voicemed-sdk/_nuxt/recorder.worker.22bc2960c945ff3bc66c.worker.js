!function(e){var t={};function r(n){if(t[n])return t[n].exports;var f=t[n]={i:n,l:!1,exports:{}};return e[n].call(f.exports,f,f.exports,r),f.l=!0,f.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var f in e)r.d(n,f,function(t){return e[t]}.bind(null,f));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/voicemed-sdk/_nuxt/",r(r.s=0)}([function(e,t){const r={init:function(e){r.sampleRate=e.sampleRate},record:function(e){r.recBuffersL.push(e[0]),r.recBuffersR.push(e[1]),r.recLength+=e[0].length},exportWAV:function(e){r.mergeBuffers(r.recBuffersL,r.recLength),r.mergeBuffers(r.recBuffersR,r.recLength);var t=r.interleave(r.bufferL,r.bufferR),n=r.encodeWAV(t),f=new Blob([n],{type:e});self.postMessage(f)},exportMonoWAV:function(e){var t=r.mergeBuffers(r.recBuffersL,r.recLength),n=r.encodeWAV(t,!0),f=new Blob([n],{type:e});self.postMessage(f)},getBuffers:function(){var e=[];e.push(r.mergeBuffers(r.recBuffersL,r.recLength)),e.push(r.mergeBuffers(r.recBuffersR,r.recLength)),self.postMessage(e)},clear:function(){r.recLength=0,r.recBuffersL=[],r.recBuffersR=[]},mergeBuffers:function(e,t){for(var r=new Float32Array(t),n=0,f=0;f<e.length;f++)r.set(e[f],n),n+=e[f].length;return r},interleave:function(e,t){for(var r=e.length+t.length,n=new Float32Array(r),f=0,o=0;f<r;)n[f++]=e[o],n[f++]=t[o],o++;return n},floatTo16BitPCM:function(e,t,r){for(var n=0;n<r.length;n++,t+=2){var f=Math.max(-1,Math.min(1,r[n]));e.setInt16(t,f<0?32768*f:32767*f,!0)}},writeString:function(e,t,r){for(var n=0;n<r.length;n++)e.setUint8(t+n,r.charCodeAt(n))},encodeWAV:function(e,t){var n=new ArrayBuffer(44+2*e.length),f=new DataView(n);return r.writeString(f,0,"RIFF"),f.setUint32(4,32+2*e.length,!0),r.writeString(f,8,"WAVE"),r.writeString(f,12,"fmt "),f.setUint32(16,16,!0),f.setUint16(20,1,!0),f.setUint16(22,t?1:2,!0),f.setUint32(24,r.sampleRate,!0),f.setUint32(28,4*r.sampleRate,!0),f.setUint16(32,4,!0),f.setUint16(34,16,!0),r.writeString(f,36,"data"),f.setUint32(40,2*e.length,!0),r.floatTo16BitPCM(f,44,e),f},recLength:0,recBuffersL:[],recBuffersR:[],sampleRate:null};self.addEventListener("message",(e=>{switch(e.data.command){case"init":r.init(e.data.config);break;case"record":r.record(e.data.buffer);break;case"exportWAV":r.exportWAV(e.data.type);break;case"exportMonoWAV":r.exportMonoWAV(e.data.type);break;case"getBuffers":r.getBuffers();break;case"clear":r.clear()}}))}]);
//# sourceMappingURL=recorder.worker.22bc2960c945ff3bc66c.worker.js.map