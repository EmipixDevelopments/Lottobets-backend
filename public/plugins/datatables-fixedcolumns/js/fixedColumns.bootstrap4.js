/*! FixedColumns 4.0.1
 * 2019-2021 SpryMedia Ltd - datatables.net/license
 */
var e;
/*! Bootstrap 4 integration for DataTables' FixedColumns
     * ©2016 SpryMedia Ltd - datatables.net/license
     */e=function(e){return e.fn.dataTable.fixedColumns},"function"==typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-fixedcolumns"],(function(t){return e(t)})):"object"==typeof exports?module.exports=function(t,n){return t||(t=window),n&&n.fn.dataTable||(n=require("datatables.net-bs4")(t,n).$),n.fn.dataTable.SearchPanes||require("datatables.net-fixedcolumns")(t,n),e(n)}:e(jQuery);