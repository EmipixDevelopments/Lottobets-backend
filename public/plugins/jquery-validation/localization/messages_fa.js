var e;e=function(e){return e.extend(e.validator.messages,{required:"تکمیل این فیلد اجباری است.",remote:"لطفا این فیلد را تصحیح کنید.",email:"لطفا یک ایمیل صحیح وارد کنید.",url:"لطفا آدرس صحیح وارد کنید.",date:"لطفا تاریخ صحیح وارد کنید.",dateFA:"لطفا یک تاریخ صحیح وارد کنید.",dateISO:"لطفا تاریخ صحیح وارد کنید (ISO).",number:"لطفا عدد صحیح وارد کنید.",digits:"لطفا تنها رقم وارد کنید.",creditcard:"لطفا کریدیت کارت صحیح وارد کنید.",equalTo:"لطفا مقدار برابری وارد کنید.",extension:"لطفا مقداری وارد کنید که",alphanumeric:"لطفا مقدار را عدد (انگلیسی) وارد کنید.",maxlength:e.validator.format("لطفا بیشتر از {0} حرف وارد نکنید."),minlength:e.validator.format("لطفا کمتر از {0} حرف وارد نکنید."),rangelength:e.validator.format("لطفا مقداری بین {0} تا {1} حرف وارد کنید."),range:e.validator.format("لطفا مقداری بین {0} تا {1} حرف وارد کنید."),max:e.validator.format("لطفا مقداری کمتر از {0} وارد کنید."),min:e.validator.format("لطفا مقداری بیشتر از {0} وارد کنید."),minWords:e.validator.format("لطفا حداقل {0} کلمه وارد کنید."),maxWords:e.validator.format("لطفا حداکثر {0} کلمه وارد کنید.")}),e},"function"==typeof define&&define.amd?define(["jquery","../jquery.validate"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(jQuery);