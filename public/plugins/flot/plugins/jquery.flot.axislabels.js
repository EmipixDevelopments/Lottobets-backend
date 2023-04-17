!function(t){var i={axisLabels:{show:!0}};function e(t,i,e,s,a,h){this.axisName=t,this.position=i,this.padding=e,this.placeholder=s,this.axisLabel=a,this.surface=h,this.width=0,this.height=0,this.elem=null}function s(i){i.hooks.processOptions.push((function(i,s){if(s.axisLabels.show){var a={},h=2;i.hooks.axisReserveSpace.push((function(t,i){var s=i.options,o=i.direction+i.n;if(i.labelHeight+=i.boxPosition.centerY,i.labelWidth+=i.boxPosition.centerX,s&&s.axisLabel&&i.show){var n=void 0===s.axisLabelPadding?h:s.axisLabelPadding,l=a[o];l||(l=new e(o,s.position,n,t.getPlaceholder()[0],s.axisLabel,t.getSurface()),a[o]=l),l.calculateSize(),i.labelHeight+=l.height,i.labelWidth+=l.width}})),i.hooks.draw.push((function(i,e){t.each(i.getAxes(),(function(t,i){var e=i.options;if(e&&e.axisLabel&&i.show){var s=i.direction+i.n;a[s].draw(i.box)}}))})),i.hooks.shutdown.push((function(t,i){for(var e in a)a[e].cleanup()}))}}))}e.prototype.calculateSize=function(){var t=this.axisName+"Label",i=t+"Layer",e=t+" axisLabels",s=this.surface.getTextInfo(i,this.axisLabel,e);this.labelWidth=s.width,this.labelHeight=s.height,"left"===this.position||"right"===this.position?(this.width=this.labelHeight+this.padding,this.height=0):(this.width=0,this.height=this.labelHeight+this.padding)},e.prototype.transforms=function(t,i,e,s){var a,h,o=[];if(0===i&&0===e||((a=s.createSVGTransform()).setTranslate(i,e),o.push(a)),0!==t){h=s.createSVGTransform();var n=Math.round(this.labelWidth/2),l=0;h.setRotate(t,n,l),o.push(h)}return o},e.prototype.calculateOffsets=function(t){var i={x:0,y:0,degrees:0};return"bottom"===this.position?(i.x=t.left+t.width/2-this.labelWidth/2,i.y=t.top+t.height-this.labelHeight):"top"===this.position?(i.x=t.left+t.width/2-this.labelWidth/2,i.y=t.top):"left"===this.position?(i.degrees=-90,i.x=t.left-this.labelWidth/2,i.y=t.height/2+t.top):"right"===this.position&&(i.degrees=90,i.x=t.left+t.width-this.labelWidth/2,i.y=t.height/2+t.top),i.x=Math.round(i.x),i.y=Math.round(i.y),i},e.prototype.cleanup=function(){var t=this.axisName+"Label",i=t+"Layer",e=t+" axisLabels";this.surface.removeText(i,0,0,this.axisLabel,e)},e.prototype.draw=function(t){var i=this.axisName+"Label",e=i+"Layer",s=i+" axisLabels",a=this.calculateOffsets(t),h={position:"absolute",bottom:"",right:"",display:"inline-block","white-space":"nowrap"},o=this.surface.getSVGLayer(e),n=this.transforms(a.degrees,a.x,a.y,o.parentNode);this.surface.addText(e,0,0,this.axisLabel,s,void 0,void 0,void 0,void 0,n),this.surface.render(),Object.keys(h).forEach((function(t){o.style[t]=h[t]}))},t.plot.plugins.push({init:s,options:i,name:"axisLabels",version:"3.0"})}(jQuery);