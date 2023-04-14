!function(t){var e={propagateSupportedGesture:!1};function n(t){t.hooks.processOptions.push(o)}function o(t,e){var n,o={twoTouches:!1,currentTapStart:{x:0,y:0},currentTapEnd:{x:0,y:0},prevTap:{x:0,y:0},currentTap:{x:0,y:0},interceptedLongTap:!1,isUnsupportedGesture:!1,prevTapTime:null,tapStartTime:null,longTapTriggerId:null},a=20,r=500,u=20,p=1500,c=125;function i(e){var o=t.getOptions();(o.pan.active||o.zoom.active)&&(I(e),n.dispatchEvent(new CustomEvent("touchevent",{detail:e})),D(e)?s(e,"pinch"):(s(e,"pan"),C(e)||(x(e)&&s(e,"doubleTap"),s(e,"tap"),s(e,"longTap"))))}function s(t,e){switch(e){case"pan":h[t.type](t);break;case"pinch":g[t.type](t);break;case"doubleTap":v.onDoubleTap(t);break;case"longTap":l[t.type](t);break;case"tap":m[t.type](t)}}function T(t,e){n=e[0],e[0].addEventListener("touchstart",i,!1),e[0].addEventListener("touchmove",i,!1),e[0].addEventListener("touchend",i,!1)}function d(t,e){e[0].removeEventListener("touchstart",i),e[0].removeEventListener("touchmove",i),e[0].removeEventListener("touchend",i),o.longTapTriggerId&&(clearTimeout(o.longTapTriggerId),o.longTapTriggerId=null)}var h={touchstart:function(t){E(),f(t),w(t),n.dispatchEvent(new CustomEvent("panstart",{detail:t}))},touchmove:function(t){L(t),f(t),y(t),o.isUnsupportedGesture||n.dispatchEvent(new CustomEvent("pandrag",{detail:t}))},touchend:function(t){L(t),C(t)?(n.dispatchEvent(new CustomEvent("pinchend",{detail:t})),n.dispatchEvent(new CustomEvent("panstart",{detail:t}))):b(t)&&n.dispatchEvent(new CustomEvent("panend",{detail:t}))}},g={touchstart:function(t){n.dispatchEvent(new CustomEvent("pinchstart",{detail:t}))},touchmove:function(t){L(t),o.twoTouches=D(t),o.isUnsupportedGesture||n.dispatchEvent(new CustomEvent("pinchdrag",{detail:t}))},touchend:function(t){L(t)}},v={onDoubleTap:function(t){L(t),n.dispatchEvent(new CustomEvent("doubletap",{detail:t}))}},l={touchstart:function(t){l.waitForLongTap(t)},touchmove:function(t){},touchend:function(t){o.longTapTriggerId&&(clearTimeout(o.longTapTriggerId),o.longTapTriggerId=null)},isLongTap:function(t){return(new Date).getTime()-o.tapStartTime>=p&&!o.interceptedLongTap&&S(o.currentTapStart.x,o.currentTapStart.y,o.currentTapEnd.x,o.currentTapEnd.y)<u&&(o.interceptedLongTap=!0,!0)},waitForLongTap:function(t){var e=function(){l.isLongTap(t)&&n.dispatchEvent(new CustomEvent("longtap",{detail:t})),o.longTapTriggerId=null};o.longTapTriggerId||(o.longTapTriggerId=setTimeout(e,p))}},m={touchstart:function(t){o.tapStartTime=(new Date).getTime()},touchmove:function(t){},touchend:function(t){m.isTap(t)&&(n.dispatchEvent(new CustomEvent("tap",{detail:t})),L(t))},isTap:function(t){return(new Date).getTime()-o.tapStartTime<=c&&S(o.currentTapStart.x,o.currentTapStart.y,o.currentTapEnd.x,o.currentTapEnd.y)<u}};function E(){o.prevTap={x:o.currentTap.x,y:o.currentTap.y}}function f(t){o.currentTap={x:t.touches[0].pageX,y:t.touches[0].pageY}}function w(t){o.tapStartTime=(new Date).getTime(),o.interceptedLongTap=!1,o.currentTapStart={x:t.touches[0].pageX,y:t.touches[0].pageY},o.currentTapEnd={x:t.touches[0].pageX,y:t.touches[0].pageY}}function y(t){o.currentTapEnd={x:t.touches[0].pageX,y:t.touches[0].pageY}}function x(t){var e=(new Date).getTime(),n=e-o.prevTapTime;return n>=0&&n<r&&S(o.prevTap.x,o.prevTap.y,o.currentTap.x,o.currentTap.y)<a?(t.firstTouch=o.prevTap,t.secondTouch=o.currentTap,!0):(o.prevTapTime=e,!1)}function L(e){o.isUnsupportedGesture||(e.preventDefault(),t.getOptions().propagateSupportedGesture||e.stopPropagation())}function S(t,e,n,o){return Math.sqrt((t-n)*(t-n)+(e-o)*(e-o))}function b(t){return t.touches&&0===t.touches.length}function C(t){return o.twoTouches&&1===t.touches.length}function I(t){t.touches.length>=3?o.isUnsupportedGesture=!0:o.isUnsupportedGesture=!1}function D(e){return!!(e.touches&&e.touches.length>=2&&e.touches[0].target===t.getEventHolder()&&e.touches[1].target===t.getEventHolder())}(!0===e.pan.enableTouch||e.zoom.enableTouch)&&(t.hooks.bindEvents.push(T),t.hooks.shutdown.push(d))}jQuery.plot.plugins.push({init:n,options:e,name:"navigateTouch",version:"0.3"})}();