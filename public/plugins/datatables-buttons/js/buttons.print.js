/*!
 * Print button for Buttons and DataTables.
 * 2016 SpryMedia Ltd - datatables.net/license
 */
var t;t=function(t,e,n,o){var r=t.fn.dataTable,a=n.createElement("a"),i=function(e){var n=t(e).clone()[0];return"link"===n.nodeName.toLowerCase()&&(n.href=s(n.href)),n.outerHTML},s=function(t){a.href=t;var e=a.host;return-1===e.indexOf("/")&&0!==a.pathname.indexOf("/")&&(e+="/"),a.protocol+"//"+e+a.pathname+a.search};return r.ext.buttons.print={className:"buttons-print",text:function(t){return t.i18n("buttons.print","Print")},action:function(n,r,a,u){var d=r.buttons.exportData(t.extend({decodeEntities:!1},u.exportOptions)),l=r.buttons.exportInfo(u),c=r.columns(u.exportOptions.columns).flatten().map((function(t){return r.settings()[0].aoColumns[r.column(t).index()].sClass})).toArray(),f=function(t,e){for(var n="<tr>",r=0,a=t.length;r<a;r++){var i=null===t[r]||t[r]===o?"":t[r];n+="<"+e+" "+(c[r]?'class="'+c[r]+'"':"")+">"+i+"</"+e+">"}return n+"</tr>"},m='<table class="'+r.table().node().className+'">';u.header&&(m+="<thead>"+f(d.header,"th")+"</thead>"),m+="<tbody>";for(var b=0,p=d.body.length;b<p;b++)m+=f(d.body[b],"td");m+="</tbody>",u.footer&&d.footer&&(m+="<tfoot>"+f(d.footer,"th")+"</tfoot>"),m+="</table>";var h=e.open("","");if(h){h.document.close();var v="<title>"+l.title+"</title>";t("style, link").each((function(){v+=i(this)}));try{h.document.head.innerHTML=v}catch(n){t(h.document.head).html(v)}h.document.body.innerHTML="<h1>"+l.title+"</h1><div>"+(l.messageTop||"")+"</div>"+m+"<div>"+(l.messageBottom||"")+"</div>",t(h.document.body).addClass("dt-print-view"),t("img",h.document.body).each((function(t,e){e.setAttribute("src",s(e.getAttribute("src")))})),u.customize&&u.customize(h,u,r);var y=function(){u.autoPrint&&(h.print(),h.close())};navigator.userAgent.match(/Trident\/\d.\d/)?y():h.setTimeout(y,1e3)}else r.buttons.info(r.i18n("buttons.printErrorTitle","Unable to open print view"),r.i18n("buttons.printErrorMsg","Please allow popups in your browser for this site to be able to view the print view."),5e3)},title:"*",messageTop:"*",messageBottom:"*",exportOptions:{},header:!0,footer:!1,autoPrint:!0,customize:null},r.Buttons},"function"==typeof define&&define.amd?define(["jquery","datatables.net","datatables.net-buttons"],(function(e){return t(e,window,document)})):"object"==typeof exports?module.exports=function(e,n){return e||(e=window),n&&n.fn.dataTable||(n=require("datatables.net")(e,n).$),n.fn.dataTable.Buttons||require("datatables.net-buttons")(e,n),t(n,e,e.document)}:t(jQuery,window,document);