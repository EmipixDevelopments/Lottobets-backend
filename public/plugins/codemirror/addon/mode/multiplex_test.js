!function(){CodeMirror.defineMode("markdown_with_stex",(function(){var e=CodeMirror.getMode({},"stex"),i=CodeMirror.getMode({},"markdown"),r={open:"$",close:"$",mode:e,delimStyle:"delim",innerStyle:"inner"};return CodeMirror.multiplexingMode(i,r)}));var e=CodeMirror.getMode({},"markdown_with_stex");function i(i){test.mode(i,e,Array.prototype.slice.call(arguments,1),"multiplexing")}i("stexInsideMarkdown","[strong **Equation:**] [delim&delim-open $][inner&tag \\pi][delim&delim-close $]"),CodeMirror.defineMode("identical_delim_multiplex",(function(){return CodeMirror.multiplexingMode(CodeMirror.getMode({indentUnit:2},"javascript"),{open:"#",close:"#",mode:CodeMirror.getMode({},"markdown"),parseDelimiters:!0,innerStyle:"q"})}));var r=CodeMirror.getMode({},"identical_delim_multiplex");test.mode("identical_delimiters_with_parseDelimiters",r,["[keyword let] [def x] [operator =] [q #foo][q&em *bar*][q #];"],"multiplexing")}();