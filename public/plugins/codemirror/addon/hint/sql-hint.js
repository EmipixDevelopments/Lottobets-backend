var t;t=function(t){var e,r,n,o,i={QUERY_DIV:";",ALIAS_KEYWORD:"AS"},s=t.Pos,a=t.cmpPos;function l(t){return"[object Array]"==Object.prototype.toString.call(t)}function u(e){var r=e.doc.modeOption;return"sql"===r&&(r="text/x-sql"),t.resolveMode(r).keywords}function f(e){var r=e.doc.modeOption;return"sql"===r&&(r="text/x-sql"),t.resolveMode(r).identifierQuote||"`"}function c(t){return"string"==typeof t?t:t.text}function p(t,e){return l(e)&&(e={columns:e}),e.text||(e.text=t),e}function d(t){var e={};if(l(t))for(var r=t.length-1;r>=0;r--){var n=t[r];e[c(n).toUpperCase()]=p(c(n),n)}else if(t)for(var o in t)e[o.toUpperCase()]=p(o,t[o]);return e}function g(t){return e[t.toUpperCase()]}function h(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e}function v(t,e){var r=t.length,n=c(e).substr(0,r);return t.toUpperCase()===n.toUpperCase()}function x(t,e,r,n){if(l(r))for(var o=0;o<r.length;o++)v(e,r[o])&&t.push(n(r[o]));else for(var i in r)if(r.hasOwnProperty(i)){var s=r[i];v(e,s=s&&!0!==s?s.displayText?{text:s.text,displayText:s.displayText}:s.text:i)&&t.push(n(s))}}function m(t){"."==t.charAt(0)&&(t=t.substr(1));for(var e=t.split(o+o),r=0;r<e.length;r++)e[r]=e[r].replace(new RegExp(o,"g"),"");return e.join(o)}function y(t){for(var e=c(t).split("."),r=0;r<e.length;r++)e[r]=o+e[r].replace(new RegExp(o,"g"),o+o)+o;var n=e.join(".");return"string"==typeof t?n:((t=h(t)).text=n,t)}function b(t,n,i,a){for(var l=!1,u=[],f=n.start,c=!0;c;)c="."==n.string.charAt(0),l=l||n.string.charAt(0)==o,f=n.start,u.unshift(m(n.string)),"."==(n=a.getTokenAt(s(t.line,n.start))).string&&(c=!0,n=a.getTokenAt(s(t.line,n.start)));var p=u.join(".");x(i,p,e,(function(t){return l?y(t):t})),x(i,p,r,(function(t){return l?y(t):t})),p=u.pop();var d=u.join("."),v=!1,b=d;if(!g(d)){var C=d;(d=A(d,a))!==C&&(v=!0)}var q=g(d);return q&&q.columns&&(q=q.columns),q&&x(i,p,q,(function(t){var e=d;return 1==v&&(e=b),"string"==typeof t?t=e+"."+t:(t=h(t)).text=e+"."+t.text,l?y(t):t})),f}function C(t,e){for(var r=t.split(/\s+/),n=0;n<r.length;n++)r[n]&&e(r[n].replace(/[`,;]/g,""))}function A(t,e){for(var r=e.doc,n=r.getValue(),o=t.toUpperCase(),l="",u="",f=[],c={start:s(0,0),end:s(e.lastLine(),e.getLineHandle(e.lastLine()).length)},p=n.indexOf(i.QUERY_DIV);-1!=p;)f.push(r.posFromIndex(p)),p=n.indexOf(i.QUERY_DIV,p+1);f.unshift(s(0,0)),f.push(s(e.lastLine(),e.getLineHandle(e.lastLine()).text.length));for(var d=null,h=e.getCursor(),v=0;v<f.length;v++){if((null==d||a(h,d)>0)&&a(h,f[v])<=0){c={start:d,end:f[v]};break}d=f[v]}if(c.start){var x=r.getRange(c.start,c.end,!1);for(v=0;v<x.length&&(C(x[v],(function(t){var e=t.toUpperCase();e===o&&g(l)&&(u=l),e!==i.ALIAS_KEYWORD&&(l=t)})),!u);v++);}return u}t.registerHelper("hint","sql",(function(t,i){e=d(i&&i.tables);var a=i&&i.defaultTable,l=i&&i.disableKeywords;r=a&&g(a),n=u(t),o=f(t),a&&!r&&(r=A(a,t)),(r=r||[]).columns&&(r=r.columns);var c,p,h,v=t.getCursor(),m=[],y=t.getTokenAt(v);if(y.end>v.ch&&(y.end=v.ch,y.string=y.string.slice(0,v.ch-y.start)),y.string.match(/^[.`"'\w@][\w$#]*$/g)?(h=y.string,c=y.start,p=y.end):(c=p=v.ch,h=""),"."==h.charAt(0)||h.charAt(0)==o)c=b(v,y,m,t);else{var C=function(t,e){return"object"==typeof t?t.className=e:t={text:t,className:e},t};x(m,h,r,(function(t){return C(t,"CodeMirror-hint-table CodeMirror-hint-default-table")})),x(m,h,e,(function(t){return C(t,"CodeMirror-hint-table")})),l||x(m,h,n,(function(t){return C(t.toUpperCase(),"CodeMirror-hint-keyword")}))}return{list:m,from:s(v.line,c),to:s(v.line,p)}}))},"object"==typeof exports&&"object"==typeof module?t(require("../../lib/codemirror"),require("../../mode/sql/sql")):"function"==typeof define&&define.amd?define(["../../lib/codemirror","../../mode/sql/sql"],t):t(CodeMirror);