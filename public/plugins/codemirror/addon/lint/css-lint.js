var e;e=function(e){e.registerHelper("lint","css",(function(o,r){var n=[];if(!window.CSSLint)return window.console&&window.console.error("Error: window.CSSLint not defined, CodeMirror CSS linting cannot run."),n;for(var i=CSSLint.verify(o,r).messages,t=null,s=0;s<i.length;s++){var d=(t=i[s]).line-1,l=t.line-1,f=t.col-1,c=t.col;n.push({from:e.Pos(d,f),to:e.Pos(l,c),message:t.message,severity:t.type})}return n}))},"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror);