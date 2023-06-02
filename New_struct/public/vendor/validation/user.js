$("#useraddForm").validate({
  rules: {
    username: "required",
    email: "required",
    password: {
      required: true
    }
  },
  messages: {
    username: "Please Enter Username",
    email: "Please Enter Email ",
    password: {
      required: "Please Enter Password"
    }
  },
  submitHandler: function (form) {
    $("#loginSubmit").prop("disabled", true);
    form.submit();
  }
});
$("#editUseraddForm").validate({
  rules: {
    username: "required",
    email: "required",
    /*password: {
      required: true
    }*/
  },
  messages: {
    username: "Please Enter Username",
    email: "Please Enter Email ",
   /* password: {
      required: "Please Enter Password"
    }*/
  },
  submitHandler: function (form) {
    $("#editUseraddForm").prop("disabled", true);
    form.submit();
  }
});
$("body").on("click",".editUserList",function(){
  id= $(this).attr('dataid');
  let email = $("#email_"+id).text();
  let username = $("#username_"+id).text();
  let role = $("#role_"+id).text();
  $("#editexampleInputUsername").val(username);
  $("#editexampleInputEmail1").val(email);
  if(role=='superadmin'){
    $("#editSuperadmin").attr('checked','checked');
  }else{
     $("#editAdmin").attr('checked','checked');
  }
  $("#editUseraddForm").attr("action","/user/update/"+id);
});

