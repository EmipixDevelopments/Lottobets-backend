var e;e=function(e){function t(e){var t=e.getWrapperElement();e.state.fullScreenRestore={scrollTop:window.pageYOffset,scrollLeft:window.pageXOffset,width:t.style.width,height:t.style.height},t.style.width="",t.style.height="auto",t.className+=" CodeMirror-fullscreen",document.documentElement.style.overflow="hidden",e.refresh()}function o(e){var t=e.getWrapperElement();t.className=t.className.replace(/\s*CodeMirror-fullscreen\b/,""),document.documentElement.style.overflow="";var o=e.state.fullScreenRestore;t.style.width=o.width,t.style.height=o.height,window.scrollTo(o.scrollLeft,o.scrollTop),e.refresh()}e.defineOption("fullScreen",!1,(function(r,l,i){i==e.Init&&(i=!1),!i!=!l&&(l?t(r):o(r))}))},"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror);