/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */
var t;t=function(t,n,e,o){var a=t.fn.dataTable;return t.extend(!0,a.Buttons.defaults,{dom:{container:{className:"dt-buttons btn-group flex-wrap"},button:{className:"btn btn-secondary"},collection:{tag:"div",className:"dropdown-menu",closeButton:!1,button:{tag:"a",className:"dt-button dropdown-item",active:"active",disabled:"disabled"}},splitWrapper:{tag:"div",className:"dt-btn-split-wrapper btn-group",closeButton:!1},splitDropdown:{tag:"button",text:"",className:"btn btn-secondary dt-btn-split-drop dropdown-toggle dropdown-toggle-split",closeButton:!1,align:"split-left",splitAlignClass:"dt-button-split-left"},splitDropdownButton:{tag:"button",className:"dt-btn-split-drop-button btn btn-secondary",closeButton:!1}},buttonCreated:function(n,e){return n.buttons?t('<div class="btn-group"/>').append(e):e}}),a.ext.buttons.collection.className+=" dropdown-toggle",a.ext.buttons.collection.rightAlignClassName="dropdown-menu-right",a.Buttons},"function"==typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-buttons"],(function(n){return t(n,window,document)})):"object"==typeof exports?module.exports=function(n,e){return n||(n=window),e&&e.fn.dataTable||(e=require("datatables.net-bs4")(n,e).$),e.fn.dataTable.Buttons||require("datatables.net-buttons")(n,e),t(e,n,n.document)}:t(jQuery,window,document);