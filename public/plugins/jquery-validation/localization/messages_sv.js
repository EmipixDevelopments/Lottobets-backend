var e;e=function(e){return e.extend(e.validator.messages,{required:"Detta f&auml;lt &auml;r obligatoriskt.",remote:"Var snäll och åtgärda detta fält.",maxlength:e.validator.format("Du f&aring;r ange h&ouml;gst {0} tecken."),minlength:e.validator.format("Du m&aring;ste ange minst {0} tecken."),rangelength:e.validator.format("Ange minst {0} och max {1} tecken."),email:"Ange en korrekt e-postadress.",url:"Ange en korrekt URL.",date:"Ange ett korrekt datum.",dateISO:"Ange ett korrekt datum (&Aring;&Aring;&Aring;&Aring;-MM-DD).",number:"Ange ett korrekt nummer.",digits:"Ange endast siffror.",equalTo:"Ange samma v&auml;rde igen.",range:e.validator.format("Ange ett v&auml;rde mellan {0} och {1}."),max:e.validator.format("Ange ett v&auml;rde som &auml;r mindre eller lika med {0}."),min:e.validator.format("Ange ett v&auml;rde som &auml;r st&ouml;rre eller lika med {0}."),creditcard:"Ange ett korrekt kreditkortsnummer.",pattern:"Ogiltigt format."}),e},"function"==typeof define&&define.amd?define(["jquery","../jquery.validate"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(jQuery);