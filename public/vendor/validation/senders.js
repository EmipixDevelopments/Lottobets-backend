$("#senderaddForm").validate({
  rules: {
    sendername: {
      required: true,
      pwcheck: true,
    },
    /*country: "required",
    url: "required",*/
  },
  messages: {
    sendername: {required:"Please Enter Sender Name",pwcheck:"Sender must not exceed 11 letters (latin alphabet or special symbols “{}+'&.” are allowed)"},
  },
  submitHandler: function (form) {
    $("#senderaddFormSubmit").prop("disabled", true);
    form.submit();
  }
});
$.validator.addMethod("pwcheck", function(value) {
        //return /^(?=.*\d)(?=.*[0-9a-zA-Z])(?=(.*[`{}']){1,}).{1,11}$/.test(value);
        return /^(?=.*[a-z0-9])[a-z0-9{ }+'&.]{1,11}$/i.test(value);
});

$("#editSenderaddForm").validate({
  rules: {
    sendername: {
      required: true,
      pwcheck: true,
    },
    /*country: "required",
    url: "required",*/
  },
  messages: {
    sendername: {required:"Please Enter Sender Name",pwcheck:"Sender must not exceed 11 letters (latin alphabet or special symbols “{}+'&.” are allowed)"},
  },
  submitHandler: function (form) {
    $("#editSenderaddFormSubmit").prop("disabled", true);
    form.submit();
  }
});
$("body").on("click",".editSenderList",function(){
  id= $(this).attr('dataid');
  let senderName = $("#sender_"+id).text();
  let message = $("#message_"+id).text();
  let role = $("#role_"+id).text();
  $("#editexampleInputSendername").val(senderName);
  $("#editexampleInputMessage1").val(message);
  // if(role=='superadmin'){
    // $("#editSuperadmin").attr('checked','checked');
  // }else{
     // $("#editAdmin").attr('checked','checked');
  // }
  $("#editSenderaddForm").attr("action","/sender/update/"+id);
})