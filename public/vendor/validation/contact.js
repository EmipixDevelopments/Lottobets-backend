$("#contactForm").validate({
  rules: {
    name: "required",
    fileName: "required",
    countries: "required",
    
  },
  messages: {
    name: "Please Enter name",
    countries: "Please Select country",
    fileName: "Please Select File ",
    
  },
  submitHandler: function (form) {
    $("#contactaddFormSubmit").prop("disabled", true);
    form.submit();
  }
});
$("#editContactForm").validate({
  rules: {
    name: "required",
    countries: "required",
    
    /*password: {
      required: true
    }*/
  },
  messages: {
    name: "Please Enter name",
    countries: "Please Select country",
    
   /* password: {
      required: "Please Enter Password"
    }*/
  },
  submitHandler: function (form) {
    $("#editContactFormSubmit").prop("disabled", true);
    form.submit();
  }
});
$("#addcontactForm").validate({
  rules: {
    phone: "required",
    
    /*password: {
      required: true
    }*/
  },
  messages: {
    phone: "Please Enter Phone Number",
    
   /* password: {
      required: "Please Enter Password"
    }*/
  },
  submitHandler: function (form) {
   // $("#contactaddFormSubmit").prop("disabled", true);
    form.submit();
  }
});
$("body").on("click",".editcontactList",function(){
  id= $(this).attr('dataid');
  let name = $("#name_"+id).text();
  let comment = $("#comment_"+id).text();
  let country = $("#country_"+id).attr('country');
  
  $("#editexampleInputName").val(name);
  $("#editexampleInputComment").html(comment);
  $("#editCountry").val(country);
  
  $("#editContactForm").attr("action","/contact/update/"+id);
});
$("body").on("click",".editUserList",function(){
  id= $(this).attr('dataid');
  let first = $("#first_"+id).text();
  let last = $("#last_"+id).text();
  let email = $("#email_"+id).text();
  let phone = $("#phone_"+id).text();
  let country = $("#country_"+id).text();
  let custom_1 = $("#custom_1_"+id).text();
  let custom_2 = $("#custom_2_"+id).text();
  let custom_3 = $("#custom_3_"+id).text();
 
  $("#first").val(first);
  $("#last").val(last);
  $("#email").val(email);
  $("#phone").val(phone);
  $("#Country").val(country);
  $("#Custom1").val(custom_1);
  $("#Custom2").val(custom_2);
  $("#Custom3").val(custom_3);
  
  
  $("#editContactForm").attr("action","/singleContactupdate/"+id);
});

     

