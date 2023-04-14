var e;e=function(e){e.defineMode("haxe",(function(e,t){var n=e.indentUnit;function r(e){return{type:e,style:"keyword"}}var a,i=r("keyword a"),o=r("keyword b"),l=r("keyword c"),u=r("operator"),c={type:"atom",style:"atom"},f={type:"attribute",style:"attribute"},s=r("typedef"),d={if:i,while:i,else:o,do:o,try:o,return:l,break:l,continue:l,new:l,throw:l,var:r("var"),inline:f,static:f,using:r("import"),public:f,private:f,cast:r("cast"),import:r("import"),macro:r("macro"),function:r("function"),catch:r("catch"),untyped:r("untyped"),callback:r("cb"),for:r("for"),switch:r("switch"),case:r("case"),default:r("default"),in:u,never:r("property_access"),trace:r("trace"),class:s,abstract:s,enum:s,interface:s,typedef:s,extends:s,implements:s,dynamic:s,true:c,false:c,null:c},p=/[+\-*&%=<>!?|]/;function m(e,t,n){return t.tokenize=n,n(e,t)}function v(e,t){for(var n,r=!1;null!=(n=e.next());){if(n==t&&!r)return!0;r=!r&&"\\"==n}}function b(e,t,n){return s=e,a=n,t}function y(e,t){var n=e.next();if('"'==n||"'"==n)return m(e,t,x(n));if(/[\[\]{}\(\),;\:\.]/.test(n))return b(n);if("0"==n&&e.eat(/x/i))return e.eatWhile(/[\da-f]/i),b("number","number");if(/\d/.test(n)||"-"==n&&e.eat(/\d/))return e.match(/^\d*(?:\.\d*(?!\.))?(?:[eE][+\-]?\d+)?/),b("number","number");if(t.reAllowed&&"~"==n&&e.eat(/\//))return v(e,"/"),e.eatWhile(/[gimsu]/),b("regexp","string-2");if("/"==n)return e.eat("*")?m(e,t,h):e.eat("/")?(e.skipToEnd(),b("comment","comment")):(e.eatWhile(p),b("operator",null,e.current()));if("#"==n)return e.skipToEnd(),b("conditional","meta");if("@"==n)return e.eat(/:/),e.eatWhile(/[\w_]/),b("metadata","meta");if(p.test(n))return e.eatWhile(p),b("operator",null,e.current());if(/[A-Z]/.test(n))return e.eatWhile(/[\w_<>]/),b("type","variable-3",r=e.current());e.eatWhile(/[\w_]/);var r=e.current(),a=d.propertyIsEnumerable(r)&&d[r];return a&&t.kwAllowed?b(a.type,a.style,r):b("variable","variable",r)}function x(e){return function(t,n){return v(t,e)&&(n.tokenize=y),b("string","string")}}function h(e,t){for(var n,r=!1;n=e.next();){if("/"==n&&r){t.tokenize=y;break}r="*"==n}return b("comment","comment")}var k={atom:!0,number:!0,variable:!0,string:!0,regexp:!0};function w(e,t,n,r,a,i){this.indented=e,this.column=t,this.type=n,this.prev=a,this.info=i,null!=r&&(this.align=r)}function g(e,t){for(var n=e.localVars;n;n=n.next)if(n.name==t)return!0}function V(e,t,n,r,a){var i=e.cc;for(E.state=e,E.stream=a,E.marked=null,E.cc=i,e.lexical.hasOwnProperty("align")||(e.lexical.align=!0);;)if((i.length?i.pop():j)(n,r)){for(;i.length&&i[i.length-1].lex;)i.pop()();return E.marked?E.marked:"variable"==n&&g(e,r)?"variable-2":"variable"==n&&A(e,r)?"variable-3":t}}function A(e,t){if(/[a-z]/.test(t.charAt(0)))return!1;for(var n=e.importedtypes.length,r=0;r<n;r++)if(e.importedtypes[r]==t)return!0}function S(e){for(var t=E.state,n=t.importedtypes;n;n=n.next)if(n.name==e)return;t.importedtypes={name:e,next:t.importedtypes}}var E={state:null,column:null,marked:null,cc:null};function W(){for(var e=arguments.length-1;e>=0;e--)E.cc.push(arguments[e])}function z(){return W.apply(null,arguments),!0}function M(e,t){for(var n=t;n;n=n.next)if(n.name==e)return!0;return!1}function C(e){var t=E.state;if(t.context){if(E.marked="def",M(e,t.localVars))return;t.localVars={name:e,next:t.localVars}}else if(t.globalVars){if(M(e,t.globalVars))return;t.globalVars={name:e,next:t.globalVars}}}var T={name:"this",next:null};function Z(){E.state.context||(E.state.localVars=T),E.state.context={prev:E.state.context,vars:E.state.localVars}}function I(){E.state.localVars=E.state.context.vars,E.state.context=E.state.context.prev}function O(e,t){var n=function(){var n=E.state;n.lexical=new w(n.indented,E.stream.column(),e,null,n.lexical,t)};return n.lex=!0,n}function P(){var e=E.state;e.lexical.prev&&(")"==e.lexical.type&&(e.indented=e.lexical.indented),e.lexical=e.lexical.prev)}function _(e){function t(n){return n==e?z():";"==e?W():z(t)}return t}function j(e){return"@"==e?z(U):"var"==e?z(O("vardef"),R,_(";"),P):"keyword a"==e?z(O("form"),D,j,P):"keyword b"==e?z(O("form"),j,P):"{"==e?z(O("}"),Z,Q,P,I):";"==e?z():"attribute"==e?z(F):"function"==e?z(te):"for"==e?z(O("form"),_("("),O(")"),Y,_(")"),P,j,P):"variable"==e?z(O("stat"),J):"switch"==e?z(O("form"),D,O("}","switch"),_("{"),Q,P,P):"case"==e?z(D,_(":")):"default"==e?z(_(":")):"catch"==e?z(O("form"),Z,_("("),ie,_(")"),j,P,I):"import"==e?z(G,_(";")):"typedef"==e?z(H):W(O("stat"),D,_(";"),P)}function D(e){return k.hasOwnProperty(e)||"type"==e?z(B):"function"==e?z(te):"keyword c"==e?z(q):"("==e?z(O(")"),q,_(")"),P,B):"operator"==e?z(D):"["==e?z(O("]"),N(q,"]"),P,B):"{"==e?z(O("}"),N(L,"}"),P,B):z()}function q(e){return e.match(/[;\}\)\],]/)?W():W(D)}function B(e,t){return"operator"==e&&/\+\+|--/.test(t)?z(B):"operator"==e||":"==e?z(D):";"!=e?"("==e?z(O(")"),N(D,")"),P,B):"."==e?z(K,B):"["==e?z(O("]"),D,_("]"),P,B):void 0:void 0}function F(e){return"attribute"==e?z(F):"function"==e?z(te):"var"==e?z(R):void 0}function U(e){return":"==e||"variable"==e?z(U):"("==e?z(O(")"),N($,")"),P,j):void 0}function $(e){if("variable"==e)return z()}function G(e,t){return"variable"==e&&/[A-Z]/.test(t.charAt(0))?(S(t),z()):"variable"==e||"property"==e||"."==e||"*"==t?z(G):void 0}function H(e,t){return"variable"==e&&/[A-Z]/.test(t.charAt(0))?(S(t),z()):"type"==e&&/[A-Z]/.test(t.charAt(0))?z():void 0}function J(e){return":"==e?z(P,j):W(B,_(";"),P)}function K(e){if("variable"==e)return E.marked="property",z()}function L(e){if("variable"==e&&(E.marked="property"),k.hasOwnProperty(e))return z(_(":"),D)}function N(e,t){function n(r){return","==r?z(e,n):r==t?z():z(_(t))}return function(r){return r==t?z():W(e,n)}}function Q(e){return"}"==e?z():W(j,Q)}function R(e,t){return"variable"==e?(C(t),z(ne,X)):z()}function X(e,t){return"="==t?z(D,X):","==e?z(R):void 0}function Y(e,t){return"variable"==e?(C(t),z(ee,D)):W()}function ee(e,t){if("in"==t)return z()}function te(e,t){return"variable"==e||"type"==e?(C(t),z(te)):"new"==t?z(te):"("==e?z(O(")"),Z,N(ie,")"),P,ne,j,I):void 0}function ne(e){if(":"==e)return z(re)}function re(e){return"type"==e||"variable"==e?z():"{"==e?z(O("}"),N(ae,"}"),P):void 0}function ae(e){if("variable"==e)return z(ne)}function ie(e,t){if("variable"==e)return C(t),z(ne)}return I.lex=!0,P.lex=!0,{startState:function(e){var r=["Int","Float","String","Void","Std","Bool","Dynamic","Array"],a={tokenize:y,reAllowed:!0,kwAllowed:!0,cc:[],lexical:new w((e||0)-n,0,"block",!1),localVars:t.localVars,importedtypes:r,context:t.localVars&&{vars:t.localVars},indented:0};return t.globalVars&&"object"==typeof t.globalVars&&(a.globalVars=t.globalVars),a},token:function(e,t){if(e.sol()&&(t.lexical.hasOwnProperty("align")||(t.lexical.align=!1),t.indented=e.indentation()),e.eatSpace())return null;var n=t.tokenize(e,t);return"comment"==s?n:(t.reAllowed=!("operator"!=s&&"keyword c"!=s&&!s.match(/^[\[{}\(,;:]$/)),t.kwAllowed="."!=s,V(t,n,s,a,e))},indent:function(e,t){if(e.tokenize!=y)return 0;var r=t&&t.charAt(0),a=e.lexical;"stat"==a.type&&"}"==r&&(a=a.prev);var i=a.type,o=r==i;return"vardef"==i?a.indented+4:"form"==i&&"{"==r?a.indented:"stat"==i||"form"==i?a.indented+n:"switch"!=a.info||o?a.align?a.column+(o?0:1):a.indented+(o?0:n):a.indented+(/^(?:case|default)\b/.test(t)?n:2*n)},electricChars:"{}",blockCommentStart:"/*",blockCommentEnd:"*/",lineComment:"//"}})),e.defineMIME("text/x-haxe","haxe"),e.defineMode("hxml",(function(){return{startState:function(){return{define:!1,inString:!1}},token:function(e,t){var n=e.peek(),r=e.sol();if("#"==n)return e.skipToEnd(),"comment";if(r&&"-"==n){var a="variable-2";return e.eat(/-/),"-"==e.peek()&&(e.eat(/-/),a="keyword a"),"D"==e.peek()&&(e.eat(/[D]/),a="keyword c",t.define=!0),e.eatWhile(/[A-Z]/i),a}return n=e.peek(),0==t.inString&&"'"==n&&(t.inString=!0,e.next()),1==t.inString?(e.skipTo("'")||e.skipToEnd(),"'"==e.peek()&&(e.next(),t.inString=!1),"string"):(e.next(),null)},lineComment:"#"}})),e.defineMIME("text/x-hxml","hxml")},"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror);