/*! Bootstrap 4 styling wrapper for FixedHeader
 * ©2018 SpryMedia Ltd - datatables.net/license
 */
var e;e=function(e,t,n,a){return e.fn.dataTable},"function"==typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-fixedheader"],(function(t){return e(t,window,document)})):"object"==typeof exports?module.exports=function(t,n){return t||(t=window),n&&n.fn.dataTable||(n=require("datatables.net-bs4")(t,n).$),n.fn.dataTable.FixedHeader||require("datatables.net-fixedheader")(t,n),e(n,t,t.document)}:e(jQuery,window,document);