var e;e=function(e){return e.extend(e.validator.messages,{required:"Eremu hau beharrezkoa da.",remote:"Mesedez, bete eremu hau.",email:"Mesedez, idatzi baliozko posta helbide bat.",url:"Mesedez, idatzi baliozko URL bat.",date:"Mesedez, idatzi baliozko data bat.",dateISO:"Mesedez, idatzi baliozko (ISO) data bat.",number:"Mesedez, idatzi baliozko zenbaki oso bat.",digits:"Mesedez, idatzi digituak soilik.",creditcard:"Mesedez, idatzi baliozko txartel zenbaki bat.",equalTo:"Mesedez, idatzi berdina berriro ere.",extension:"Mesedez, idatzi onartutako luzapena duen balio bat.",maxlength:e.validator.format("Mesedez, ez idatzi {0} karaktere baino gehiago."),minlength:e.validator.format("Mesedez, ez idatzi {0} karaktere baino gutxiago."),rangelength:e.validator.format("Mesedez, idatzi {0} eta {1} karaktere arteko balio bat."),range:e.validator.format("Mesedez, idatzi {0} eta {1} arteko balio bat."),max:e.validator.format("Mesedez, idatzi {0} edo txikiagoa den balio bat."),min:e.validator.format("Mesedez, idatzi {0} edo handiagoa den balio bat.")}),e},"function"==typeof define&&define.amd?define(["jquery","../jquery.validate"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(jQuery);