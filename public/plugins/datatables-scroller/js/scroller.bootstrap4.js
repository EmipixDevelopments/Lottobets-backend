/*! Bootstrap 4 styling wrapper for Scroller
 * ©2018 SpryMedia Ltd - datatables.net/license
 */
var e;e=function(e,t,n,a){return e.fn.dataTable},"function"==typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-scroller"],(function(t){return e(t,window,document)})):"object"==typeof exports?module.exports=function(t,n){return t||(t=window),n&&n.fn.dataTable||(n=require("datatables.net-bs4")(t,n).$),n.fn.dataTable.Scroller||require("datatables.net-scroller")(t,n),e(n,t,t.document)}:e(jQuery,window,document);