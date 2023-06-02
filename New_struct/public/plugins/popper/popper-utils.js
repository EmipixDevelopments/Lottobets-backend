/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.16.1
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
function t(t,e){if(1!==t.nodeType)return[];const n=t.ownerDocument.defaultView.getComputedStyle(t,null);return e?n[e]:n}function e(t){return"HTML"===t.nodeName?t:t.parentNode||t.host}function n(o){if(!o)return document.body;switch(o.nodeName){case"HTML":case"BODY":return o.ownerDocument.body;case"#document":return o.body}const{overflow:r,overflowX:i,overflowY:s}=t(o);return/(auto|scroll|overlay)/.test(r+s+i)?o:n(e(o))}function o(t){return t&&t.referenceNode?t.referenceNode:t}var r="undefined"!=typeof window&&"undefined"!=typeof document&&"undefined"!=typeof navigator;const i=r&&!(!window.MSInputMethodContext||!document.documentMode),s=r&&/MSIE 10/.test(navigator.userAgent);function f(t){return 11===t?i:10===t?s:i||s}function u(e){if(!e)return document.documentElement;const n=f(10)?document.body:null;let o=e.offsetParent||null;for(;o===n&&e.nextElementSibling;)o=(e=e.nextElementSibling).offsetParent;const r=o&&o.nodeName;return r&&"BODY"!==r&&"HTML"!==r?-1!==["TH","TD","TABLE"].indexOf(o.nodeName)&&"static"===t(o,"position")?u(o):o:e?e.ownerDocument.documentElement:document.documentElement}function c(t){const{nodeName:e}=t;return"BODY"!==e&&("HTML"===e||u(t.firstElementChild)===t)}function d(t){return null!==t.parentNode?d(t.parentNode):t}function a(t,e){if(!(t&&t.nodeType&&e&&e.nodeType))return document.documentElement;const n=t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING,o=n?t:e,r=n?e:t,i=document.createRange();i.setStart(o,0),i.setEnd(r,0);const{commonAncestorContainer:s}=i;if(t!==s&&e!==s||o.contains(r))return c(s)?s:u(s);const f=d(t);return f.host?a(f.host,e):a(t,d(e).host)}function l(t,e="top"){const n="top"===e?"scrollTop":"scrollLeft",o=t.nodeName;if("BODY"===o||"HTML"===o){const e=t.ownerDocument.documentElement;return(t.ownerDocument.scrollingElement||e)[n]}return t[n]}function m(t,e,n=!1){const o=l(e,"top"),r=l(e,"left"),i=n?-1:1;return t.top+=o*i,t.bottom+=o*i,t.left+=r*i,t.right+=r*i,t}function h(t,e){const n="x"===e?"Left":"Top",o="Left"===n?"Right":"Bottom";return parseFloat(t[`border${n}Width`])+parseFloat(t[`border${o}Width`])}function p(t,e,n,o){return Math.max(e[`offset${t}`],e[`scroll${t}`],n[`client${t}`],n[`offset${t}`],n[`scroll${t}`],f(10)?parseInt(n[`offset${t}`])+parseInt(o["margin"+("Height"===t?"Top":"Left")])+parseInt(o["margin"+("Height"===t?"Bottom":"Right")]):0)}function g(t){const e=t.body,n=t.documentElement,o=f(10)&&getComputedStyle(n);return{height:p("Height",e,n,o),width:p("Width",e,n,o)}}var w=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t};function b(t){return w({},t,{right:t.left+t.width,bottom:t.top+t.height})}function y(e){let n={};try{if(f(10)){n=e.getBoundingClientRect();const t=l(e,"top"),o=l(e,"left");n.top+=t,n.left+=o,n.bottom+=t,n.right+=o}else n=e.getBoundingClientRect()}catch(t){}const o={left:n.left,top:n.top,width:n.right-n.left,height:n.bottom-n.top},r="HTML"===e.nodeName?g(e.ownerDocument):{},i=r.width||e.clientWidth||o.width,s=r.height||e.clientHeight||o.height;let u=e.offsetWidth-i,c=e.offsetHeight-s;if(u||c){const n=t(e);u-=h(n,"x"),c-=h(n,"y"),o.width-=u,o.height-=c}return b(o)}function E(e,o,r=!1){const i=f(10),s="HTML"===o.nodeName,u=y(e),c=y(o),d=n(e),a=t(o),l=parseFloat(a.borderTopWidth),h=parseFloat(a.borderLeftWidth);r&&s&&(c.top=Math.max(c.top,0),c.left=Math.max(c.left,0));let p=b({top:u.top-c.top-l,left:u.left-c.left-h,width:u.width,height:u.height});if(p.marginTop=0,p.marginLeft=0,!i&&s){const t=parseFloat(a.marginTop),e=parseFloat(a.marginLeft);p.top-=l-t,p.bottom-=l-t,p.left-=h-e,p.right-=h-e,p.marginTop=t,p.marginLeft=e}return(i&&!r?o.contains(d):o===d&&"BODY"!==d.nodeName)&&(p=m(p,o)),p}function O(t,e=!1){const n=t.ownerDocument.documentElement,o=E(t,n),r=Math.max(n.clientWidth,window.innerWidth||0),i=Math.max(n.clientHeight,window.innerHeight||0),s=e?0:l(n),f=e?0:l(n,"left");return b({top:s-o.top+o.marginTop,left:f-o.left+o.marginLeft,width:r,height:i})}function v(n){const o=n.nodeName;if("BODY"===o||"HTML"===o)return!1;if("fixed"===t(n,"position"))return!0;const r=e(n);return!!r&&v(r)}function N(e){if(!e||!e.parentElement||f())return document.documentElement;let n=e.parentElement;for(;n&&"none"===t(n,"transform");)n=n.parentElement;return n||document.documentElement}function L(t,r,i,s,f=!1){let u={top:0,left:0};const c=f?N(t):a(t,o(r));if("viewport"===s)u=O(c,f);else{let o;"scrollParent"===s?(o=n(e(r)),"BODY"===o.nodeName&&(o=t.ownerDocument.documentElement)):o="window"===s?t.ownerDocument.documentElement:s;const i=E(o,c,f);if("HTML"!==o.nodeName||v(c))u=i;else{const{height:e,width:n}=g(t.ownerDocument);u.top+=i.top-i.marginTop,u.bottom=e+i.top,u.left+=i.left-i.marginLeft,u.right=n+i.left}}const d="number"==typeof(i=i||0);return u.left+=d?i:i.left||0,u.top+=d?i:i.top||0,u.right-=d?i:i.right||0,u.bottom-=d?i:i.bottom||0,u}function T({width:t,height:e}){return t*e}function x(t,e,n,o,r,i=0){if(-1===t.indexOf("auto"))return t;const s=L(n,o,i,r),f={top:{width:s.width,height:e.top-s.top},right:{width:s.right-e.right,height:s.height},bottom:{width:s.width,height:s.bottom-e.bottom},left:{width:e.left-s.left,height:s.height}},u=Object.keys(f).map((t=>w({key:t},f[t],{area:T(f[t])}))).sort(((t,e)=>e.area-t.area)),c=u.filter((({width:t,height:e})=>t>=n.clientWidth&&e>=n.clientHeight)),d=c.length>0?c[0].key:u[0].key,a=t.split("-")[1];return d+(a?`-${a}`:"")}const M=function(){const t=["Edge","Trident","Firefox"];for(let e=0;e<t.length;e+=1)if(r&&navigator.userAgent.indexOf(t[e])>=0)return 1;return 0}();function B(t){let e=!1;return()=>{e||(e=!0,window.Promise.resolve().then((()=>{e=!1,t()})))}}function S(t){let e=!1;return()=>{e||(e=!0,setTimeout((()=>{e=!1,t()}),M))}}var D=r&&window.Promise?B:S;function P(t,e){return Array.prototype.find?t.find(e):t.filter(e)[0]}function H(t,e,n){if(Array.prototype.findIndex)return t.findIndex((t=>t[e]===n));const o=P(t,(t=>t[e]===n));return t.indexOf(o)}function R(t){let e;if("HTML"===t.nodeName){const{width:n,height:o}=g(t.ownerDocument);e={width:n,height:o,left:0,top:0}}else e={width:t.offsetWidth,height:t.offsetHeight,left:t.offsetLeft,top:t.offsetTop};return b(e)}function F(t){const e=t.ownerDocument.defaultView.getComputedStyle(t),n=parseFloat(e.marginTop||0)+parseFloat(e.marginBottom||0),o=parseFloat(e.marginLeft||0)+parseFloat(e.marginRight||0);return{width:t.offsetWidth+o,height:t.offsetHeight+n}}function C(t){const e={left:"right",right:"left",bottom:"top",top:"bottom"};return t.replace(/left|right|bottom|top/g,(t=>e[t]))}function W(t,e,n){n=n.split("-")[0];const o=F(t),r={width:o.width,height:o.height},i=-1!==["right","left"].indexOf(n),s=i?"top":"left",f=i?"left":"top",u=i?"height":"width",c=i?"width":"height";return r[s]=e[s]+e[u]/2-o[u]/2,r[f]=n===f?e[f]-o[c]:e[C(f)],r}function $(t,e,n,r=null){return E(n,r?N(e):a(e,o(n)),r)}function A(t){const e=[!1,"ms","Webkit","Moz","O"],n=t.charAt(0).toUpperCase()+t.slice(1);for(let o=0;o<e.length;o++){const r=e[o],i=r?`${r}${n}`:t;if(void 0!==document.body.style[i])return i}return null}function I(t){return t&&"[object Function]"==={}.toString.call(t)}function z(t,e){return t.some((({name:t,enabled:n})=>n&&t===e))}function Y(t,e,n){const o=P(t,(({name:t})=>t===e)),r=!!o&&t.some((t=>t.name===n&&t.enabled&&t.order<o.order));if(!r){const t=`\`${e}\``,o=`\`${n}\``;console.warn(`${o} modifier is required by ${t} modifier in order to work, be sure to include it before ${t}!`)}return r}function k(t){return""!==t&&!isNaN(parseFloat(t))&&isFinite(t)}function j(t){const e=t.ownerDocument;return e?e.defaultView:window}function V(t,e){return j(t).removeEventListener("resize",e.updateBound),e.scrollParents.forEach((t=>{t.removeEventListener("scroll",e.updateBound)})),e.updateBound=null,e.scrollParents=[],e.scrollElement=null,e.eventsEnabled=!1,e}function q(t,e,n){return(void 0===n?t:t.slice(0,H(t,"name",n))).forEach((t=>{t.function&&console.warn("`modifier.function` is deprecated, use `modifier.fn`!");const n=t.function||t.fn;t.enabled&&I(n)&&(e.offsets.popper=b(e.offsets.popper),e.offsets.reference=b(e.offsets.reference),e=n(e,t))})),e}function U(t,e){Object.keys(e).forEach((function(n){!1!==e[n]?t.setAttribute(n,e[n]):t.removeAttribute(n)}))}function _(t,e){Object.keys(e).forEach((n=>{let o="";-1!==["width","height","top","right","bottom","left"].indexOf(n)&&k(e[n])&&(o="px"),t.style[n]=e[n]+o}))}function G(t,e,o,r){const i="BODY"===t.nodeName,s=i?t.ownerDocument.defaultView:t;s.addEventListener(e,o,{passive:!0}),i||G(n(s.parentNode),e,o,r),r.push(s)}function X(t,e,o,r){o.updateBound=r,j(t).addEventListener("resize",o.updateBound,{passive:!0});const i=n(t);return G(i,"scroll",o.updateBound,o.scrollParents),o.scrollElement=i,o.eventsEnabled=!0,o}var J={computeAutoPlacement:x,debounce:D,findIndex:H,getBordersSize:h,getBoundaries:L,getBoundingClientRect:y,getClientRect:b,getOffsetParent:u,getOffsetRect:R,getOffsetRectRelativeToArbitraryNode:E,getOuterSizes:F,getParentNode:e,getPopperOffsets:W,getReferenceOffsets:$,getScroll:l,getScrollParent:n,getStyleComputedProperty:t,getSupportedPropertyName:A,getWindowSizes:g,isFixed:v,isFunction:I,isModifierEnabled:z,isModifierRequired:Y,isNumeric:k,removeEventListeners:V,runModifiers:q,setAttributes:U,setStyles:_,setupEventListeners:X};export{x as computeAutoPlacement,D as debounce,H as findIndex,h as getBordersSize,L as getBoundaries,y as getBoundingClientRect,b as getClientRect,u as getOffsetParent,R as getOffsetRect,E as getOffsetRectRelativeToArbitraryNode,F as getOuterSizes,e as getParentNode,W as getPopperOffsets,$ as getReferenceOffsets,l as getScroll,n as getScrollParent,t as getStyleComputedProperty,A as getSupportedPropertyName,g as getWindowSizes,v as isFixed,I as isFunction,z as isModifierEnabled,Y as isModifierRequired,k as isNumeric,V as removeEventListeners,q as runModifiers,U as setAttributes,_ as setStyles,X as setupEventListeners};export default J;