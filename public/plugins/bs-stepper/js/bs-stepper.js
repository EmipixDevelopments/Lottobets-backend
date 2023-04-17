/*!
 * bsStepper v1.7.0 (https://github.com/Johann-S/bs-stepper)
 * Copyright 2018 - 2019 Johann-S <johann.servoire@gmail.com>
 * Licensed under MIT (https://github.com/Johann-S/bs-stepper/blob/master/LICENSE)
 */
var t,e;t=this,e=function(){function t(){return t=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=n[s])}return t},t.apply(this,arguments)}var e=window.Element.prototype.matches,n=function(t,e){return t.closest(e)},s=function(t,e){return new window.Event(t,e)},i=function(t,e){return new window.CustomEvent(t,e)};function r(){if(window.Element.prototype.matches||(e=window.Element.prototype.msMatchesSelector||window.Element.prototype.webkitMatchesSelector),window.Element.prototype.closest||(n=function(t,n){if(!document.documentElement.contains(t))return null;do{if(e.call(t,n))return t;t=t.parentElement||t.parentNode}while(null!==t&&1===t.nodeType);return null}),window.Event&&"function"==typeof window.Event||(s=function(t,e){e=e||{};var n=document.createEvent("Event");return n.initEvent(t,Boolean(e.bubbles),Boolean(e.cancelable)),n}),"function"!=typeof window.CustomEvent){var t=window.Event.prototype.preventDefault;i=function(e,n){var s=document.createEvent("CustomEvent");return n=n||{bubbles:!1,cancelable:!1,detail:null},s.initCustomEvent(e,n.bubbles,n.cancelable,n.detail),s.preventDefault=function(){this.cancelable&&(t.call(this),Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}}))},s}}}r();var o=1e3,c={ACTIVE:"active",LINEAR:"linear",BLOCK:"dstepper-block",NONE:"dstepper-none",FADE:"fade",VERTICAL:"vertical"},a="transitionend",l="bsStepper",u=function(t,e,n,s){var r=t[l];if(!r._steps[e].classList.contains(c.ACTIVE)&&!r._stepsContents[e].classList.contains(c.ACTIVE)){var o=i("show.bs-stepper",{cancelable:!0,detail:{from:r._currentIndex,to:e,indexStep:e}});t.dispatchEvent(o);var a=r._steps.filter((function(t){return t.classList.contains(c.ACTIVE)})),u=r._stepsContents.filter((function(t){return t.classList.contains(c.ACTIVE)}));o.defaultPrevented||(a.length&&a[0].classList.remove(c.ACTIVE),u.length&&(u[0].classList.remove(c.ACTIVE),t.classList.contains(c.VERTICAL)||r.options.animation||u[0].classList.remove(c.BLOCK)),p(t,r._steps[e],r._steps,n),d(t,r._stepsContents[e],r._stepsContents,u,s))}},p=function(t,e,n,s){n.forEach((function(e){var n=e.querySelector(s.selectors.trigger);n.setAttribute("aria-selected","false"),t.classList.contains(c.LINEAR)&&n.setAttribute("disabled","disabled")})),e.classList.add(c.ACTIVE);var i=e.querySelector(s.selectors.trigger);i.setAttribute("aria-selected","true"),t.classList.contains(c.LINEAR)&&i.removeAttribute("disabled")},d=function(t,e,n,s,r){var o=t[l],u=n.indexOf(e),p=i("shown.bs-stepper",{cancelable:!0,detail:{from:o._currentIndex,to:u,indexStep:u}});function d(){e.classList.add(c.BLOCK),e.removeEventListener(a,d),t.dispatchEvent(p),r()}if(e.classList.contains(c.FADE)){e.classList.remove(c.NONE);var v=f(e);e.addEventListener(a,d),s.length&&s[0].classList.add(c.NONE),e.classList.add(c.ACTIVE),h(e,v)}else e.classList.add(c.ACTIVE),e.classList.add(c.BLOCK),t.dispatchEvent(p),r()},f=function(t){if(!t)return 0;var e=window.getComputedStyle(t).transitionDuration;return parseFloat(e)?(e=e.split(",")[0],parseFloat(e)*o):0},h=function(t,e){var n=!1,i=e+5;function r(){n=!0,t.removeEventListener(a,r)}t.addEventListener(a,r),window.setTimeout((function(){n||t.dispatchEvent(s(a)),t.removeEventListener(a,r)}),i)},v=function(t,e){e.animation&&t.forEach((function(t){t.classList.add(c.FADE),t.classList.add(c.NONE)}))},E=function(){return function(t){t.preventDefault()}},L=function(t){return function(e){e.preventDefault();var s=n(e.target,t.selectors.steps),i=n(s,t.selectors.stepper),r=i[l],o=r._steps.indexOf(s);u(i,o,t,(function(){r._currentIndex=o}))}},_={linear:!0,animation:!1,selectors:{steps:".step",trigger:".step-trigger",stepper:".bs-stepper"}};return function(){function e(e,n){var s=this;void 0===n&&(n={}),this._element=e,this._currentIndex=0,this._stepsContents=[],this.options=t({},_,{},n),this.options.selectors=t({},_.selectors,{},this.options.selectors),this.options.linear&&this._element.classList.add(c.LINEAR),this._steps=[].slice.call(this._element.querySelectorAll(this.options.selectors.steps)),this._steps.filter((function(t){return t.hasAttribute("data-target")})).forEach((function(t){s._stepsContents.push(s._element.querySelector(t.getAttribute("data-target")))})),v(this._stepsContents,this.options),this._setLinkListeners(),Object.defineProperty(this._element,l,{value:this,writable:!0}),this._steps.length&&u(this._element,this._currentIndex,this.options,(function(){}))}var n=e.prototype;return n._setLinkListeners=function(){var t=this;this._steps.forEach((function(e){var n=e.querySelector(t.options.selectors.trigger);t.options.linear?(t._clickStepLinearListener=E(t.options),n.addEventListener("click",t._clickStepLinearListener)):(t._clickStepNonLinearListener=L(t.options),n.addEventListener("click",t._clickStepNonLinearListener))}))},n.next=function(){var t=this,e=this._currentIndex+1<=this._steps.length-1?this._currentIndex+1:this._steps.length-1;u(this._element,e,this.options,(function(){t._currentIndex=e}))},n.previous=function(){var t=this,e=this._currentIndex-1>=0?this._currentIndex-1:0;u(this._element,e,this.options,(function(){t._currentIndex=e}))},n.to=function(t){var e=this,n=t-1,s=n>=0&&n<this._steps.length?n:0;u(this._element,s,this.options,(function(){e._currentIndex=s}))},n.reset=function(){var t=this;u(this._element,0,this.options,(function(){t._currentIndex=0}))},n.destroy=function(){var t=this;this._steps.forEach((function(e){var n=e.querySelector(t.options.selectors.trigger);t.options.linear?n.removeEventListener("click",t._clickStepLinearListener):n.removeEventListener("click",t._clickStepNonLinearListener)})),this._element[l]=void 0,this._element=void 0,this._currentIndex=void 0,this._steps=void 0,this._stepsContents=void 0,this._clickStepLinearListener=void 0,this._clickStepNonLinearListener=void 0},e}()},"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).Stepper=e();