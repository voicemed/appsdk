(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{999:function(n,s,o){"use strict";o.r(s),o.d(s,"BrowserWeb",(function(){return e})),o.d(s,"Browser",(function(){return i}));var t=o(61);class e extends t.b{constructor(){super(),this._lastWindow=null}async open(n){this._lastWindow=window.open(n.url,n.windowName||"_blank")}async close(){return new Promise(((n,s)=>{null!=this._lastWindow?(this._lastWindow.close(),this._lastWindow=null,n()):s("No active window to close!")}))}}const i=new e}}]);
//# sourceMappingURL=7301bfd.js.map