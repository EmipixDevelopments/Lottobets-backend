/*!
 * Flash export buttons for Buttons and DataTables.
 * 2015 SpryMedia Ltd - datatables.net/license
 *
 * ZeroClipbaord - MIT license
 * Copyright (c) 2012 Joseph Huckaby
 */
var t;t=function(t,e,l,o){var n=t.fn.dataTable,a={version:"1.0.4-TableTools2",clients:{},moviePath:"",nextId:1,$:function(t){return"string"==typeof t&&(t=l.getElementById(t)),t.addClass||(t.hide=function(){this.style.display="none"},t.show=function(){this.style.display=""},t.addClass=function(t){this.removeClass(t),this.className+=" "+t},t.removeClass=function(t){this.className=this.className.replace(new RegExp("\\s*"+t+"\\s*")," ").replace(/^\s+/,"").replace(/\s+$/,"")},t.hasClass=function(t){return!!this.className.match(new RegExp("\\s*"+t+"\\s*"))}),t},setMoviePath:function(t){this.moviePath=t},dispatch:function(t,e,l){var o=this.clients[t];o&&o.receiveEvent(e,l)},log:function(t){console.log("Flash: "+t)},register:function(t,e){this.clients[t]=e},getDOMObjectPosition:function(t){var e={left:0,top:0,width:t.width?t.width:t.offsetWidth,height:t.height?t.height:t.offsetHeight};for(""!==t.style.width&&(e.width=t.style.width.replace("px","")),""!==t.style.height&&(e.height=t.style.height.replace("px",""));t;)e.left+=t.offsetLeft,e.top+=t.offsetTop,t=t.offsetParent;return e},Client:function(t){this.handlers={},this.id=a.nextId++,this.movieId="ZeroClipboard_TableToolsMovie_"+this.id,a.register(this.id,this),t&&this.glue(t)}};a.Client.prototype={id:0,ready:!1,movie:null,clipText:"",fileName:"",action:"copy",handCursorEnabled:!0,cssEffects:!0,handlers:null,sized:!1,sheetName:"",glue:function(t,e){this.domElement=a.$(t);var o=99;this.domElement.style.zIndex&&(o=parseInt(this.domElement.style.zIndex,10)+1);var n=a.getDOMObjectPosition(this.domElement);this.div=l.createElement("div");var r=this.div.style;r.position="absolute",r.left="0px",r.top="0px",r.width=n.width+"px",r.height=n.height+"px",r.zIndex=o,void 0!==e&&""!==e&&(this.div.title=e),0!==n.width&&0!==n.height&&(this.sized=!0),this.domElement&&(this.domElement.appendChild(this.div),this.div.innerHTML=this.getHTML(n.width,n.height).replace(/&/g,"&amp;"))},positionElement:function(){var t=a.getDOMObjectPosition(this.domElement),e=this.div.style;if(e.position="absolute",e.width=t.width+"px",e.height=t.height+"px",0!==t.width&&0!==t.height){this.sized=!0;var l=this.div.childNodes[0];l.width=t.width,l.height=t.height}},getHTML:function(t,e){var l="",o="id="+this.id+"&width="+t+"&height="+e;return navigator.userAgent.match(/MSIE/)?l+='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+(location.href.match(/^https/i)?"https://":"http://")+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="'+t+'" height="'+e+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+a.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+o+'"/><param name="wmode" value="transparent"/></object>':l+='<embed id="'+this.movieId+'" src="'+a.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+t+'" height="'+e+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+o+'" wmode="transparent" />',l},hide:function(){this.div&&(this.div.style.left="-2000px")},show:function(){this.reposition()},destroy:function(){var e=this;this.domElement&&this.div&&(t(this.div).remove(),this.domElement=null,this.div=null,t.each(a.clients,(function(t,l){l===e&&delete a.clients[t]})))},reposition:function(t){if(t&&(this.domElement=a.$(t),this.domElement||this.hide()),this.domElement&&this.div){var e=a.getDOMObjectPosition(this.domElement),l=this.div.style;l.left=e.left+"px",l.top=e.top+"px"}},clearText:function(){this.clipText="",this.ready&&this.movie.clearText()},appendText:function(t){this.clipText+=t,this.ready&&this.movie.appendText(t)},setText:function(t){this.clipText=t,this.ready&&this.movie.setText(t)},setFileName:function(t){this.fileName=t,this.ready&&this.movie.setFileName(t)},setSheetData:function(t){this.ready&&this.movie.setSheetData(JSON.stringify(t))},setAction:function(t){this.action=t,this.ready&&this.movie.setAction(t)},addEventListener:function(t,e){t=t.toString().toLowerCase().replace(/^on/,""),this.handlers[t]||(this.handlers[t]=[]),this.handlers[t].push(e)},setHandCursor:function(t){this.handCursorEnabled=t,this.ready&&this.movie.setHandCursor(t)},setCSSEffects:function(t){this.cssEffects=!!t},receiveEvent:function(t,o){var n;switch(t=t.toString().toLowerCase().replace(/^on/,"")){case"load":if(this.movie=l.getElementById(this.movieId),!this.movie)return n=this,void setTimeout((function(){n.receiveEvent("load",null)}),1);if(!this.ready&&navigator.userAgent.match(/Firefox/)&&navigator.userAgent.match(/Windows/))return n=this,setTimeout((function(){n.receiveEvent("load",null)}),100),void(this.ready=!0);this.ready=!0,this.movie.clearText(),this.movie.appendText(this.clipText),this.movie.setFileName(this.fileName),this.movie.setAction(this.action),this.movie.setHandCursor(this.handCursorEnabled);break;case"mouseover":this.domElement&&this.cssEffects&&this.recoverActive&&this.domElement.addClass("active");break;case"mouseout":this.domElement&&this.cssEffects&&(this.recoverActive=!1,this.domElement.hasClass("active")&&(this.domElement.removeClass("active"),this.recoverActive=!0));break;case"mousedown":this.domElement&&this.cssEffects&&this.domElement.addClass("active");break;case"mouseup":this.domElement&&this.cssEffects&&(this.domElement.removeClass("active"),this.recoverActive=!1)}if(this.handlers[t])for(var a=0,r=this.handlers[t].length;a<r;a++){var i=this.handlers[t][a];"function"==typeof i?i(this,o):"object"==typeof i&&2==i.length?i[0][i[1]](this,o):"string"==typeof i&&e[i](this,o)}}},a.hasFlash=function(){try{if(new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))return!0}catch(t){if(navigator.mimeTypes&&navigator.mimeTypes["application/x-shockwave-flash"]!==o&&navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin)return!0}return!1},e.ZeroClipboard_TableTools=a;var r=function(t,e){e.attr("id"),e.parents("html").length?t.glue(e[0],""):setTimeout((function(){r(t,e)}),500)},i=function(e,l){var n="*"===e.filename&&"*"!==e.title&&e.title!==o?e.title:e.filename;return"function"==typeof n&&(n=n()),-1!==n.indexOf("*")&&(n=t.trim(n.replace("*",t("title").text()))),n=n.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g,""),l===o||!0===l?n+e.extension:n},d=function(t){var e="Sheet1";return t.sheetName&&(e=t.sheetName.replace(/[\[\]\*\/\\\?\:]/g,"")),e},s=function(t,e){var l=e.match(/[\s\S]{1,8192}/g)||[];t.clearText();for(var o=0,n=l.length;o<n;o++)t.appendText(l[o])},p=function(t){return t.newline?t.newline:navigator.userAgent.match(/Windows/)?"\r\n":"\n"},m=function(t,e){for(var l=p(e),n=t.buttons.exportData(e.exportOptions),a=e.fieldBoundary,r=e.fieldSeparator,i=new RegExp(a,"g"),d=e.escapeChar!==o?e.escapeChar:"\\",s=function(t){for(var e="",l=0,o=t.length;l<o;l++)l>0&&(e+=r),e+=a?a+(""+t[l]).replace(i,d+a)+a:t[l];return e},m=e.header?s(n.header)+l:"",f=e.footer&&n.footer?l+s(n.footer):"",h=[],c=0,u=n.body.length;c<u;c++)h.push(s(n.body[c]));return{str:m+h.join(l)+f,rows:h.length}},f={available:function(){return a.hasFlash()},init:function(t,e,l){a.moviePath=n.Buttons.swfPath;var o=new a.Client;o.setHandCursor(!0),o.addEventListener("mouseDown",(function(o){l._fromFlash=!0,t.button(e[0]).trigger(),l._fromFlash=!1})),r(o,e),l._flash=o},destroy:function(t,e,l){l._flash.destroy()},fieldSeparator:",",fieldBoundary:'"',exportOptions:{},title:"*",filename:"*",extension:".csv",header:!0,footer:!1};function h(t){for(var e="A".charCodeAt(0),l="Z".charCodeAt(0)-e+1,o="";t>=0;)o=String.fromCharCode(t%l+e)+o,t=Math.floor(t/l)-1;return o}function c(e,l,o){var n=e.createElement(l);return o&&(o.attr&&t(n).attr(o.attr),o.children&&t.each(o.children,(function(t,e){n.appendChild(e)})),o.text&&n.appendChild(e.createTextNode(o.text))),n}function u(t,e){var l,n,a,r=t.header[e].length;t.footer&&t.footer[e].length>r&&(r=t.footer[e].length);for(var i=0,d=t.body.length;i<d;i++){var s=t.body[i][e];if(-1!==(a=null!==s&&s!==o?s.toString():"").indexOf("\n")?((n=a.split("\n")).sort((function(t,e){return e.length-t.length})),l=n[0].length):l=a.length,l>r&&(r=l),r>40)return 52}return(r*=1.3)>6?r:6}var y,I="";function x(e){y===o&&(y=-1===I.serializeToString(t.parseXML(F["xl/worksheets/sheet1.xml"])).indexOf("xmlns:r")),t.each(e,(function(l,o){if(t.isPlainObject(o))x(o);else{if(y){var n,a,r=o.childNodes[0],i=[];for(n=r.attributes.length-1;n>=0;n--){var d=r.attributes[n].nodeName,s=r.attributes[n].nodeValue;-1!==d.indexOf(":")&&(i.push({name:d,value:s}),r.removeAttribute(d))}for(n=0,a=i.length;n<a;n++){var p=o.createAttribute(i[n].name.replace(":","_dt_b_namespace_token_"));p.value=i[n].value,r.setAttributeNode(p)}}var m=I.serializeToString(o);y&&(-1===m.indexOf("<?xml")&&(m='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+m),m=m.replace(/_dt_b_namespace_token_/g,":")),m=m.replace(/<([^<>]*?) xmlns=""([^<>]*?)>/g,"<$1 $2>"),e[l]=m}}))}I=void 0===e.XMLSerializer?new function(){this.serializeToString=function(t){return t.xml}}:new XMLSerializer;var F={"_rels/.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',"xl/_rels/workbook.xml.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',"[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml" /><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Default Extension="jpeg" ContentType="image/jpeg" /><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" /><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" /></Types>',"xl/workbook.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/><workbookPr showInkAnnotation="0" autoCompressPictures="0"/><bookViews><workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/></bookViews><sheets><sheet name="" sheetId="1" r:id="rId1"/></sheets></workbook>',"xl/worksheets/sheet1.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><sheetData/></worksheet>',"xl/styles.xml":'<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><numFmts count="6"><numFmt numFmtId="164" formatCode="#,##0.00_- [$$-45C]"/><numFmt numFmtId="165" formatCode="&quot;£&quot;#,##0.00"/><numFmt numFmtId="166" formatCode="[$€-2] #,##0.00"/><numFmt numFmtId="167" formatCode="0.0%"/><numFmt numFmtId="168" formatCode="#,##0;(#,##0)"/><numFmt numFmtId="169" formatCode="#,##0.00;(#,##0.00)"/></numFmts><fonts count="5" x14ac:knownFonts="1"><font><sz val="11" /><name val="Calibri" /></font><font><sz val="11" /><name val="Calibri" /><color rgb="FFFFFFFF" /></font><font><sz val="11" /><name val="Calibri" /><b /></font><font><sz val="11" /><name val="Calibri" /><i /></font><font><sz val="11" /><name val="Calibri" /><u /></font></fonts><fills count="6"><fill><patternFill patternType="none" /></fill><fill/><fill><patternFill patternType="solid"><fgColor rgb="FFD9D9D9" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD99795" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="ffc6efce" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="ffc6cfef" /><bgColor indexed="64" /></patternFill></fill></fills><borders count="2"><border><left /><right /><top /><bottom /><diagonal /></border><border diagonalUp="false" diagonalDown="false"><left style="thin"><color auto="1" /></left><right style="thin"><color auto="1" /></right><top style="thin"><color auto="1" /></top><bottom style="thin"><color auto="1" /></bottom><diagonal /></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" /></cellStyleXfs><cellXfs count="61"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="3" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="left"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="right"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="fill"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment textRotation="90"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment wrapText="1"/></xf><xf numFmtId="9"   fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="168" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="169" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="3" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/><xf numFmtId="4" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0" /></cellStyles><dxfs count="0" /><tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" /></styleSheet>'},b=[{match:/^\-?\d+\.\d%$/,style:60,fmt:function(t){return t/100}},{match:/^\-?\d+\.?\d*%$/,style:56,fmt:function(t){return t/100}},{match:/^\-?\$[\d,]+.?\d*$/,style:57},{match:/^\-?£[\d,]+.?\d*$/,style:58},{match:/^\-?€[\d,]+.?\d*$/,style:59},{match:/^\([\d,]+\)$/,style:61,fmt:function(t){return-1*t.replace(/[\(\)]/g,"")}},{match:/^\([\d,]+\.\d{2}\)$/,style:62,fmt:function(t){return-1*t.replace(/[\(\)]/g,"")}},{match:/^[\d,]+$/,style:63},{match:/^[\d,]+\.\d{2}$/,style:64}];return n.Buttons.swfPath="//cdn.datatables.net/buttons/1.2.4/swf/flashExport.swf",n.Api.register("buttons.resize()",(function(){t.each(a.clients,(function(t,e){e.domElement!==o&&e.domElement.parentNode&&e.positionElement()}))})),n.ext.buttons.copyFlash=t.extend({},f,{className:"buttons-copy buttons-flash",text:function(t){return t.i18n("buttons.copy","Copy")},action:function(t,e,l,o){if(o._fromFlash){this.processing(!0);var n=o._flash,a=m(e,o),r=o.customize?o.customize(a.str,o):a.str;n.setAction("copy"),s(n,r),this.processing(!1),e.buttons.info(e.i18n("buttons.copyTitle","Copy to clipboard"),e.i18n("buttons.copySuccess",{_:"Copied %d rows to clipboard",1:"Copied 1 row to clipboard"},a.rows),3e3)}},fieldSeparator:"\t",fieldBoundary:""}),n.ext.buttons.csvFlash=t.extend({},f,{className:"buttons-csv buttons-flash",text:function(t){return t.i18n("buttons.csv","CSV")},action:function(t,e,l,o){var n=o._flash,a=m(e,o),r=o.customize?o.customize(a.str,o):a.str;n.setAction("csv"),n.setFileName(i(o)),s(n,r)},escapeChar:'"'}),n.ext.buttons.excelFlash=t.extend({},f,{className:"buttons-excel buttons-flash",text:function(t){return t.i18n("buttons.excel","Excel")},action:function(e,l,n,a){this.processing(!0);var r,p,m=a._flash,f=0,y=t.parseXML(F["xl/worksheets/sheet1.xml"]),I=y.getElementsByTagName("sheetData")[0],v={_rels:{".rels":t.parseXML(F["_rels/.rels"])},xl:{_rels:{"workbook.xml.rels":t.parseXML(F["xl/_rels/workbook.xml.rels"])},"workbook.xml":t.parseXML(F["xl/workbook.xml"]),"styles.xml":t.parseXML(F["xl/styles.xml"]),worksheets:{"sheet1.xml":y}},"[Content_Types].xml":t.parseXML(F["[Content_Types].xml"])},g=l.buttons.exportData(a.exportOptions),w=function(e){p=c(y,"row",{attr:{r:r=f+1}});for(var l=0,n=e.length;l<n;l++){var a=h(l)+""+r,i=null;if(null!==e[l]&&e[l]!==o&&""!==e[l]){e[l]=t.trim(e[l]);for(var d=0,s=b.length;d<s;d++){var m=b[d];if(e[l].match&&!e[l].match(/^0\d+/)&&e[l].match(m.match)){var u=e[l].replace(/[^\d\.\-]/g,"");m.fmt&&(u=m.fmt(u)),i=c(y,"c",{attr:{r:a,s:m.style},children:[c(y,"v",{text:u})]});break}}if(!i)if("number"==typeof e[l]||e[l].match&&e[l].match(/^-?\d+(\.\d+)?$/)&&!e[l].match(/^0\d+/))i=c(y,"c",{attr:{t:"n",r:a},children:[c(y,"v",{text:e[l]})]});else{var x=e[l].replace?e[l].replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g,""):e[l];i=c(y,"c",{attr:{t:"inlineStr",r:a},children:{row:c(y,"is",{children:{row:c(y,"t",{text:x})}})}})}p.appendChild(i)}}I.appendChild(p),f++};t("sheets sheet",v.xl["workbook.xml"]).attr("name",d(a)),a.customizeData&&a.customizeData(g),a.header&&(w(g.header,f),t("row c",y).attr("s","2"));for(var B=0,C=g.body.length;B<C;B++)w(g.body[B],f);a.footer&&g.footer&&(w(g.footer,f),t("row:last c",y).attr("s","2"));var T=c(y,"cols");t("worksheet",y).prepend(T);for(var E=0,k=g.header.length;E<k;E++)T.appendChild(c(y,"col",{attr:{min:E+1,max:E+1,width:u(g,E),customWidth:1}}));a.customize&&a.customize(v),x(v),m.setAction("excel"),m.setFileName(i(a)),m.setSheetData(v),s(m,""),this.processing(!1)},extension:".xlsx"}),n.ext.buttons.pdfFlash=t.extend({},f,{className:"buttons-pdf buttons-flash",text:function(t){return t.i18n("buttons.pdf","PDF")},action:function(t,e,l,o){this.processing(!0);var n=o._flash,a=e.buttons.exportData(o.exportOptions),r=e.table().node().offsetWidth,d=e.columns(o.columns).indexes().map((function(t){return e.column(t).header().offsetWidth/r}));n.setAction("pdf"),n.setFileName(i(o)),s(n,JSON.stringify({title:i(o,!1),message:"function"==typeof o.message?o.message(e,l,o):o.message,colWidth:d.toArray(),orientation:o.orientation,size:o.pageSize,header:o.header?a.header:null,footer:o.footer?a.footer:null,body:a.body})),this.processing(!1)},extension:".pdf",orientation:"portrait",pageSize:"A4",message:"",newline:"\n"}),n.Buttons},"function"==typeof define&&define.amd?define(["jquery","datatables.net","datatables.net-buttons"],(function(e){return t(e,window,document)})):"object"==typeof exports?module.exports=function(e,l){return e||(e=window),l&&l.fn.dataTable||(l=require("datatables.net")(e,l).$),l.fn.dataTable.Buttons||require("datatables.net-buttons")(e,l),t(l,e,e.document)}:t(jQuery,window,document);