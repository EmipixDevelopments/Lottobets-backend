var o;o=function(o){o.registerHelper("lint","json",(function(r){var n=[];if(!window.jsonlint)return window.console&&window.console.error("Error: window.jsonlint not defined, CodeMirror JSON linting cannot run."),n;var e=window.jsonlint.parser||window.jsonlint;e.parseError=function(r,e){var i=e.loc;n.push({from:o.Pos(i.first_line-1,i.first_column),to:o.Pos(i.last_line-1,i.last_column),message:r})};try{e.parse(r)}catch(o){}return n}))},"object"==typeof exports&&"object"==typeof module?o(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],o):o(CodeMirror);