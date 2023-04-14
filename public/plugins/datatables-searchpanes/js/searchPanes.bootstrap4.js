/*! Bootstrap integration for DataTables' SearchPanes
 * ©2016 SpryMedia Ltd - datatables.net/license
 */
var e;e=function(e,t,a){var n=e.fn.dataTable;return e.extend(!0,n.SearchPane.classes,{buttonGroup:"btn-group",disabledButton:"disabled",narrow:"col",pane:{container:"table"},paneButton:"btn btn-light",pill:"pill badge badge-pill badge-secondary",search:"form-control search",searchCont:"input-group",searchLabelCont:"input-group-append",subRow1:"dtsp-subRow1",subRow2:"dtsp-subRow2",table:"table table-sm table-borderless",topRow:"dtsp-topRow"}),e.extend(!0,n.SearchPanes.classes,{clearAll:"dtsp-clearAll btn btn-light",collapseAll:"dtsp-collapseAll btn btn-light",container:"dtsp-searchPanes",disabledButton:"disabled",panes:"dtsp-panes dtsp-panesContainer",showAll:"dtsp-showAll btn btn-light",title:"dtsp-title",titleRow:"dtsp-titleRow"}),n.searchPanes},"function"==typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-searchpanes"],(function(t){return e(t,window,document)})):"object"==typeof exports?module.exports=function(t,a){return t||(t=window),a&&a.fn.dataTable||(a=require("datatables.net-bs4")(t,a).$),a.fn.dataTable.SearchPanes||require("datatables.net-searchpanes")(t,a),e(a,t,t.document)}:e(jQuery,window,document);