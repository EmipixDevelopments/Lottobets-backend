/*! Bootstrap integration for DataTables' AutoFill
 * ©2015 SpryMedia Ltd - datatables.net/license
 */
var t;t=function(t,e,n,a){var o=t.fn.dataTable;return o.AutoFill.classes.btn="btn btn-primary",o},"function"==typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-autofill"],(function(e){return t(e,window,document)})):"object"==typeof exports?module.exports=function(e,n){return e||(e=window),n&&n.fn.dataTable||(n=require("datatables.net-bs4")(e,n).$),n.fn.dataTable.AutoFill||require("datatables.net-autofill")(e,n),t(n,e,e.document)}:t(jQuery,window,document);