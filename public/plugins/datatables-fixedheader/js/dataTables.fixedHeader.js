/*! FixedHeader 3.2.1
 * ©2009-2021 SpryMedia Ltd - datatables.net/license
 */
/**
 * @summary     FixedHeader
 * @description Fix a table's header or footer, so it is always visible while
 *              scrolling
 * @version     3.2.1
 * @file        dataTables.fixedHeader.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2009-2021 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
var t;t=function(t,e,o,i){var s=t.fn.dataTable,a=0,n=function(o,i){if(!(this instanceof n))throw"FixedHeader must be initialised with the 'new' keyword.";!0===i&&(i={}),o=new s.Api(o),this.c=t.extend(!0,{},n.defaults,i),this.s={dt:o,position:{theadTop:0,tbodyTop:0,tfootTop:0,tfootBottom:0,width:0,left:0,tfootHeight:0,theadHeight:0,windowHeight:t(e).height(),visible:!0},headerMode:null,footerMode:null,autoWidth:o.settings()[0].oFeatures.bAutoWidth,namespace:".dtfc"+a++,scrollLeft:{header:-1,footer:-1},enable:!0},this.dom={floatingHeader:null,thead:t(o.table().header()),tbody:t(o.table().body()),tfoot:t(o.table().footer()),header:{host:null,floating:null,floatingParent:t('<div class="dtfh-floatingparent">'),placeholder:null},footer:{host:null,floating:null,floatingParent:t('<div class="dtfh-floatingparent">'),placeholder:null}},this.dom.header.host=this.dom.thead.parent(),this.dom.footer.host=this.dom.tfoot.parent();var f=o.settings()[0];if(f._fixedHeader)throw"FixedHeader already initialised on table "+f.nTable.id;f._fixedHeader=this,this._constructor()};return t.extend(n.prototype,{destroy:function(){this.s.dt.off(".dtfc"),t(e).off(this.s.namespace),this.c.header&&this._modeChange("in-place","header",!0),this.c.footer&&this.dom.tfoot.length&&this._modeChange("in-place","footer",!0)},enable:function(t,e){this.s.enable=t,(e||e===i)&&(this._positions(),this._scroll(!0))},enabled:function(){return this.s.enable},headerOffset:function(t){return t!==i&&(this.c.headerOffset=t,this.update()),this.c.headerOffset},footerOffset:function(t){return t!==i&&(this.c.footerOffset=t,this.update()),this.c.footerOffset},update:function(e){var o=this.s.dt.table().node();t(o).is(":visible")?this.enable(!0,!1):this.enable(!1,!1),0!==t(o).children("thead").length&&(this._positions(),this._scroll(e===i||e))},_constructor:function(){var o=this,i=this.s.dt;t(e).on("scroll"+this.s.namespace,(function(){o._scroll()})).on("resize"+this.s.namespace,s.util.throttle((function(){o.s.position.windowHeight=t(e).height(),o.update()}),50));var a=t(".fh-fixedHeader");!this.c.headerOffset&&a.length&&(this.c.headerOffset=a.outerHeight());var n=t(".fh-fixedFooter");!this.c.footerOffset&&n.length&&(this.c.footerOffset=n.outerHeight()),i.on("column-reorder.dt.dtfc column-visibility.dt.dtfc column-sizing.dt.dtfc responsive-display.dt.dtfc",(function(t,e){o.update()})).on("draw.dt.dtfc",(function(t,e){o.update(e!==i.settings()[0])})),i.on("destroy.dtfc",(function(){o.destroy()})),this._positions(),this._scroll()},_clone:function(e,o){var i=this.s.dt,s=this.dom[e],a="header"===e?this.dom.thead:this.dom.tfoot;if("footer"!==e||!this._scrollEnabled())if(!o&&s.floating)s.floating.removeClass("fixedHeader-floating fixedHeader-locked");else{s.floating&&(null!==s.placeholder&&s.placeholder.remove(),this._unsize(e),s.floating.children().detach(),s.floating.remove());var n=t(i.table().node()),f=t(n.parent()),r=this._scrollEnabled();s.floating=t(i.table().node().cloneNode(!1)).attr("aria-hidden","true").css({"table-layout":"fixed",top:0,left:0}).removeAttr("id").append(a),s.floatingParent.css({width:f.width(),overflow:"hidden",height:"fit-content",position:"fixed",left:r?n.offset().left+f.scrollLeft():0}).css("header"===e?{top:this.c.headerOffset,bottom:""}:{top:"",bottom:this.c.footerOffset}).addClass("footer"===e?"dtfh-floatingparentfoot":"dtfh-floatingparenthead").append(s.floating).appendTo("body"),this._stickyPosition(s.floating,"-");var d=()=>{var t=f.scrollLeft();this.s.scrollLeft={footer:t,header:t},s.floatingParent.scrollLeft(this.s.scrollLeft.header)};d(),f.scroll(d),s.placeholder=a.clone(!1),s.placeholder.find("*[id]").removeAttr("id"),s.host.prepend(s.placeholder),this._matchWidths(s.placeholder,s.floating)}},_stickyPosition(e,o){if(this._scrollEnabled()){var i=this,s="rtl"===t(i.s.dt.table().node()).css("direction");e.find("th").each((function(){if("sticky"===t(this).css("position")){var e=t(this).css("right"),a=t(this).css("left");if("auto"===e||s)"auto"!==a&&s&&(n=+a.replace(/px/g,"")+("-"===o?-1:1)*i.s.dt.settings()[0].oBrowser.barWidth,t(this).css("left",n>0?n:0));else{var n=+e.replace(/px/g,"")+("-"===o?-1:1)*i.s.dt.settings()[0].oBrowser.barWidth;t(this).css("right",n>0?n:0)}}}))}},_matchWidths:function(e,o){var i=function(o){return t(o,e).map((function(){return 1*t(this).css("width").replace(/[^\d\.]/g,"")})).toArray()},s=function(e,i){t(e,o).each((function(e){t(this).css({width:i[e],minWidth:i[e]})}))},a=i("th"),n=i("td");s("th",a),s("td",n)},_unsize:function(e){var o=this.dom[e].floating;o&&("footer"===e||"header"===e&&!this.s.autoWidth)?t("th, td",o).css({width:"",minWidth:""}):o&&"header"===e&&t("th, td",o).css("min-width","")},_horizontal:function(e,o){var i=this.dom[e],s=(this.s.position,this.s.scrollLeft);if(i.floating&&s[e]!==o){if(this._scrollEnabled()){var a=t(t(this.s.dt.table().node()).parent()).scrollLeft();i.floating.scrollLeft(a),i.floatingParent.scrollLeft(a)}s[e]=o}},_modeChange:function(i,s,a){this.s.dt;var n=this.dom[s],f=this.s.position,r=this._scrollEnabled();if("footer"!==s||!r){var d=function(t){n.floating.attr("style",(function(e,o){return(o||"")+"width: "+t+"px !important;"})),r||n.floatingParent.attr("style",(function(e,o){return(o||"")+"width: "+t+"px !important;"}))},h=this.dom["footer"===s?"tfoot":"thead"],l=t.contains(h[0],o.activeElement)?o.activeElement:null,c=t(t(this.s.dt.table().node()).parent());if("in-place"===i)n.placeholder&&(n.placeholder.remove(),n.placeholder=null),this._unsize(s),"header"===s?n.host.prepend(h):n.host.append(h),n.floating&&(n.floating.remove(),n.floating=null,this._stickyPosition(n.host,"+")),n.floatingParent&&n.floatingParent.remove(),t(t(n.host.parent()).parent()).scrollLeft(c.scrollLeft());else if("in"===i){this._clone(s,a);var p=c.offset(),g=t(o).scrollTop(),u=g+t(e).height(),b=r?p.top:f.tbodyTop,m=r?p.top+c.outerHeight():f.tfootTop,v="footer"===s?b>u?f.tfootHeight:b+f.tfootHeight-u:g+this.c.headerOffset+f.theadHeight-m,H="header"===s?"top":"bottom",x=this.c[s+"Offset"]-(v>0?v:0);n.floating.addClass("fixedHeader-floating"),n.floatingParent.css(H,x).css({left:f.left,height:"header"===s?f.theadHeight:f.tfootHeight,"z-index":2}).append(n.floating),d(f.width),"footer"===s&&n.floating.css("top","")}else"below"===i?(this._clone(s,a),n.floating.addClass("fixedHeader-locked"),n.floatingParent.css({position:"absolute",top:f.tfootTop-f.theadHeight,left:f.left+"px"}),d(f.width)):"above"===i&&(this._clone(s,a),n.floating.addClass("fixedHeader-locked"),n.floatingParent.css({position:"absolute",top:f.tbodyTop,left:f.left+"px"}),d(f.width));l&&l!==o.activeElement&&setTimeout((function(){l.focus()}),10),this.s.scrollLeft.header=-1,this.s.scrollLeft.footer=-1,this.s[s+"Mode"]=i}},_positions:function(){var e=this.s.dt,o=e.table(),i=this.s.position,s=this.dom,a=t(o.node()),n=this._scrollEnabled(),f=t(e.table().header()),r=t(e.table().footer()),d=s.tbody,h=a.parent();i.visible=a.is(":visible"),i.width=a.outerWidth(),i.left=a.offset().left,i.theadTop=f.offset().top,i.tbodyTop=n?h.offset().top:d.offset().top,i.tbodyHeight=n?h.outerHeight():d.outerHeight(),i.theadHeight=f.outerHeight(),i.theadBottom=i.theadTop+i.theadHeight,r.length?(i.tfootTop=i.tbodyTop+i.tbodyHeight,i.tfootBottom=i.tfootTop+r.outerHeight(),i.tfootHeight=r.outerHeight()):(i.tfootTop=i.tbodyTop+d.outerHeight(),i.tfootBottom=i.tfootTop,i.tfootHeight=i.tfootTop)},_scroll:function(s){var a,n,f=this._scrollEnabled(),r=(H=t(this.s.dt.table().node()).parent()).offset(),d=H.outerHeight(),h=t(o).scrollLeft(),l=t(o).scrollTop(),c=t(e).height(),p=c+l,g=this.s.position,u=f?r.top:g.tbodyTop,b=f?r.left:g.left,m=f?r.top+d:g.tfootTop,v=f?H.outerWidth():g.tbodyWidth;if(p=l+c,this.c.header){if(this.s.enable)if(!g.visible||l+this.c.headerOffset+g.theadHeight<=u)a="in-place";else if(l+this.c.headerOffset+g.theadHeight>u&&l+this.c.headerOffset<m){a="in";var H=t(t(this.s.dt.table().node()).parent());l+this.c.headerOffset+g.theadHeight>m||this.dom.header.floatingParent===i?s=!0:this.dom.header.floatingParent.css({top:this.c.headerOffset,position:"fixed"}).append(this.dom.header.floating)}else a="below";else a="in-place";(s||a!==this.s.headerMode)&&this._modeChange(a,"header",s),this._horizontal("header",h)}var x={offset:{top:0,left:0},height:0},_={offset:{top:0,left:0},height:0};if(this.c.footer&&this.dom.tfoot.length){this.s.enable?!g.visible||g.tfootBottom+this.c.footerOffset<=p?n="in-place":m+g.tfootHeight+this.c.footerOffset>p&&u+this.c.footerOffset<p?(n="in",s=!0):n="above":n="in-place",(s||n!==this.s.footerMode)&&this._modeChange(n,"footer",s),this._horizontal("footer",h);var w=t=>({offset:t.offset(),height:t.outerHeight()});if(x=this.dom.header.floating?w(this.dom.header.floating):w(this.dom.thead),_=this.dom.footer.floating?w(this.dom.footer.floating):w(this.dom.tfoot),f&&_.offset.top>l){var y=l-r.top,T=p+(y>-x.height?y:0)-(x.offset.top+(y<-x.height?x.height:0)+_.height);T<0&&(T=0),H.outerHeight(T),Math.round(H.outerHeight())>=Math.round(T)?t(this.dom.tfoot.parent()).addClass("fixedHeader-floating"):t(this.dom.tfoot.parent()).removeClass("fixedHeader-floating")}}if(this.dom.header.floating&&this.dom.header.floatingParent.css("left",b-h),this.dom.footer.floating&&this.dom.footer.floatingParent.css("left",b-h),this.s.dt.settings()[0]._fixedColumns!==i){var O=(e,o,s)=>{if(s===i){let i=t("div.dtfc-"+e+"-"+o+"-blocker");s=0===i.length?null:i.clone().appendTo("body").css("z-index",1)}return null!==s&&s.css({top:"top"===o?x.offset.top:_.offset.top,left:"right"===e?b+v-s.width():b}),s};this.dom.header.rightBlocker=O("right","top",this.dom.header.rightBlocker),this.dom.header.leftBlocker=O("left","top",this.dom.header.leftBlocker),this.dom.footer.rightBlocker=O("right","bottom",this.dom.footer.rightBlocker),this.dom.footer.leftBlocker=O("left","bottom",this.dom.footer.leftBlocker)}},_scrollEnabled:function(){var t=this.s.dt.settings()[0].oScroll;return""!==t.sY||""!==t.sX}}),n.version="3.2.1",n.defaults={header:!0,footer:!1,headerOffset:0,footerOffset:0},t.fn.dataTable.FixedHeader=n,t.fn.DataTable.FixedHeader=n,t(o).on("init.dt.dtfh",(function(e,o,i){if("dt"===e.namespace){var a=o.oInit.fixedHeader,f=s.defaults.fixedHeader;if((a||f)&&!o._fixedHeader){var r=t.extend({},f,a);!1!==a&&new n(o,r)}}})),s.Api.register("fixedHeader()",(function(){})),s.Api.register("fixedHeader.adjust()",(function(){return this.iterator("table",(function(t){var e=t._fixedHeader;e&&e.update()}))})),s.Api.register("fixedHeader.enable()",(function(t){return this.iterator("table",(function(e){var o=e._fixedHeader;t=t===i||t,o&&t!==o.enabled()&&o.enable(t)}))})),s.Api.register("fixedHeader.enabled()",(function(){if(this.context.length){var t=this.context[0]._fixedHeader;if(t)return t.enabled()}return!1})),s.Api.register("fixedHeader.disable()",(function(){return this.iterator("table",(function(t){var e=t._fixedHeader;e&&e.enabled()&&e.enable(!1)}))})),t.each(["header","footer"],(function(t,e){s.Api.register("fixedHeader."+e+"Offset()",(function(t){var o=this.context;return t===i?o.length&&o[0]._fixedHeader?o[0]._fixedHeader[e+"Offset"]():i:this.iterator("table",(function(o){var i=o._fixedHeader;i&&i[e+"Offset"](t)}))}))})),n},"function"==typeof define&&define.amd?define(["jquery","datatables.net"],(function(e){return t(e,window,document)})):"object"==typeof exports?module.exports=function(e,o){return e||(e=window),o&&o.fn.dataTable||(o=require("datatables.net")(e,o).$),t(o,e,e.document)}:t(jQuery,window,document);