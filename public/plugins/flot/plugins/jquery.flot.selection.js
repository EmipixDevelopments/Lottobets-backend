!function(e){function t(t){var o={first:{x:-1,y:-1},second:{x:-1,y:-1},show:!1,currentMode:"xy",active:!1},n=e.plot.uiConstants.SNAPPING_CONSTANT,i={};function r(e){o.active&&(h(e),t.getPlaceholder().trigger("plotselecting",[a()]))}function l(e){var n=t.getOptions();1===e.which&&null!==n.selection.mode&&(o.currentMode="xy",document.body.focus(),void 0!==document.onselectstart&&null==i.onselectstart&&(i.onselectstart=document.onselectstart,document.onselectstart=function(){return!1}),void 0!==document.ondrag&&null==i.ondrag&&(i.ondrag=document.ondrag,document.ondrag=function(){return!1}),g(o.first,e),o.active=!0)}function s(e){return void 0!==document.onselectstart&&(document.onselectstart=i.onselectstart),void 0!==document.ondrag&&(document.ondrag=i.ondrag),o.active=!1,h(e),T()?c():(t.getPlaceholder().trigger("plotunselected",[]),t.getPlaceholder().trigger("plotselecting",[null])),!1}function a(){if(!T())return null;if(!o.show)return null;var n={},i={x:o.first.x,y:o.first.y},r={x:o.second.x,y:o.second.y};return"x"===f(t)&&(i.y=0,r.y=t.height()),"y"===f(t)&&(i.x=0,r.x=t.width()),e.each(t.getAxes(),(function(e,t){if(t.used){var o=t.c2p(i[t.direction]),l=t.c2p(r[t.direction]);n[e]={from:Math.min(o,l),to:Math.max(o,l)}}})),n}function c(){var e=a();t.getPlaceholder().trigger("plotselected",[e]),e.xaxis&&e.yaxis&&t.getPlaceholder().trigger("selected",[{x1:e.xaxis.from,y1:e.yaxis.from,x2:e.xaxis.to,y2:e.yaxis.to}])}function d(e,t,o){return t<e?e:t>o?o:t}function f(e){var t=e.getOptions();return"smart"===t.selection.mode?o.currentMode:t.selection.mode}function u(e){if(o.first){var t={x:e.x-o.first.x,y:e.y-o.first.y};Math.abs(t.x)<n?o.currentMode="y":Math.abs(t.y)<n?o.currentMode="x":o.currentMode="xy"}}function g(e,n){var i=t.getPlaceholder().offset(),r=t.getPlotOffset();e.x=d(0,n.pageX-i.left-r.left,t.width()),e.y=d(0,n.pageY-i.top-r.top,t.height()),e!==o.first&&u(e),"y"===f(t)&&(e.x=e===o.first?0:t.width()),"x"===f(t)&&(e.y=e===o.first?0:t.height())}function h(e){null!=e.pageX&&(g(o.second,e),T()?(o.show=!0,t.triggerRedrawOverlay()):x(!0))}function x(e){o.show&&(o.show=!1,o.currentMode="",t.triggerRedrawOverlay(),e||t.getPlaceholder().trigger("plotunselected",[]))}function y(e,o){var n,i,r,l,s=t.getAxes();for(var a in s)if((n=s[a]).direction===o&&(e[l=o+n.n+"axis"]||1!==n.n||(l=o+"axis"),e[l])){i=e[l].from,r=e[l].to;break}if(e[l]||(n="x"===o?t.getXAxes()[0]:t.getYAxes()[0],i=e[o+"1"],r=e[o+"2"]),null!=i&&null!=r&&i>r){var c=i;i=r,r=c}return{from:i,to:r,axis:n}}function v(e,n){var i;"y"===f(t)?(o.first.x=0,o.second.x=t.width()):(i=y(e,"x"),o.first.x=i.axis.p2c(i.from),o.second.x=i.axis.p2c(i.to)),"x"===f(t)?(o.first.y=0,o.second.y=t.height()):(i=y(e,"y"),o.first.y=i.axis.p2c(i.from),o.second.y=i.axis.p2c(i.to)),o.show=!0,t.triggerRedrawOverlay(),!n&&T()&&c()}function T(){var e=t.getOptions().selection.minSize;return Math.abs(o.second.x-o.first.x)>=e&&Math.abs(o.second.y-o.first.y)>=e}function m(e,t,o,n,i,r,l,s){var a=3,c=15,d=Math.max(0,Math.min(c,n/2-2,i/2-2));e.fillStyle="#ffffff","xy"===s&&(e.beginPath(),e.moveTo(t,o+d),e.lineTo(t-3,o+d),e.lineTo(t-3,o-3),e.lineTo(t+d,o-3),e.lineTo(t+d,o),e.lineTo(t,o),e.closePath(),e.moveTo(t,o+i-d),e.lineTo(t-3,o+i-d),e.lineTo(t-3,o+i+3),e.lineTo(t+d,o+i+3),e.lineTo(t+d,o+i),e.lineTo(t,o+i),e.closePath(),e.moveTo(t+n,o+d),e.lineTo(t+n+3,o+d),e.lineTo(t+n+3,o-3),e.lineTo(t+n-d,o-3),e.lineTo(t+n-d,o),e.lineTo(t+n,o),e.closePath(),e.moveTo(t+n,o+i-d),e.lineTo(t+n+3,o+i-d),e.lineTo(t+n+3,o+i+3),e.lineTo(t+n-d,o+i+3),e.lineTo(t+n-d,o+i),e.lineTo(t+n,o+i),e.closePath(),e.stroke(),e.fill()),t=r,o=l,"x"===s&&(e.beginPath(),e.moveTo(t,o+c),e.lineTo(t,o-c),e.lineTo(t-a,o-c),e.lineTo(t-a,o+c),e.closePath(),e.moveTo(t+n,o+c),e.lineTo(t+n,o-c),e.lineTo(t+n+a,o-c),e.lineTo(t+n+a,o+c),e.closePath(),e.stroke(),e.fill()),"y"===s&&(e.beginPath(),e.moveTo(t-c,o),e.lineTo(t+c,o),e.lineTo(t+c,o-a),e.lineTo(t-c,o-a),e.closePath(),e.moveTo(t-c,o+i),e.lineTo(t+c,o+i),e.lineTo(t+c,o+i+a),e.lineTo(t-c,o+i+a),e.closePath(),e.stroke(),e.fill())}t.clearSelection=x,t.setSelection=v,t.getSelection=a,t.hooks.bindEvents.push((function(e,t){null!=e.getOptions().selection.mode&&(e.addEventHandler("dragstart",l,t,0),e.addEventHandler("drag",r,t,0),e.addEventHandler("dragend",s,t,0))})),t.hooks.drawOverlay.push((function(t,n){if(o.show&&T()){var i=t.getPlotOffset(),r=t.getOptions();n.save(),n.translate(i.left,i.top);var l=e.color.parse(r.selection.color),s=r.selection.visualization,a=r.selection.displaySelectionDecorations,c=1;"fill"===s&&(c=.8),n.strokeStyle=l.scale("a",c).toString(),n.lineWidth=1,n.lineJoin=r.selection.shape,n.fillStyle=l.scale("a",.4).toString();var d=Math.min(o.first.x,o.second.x)+.5,u=d,g=Math.min(o.first.y,o.second.y)+.5,h=g,x=Math.abs(o.second.x-o.first.x)-1,y=Math.abs(o.second.y-o.first.y)-1;"x"===f(t)&&(y+=g,g=0),"y"===f(t)&&(x+=d,d=0),"fill"===s?(n.fillRect(d,g,x,y),n.strokeRect(d,g,x,y)):(n.fillRect(0,0,t.width(),t.height()),n.clearRect(d,g,x,y),a&&m(n,d,g,x,y,u,h,f(t))),n.restore()}})),t.hooks.shutdown.push((function(e,t){t.unbind("dragstart",l),t.unbind("drag",r),t.unbind("dragend",s)}))}e.plot.plugins.push({init:t,options:{selection:{mode:null,visualization:"focus",displaySelectionDecorations:!0,color:"#888888",shape:"round",minSize:5}},name:"selection",version:"1.1"})}(jQuery);