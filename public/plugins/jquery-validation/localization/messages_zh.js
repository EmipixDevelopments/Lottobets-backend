var e;e=function(e){return e.extend(e.validator.messages,{required:"这是必填字段",remote:"请修正此字段",email:"请输入有效的电子邮件地址",url:"请输入有效的网址",date:"请输入有效的日期",dateISO:"请输入有效的日期 (YYYY-MM-DD)",number:"请输入有效的数字",digits:"只能输入数字",creditcard:"请输入有效的信用卡号码",equalTo:"你的输入不相同",extension:"请输入有效的后缀",maxlength:e.validator.format("最多可以输入 {0} 个字符"),minlength:e.validator.format("最少要输入 {0} 个字符"),rangelength:e.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),range:e.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),step:e.validator.format("请输入 {0} 的整数倍值"),max:e.validator.format("请输入不大于 {0} 的数值"),min:e.validator.format("请输入不小于 {0} 的数值")}),e},"function"==typeof define&&define.amd?define(["jquery","../jquery.validate"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(jQuery);