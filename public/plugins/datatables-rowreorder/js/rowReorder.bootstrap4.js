/*! Bootstrap 4 styling wrapper for RowReorder
 * ©2018 SpryMedia Ltd - datatables.net/license
 */
var e;e=function(e,t,n,r){return e.fn.dataTable},"function"==typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-rowreorder"],(function(t){return e(t,window,document)})):"object"==typeof exports?module.exports=function(t,n){return t||(t=window),n&&n.fn.dataTable||(n=require("datatables.net-bs4")(t,n).$),n.fn.dataTable.RowReorder||require("datatables.net-rowreorder")(t,n),e(n,t,t.document)}:e(jQuery,window,document);