var e;e=function(e){e.defineMode("pig",(function(e,O){var T=O.keywords,E=O.builtins,I=O.types,N=O.multiLineStrings,t=/[*+\-%<>=&?:\/!|]/;function r(e,O,T){return O.tokenize=T,T(e,O)}function A(e,O){for(var T,E=!1;T=e.next();){if("/"==T&&E){O.tokenize=S;break}E="*"==T}return"comment"}function R(e){return function(O,T){for(var E,I=!1,t=!1;null!=(E=O.next());){if(E==e&&!I){t=!0;break}I=!I&&"\\"==E}return(t||!I&&!N)&&(T.tokenize=S),"error"}}function S(e,O){var N=e.next();return'"'==N||"'"==N?r(e,O,R(N)):/[\[\]{}\(\),;\.]/.test(N)?null:/\d/.test(N)?(e.eatWhile(/[\w\.]/),"number"):"/"==N?e.eat("*")?r(e,O,A):(e.eatWhile(t),"operator"):"-"==N?e.eat("-")?(e.skipToEnd(),"comment"):(e.eatWhile(t),"operator"):t.test(N)?(e.eatWhile(t),"operator"):(e.eatWhile(/[\w\$_]/),T&&T.propertyIsEnumerable(e.current().toUpperCase())&&!e.eat(")")&&!e.eat(".")?"keyword":E&&E.propertyIsEnumerable(e.current().toUpperCase())?"variable-2":I&&I.propertyIsEnumerable(e.current().toUpperCase())?"variable-3":"variable")}return{startState:function(){return{tokenize:S,startOfLine:!0}},token:function(e,O){return e.eatSpace()?null:O.tokenize(e,O)}}})),function(){function O(e){for(var O={},T=e.split(" "),E=0;E<T.length;++E)O[T[E]]=!0;return O}var T="ABS ACOS ARITY ASIN ATAN AVG BAGSIZE BINSTORAGE BLOOM BUILDBLOOM CBRT CEIL CONCAT COR COS COSH COUNT COUNT_STAR COV CONSTANTSIZE CUBEDIMENSIONS DIFF DISTINCT DOUBLEABS DOUBLEAVG DOUBLEBASE DOUBLEMAX DOUBLEMIN DOUBLEROUND DOUBLESUM EXP FLOOR FLOATABS FLOATAVG FLOATMAX FLOATMIN FLOATROUND FLOATSUM GENERICINVOKER INDEXOF INTABS INTAVG INTMAX INTMIN INTSUM INVOKEFORDOUBLE INVOKEFORFLOAT INVOKEFORINT INVOKEFORLONG INVOKEFORSTRING INVOKER ISEMPTY JSONLOADER JSONMETADATA JSONSTORAGE LAST_INDEX_OF LCFIRST LOG LOG10 LOWER LONGABS LONGAVG LONGMAX LONGMIN LONGSUM MAX MIN MAPSIZE MONITOREDUDF NONDETERMINISTIC OUTPUTSCHEMA  PIGSTORAGE PIGSTREAMING RANDOM REGEX_EXTRACT REGEX_EXTRACT_ALL REPLACE ROUND SIN SINH SIZE SQRT STRSPLIT SUBSTRING SUM STRINGCONCAT STRINGMAX STRINGMIN STRINGSIZE TAN TANH TOBAG TOKENIZE TOMAP TOP TOTUPLE TRIM TEXTLOADER TUPLESIZE UCFIRST UPPER UTF8STORAGECONVERTER ",E="VOID IMPORT RETURNS DEFINE LOAD FILTER FOREACH ORDER CUBE DISTINCT COGROUP JOIN CROSS UNION SPLIT INTO IF OTHERWISE ALL AS BY USING INNER OUTER ONSCHEMA PARALLEL PARTITION GROUP AND OR NOT GENERATE FLATTEN ASC DESC IS STREAM THROUGH STORE MAPREDUCE SHIP CACHE INPUT OUTPUT STDERROR STDIN STDOUT LIMIT SAMPLE LEFT RIGHT FULL EQ GT LT GTE LTE NEQ MATCHES TRUE FALSE DUMP",I="BOOLEAN INT LONG FLOAT DOUBLE CHARARRAY BYTEARRAY BAG TUPLE MAP ";e.defineMIME("text/x-pig",{name:"pig",builtins:O(T),keywords:O(E),types:O(I)}),e.registerHelper("hintWords","pig",(T+I+E).split(" "))}()},"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror);