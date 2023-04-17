$("#senderaddForm").validate({
  rules: {
    name: "required",
    categories: "required",
    countries: "required",
    
  },
  messages: {
    name: "Please Enter Template Name",
    categories: "Please Select Category",
    countries: "Please Select Country",
    
  },
  submitHandler: function (form) {
    $("#templateaddFormSubmit").prop("disabled", true);
    form.submit();
  }
});
$("#editTemplateForm").validate({
  rules: {
    name: "required",
    categories: "required",
    countries: "required",
    
  },
  messages: {
    name: "Please Enter Template Name",
    categories: "Please Select Category",
    countries: "Please Select Country",
    
  },
  submitHandler: function (form) {
    $("#editTemplateFormSubmit").prop("disabled", true);
    form.submit();
  }
});
$("body").on("click",".edittemplateList",function(){
  id= $(this).attr('dataid');
  let name = $("#name_"+id).text();
  let message = $("#message_"+id).text();
  let country = $("#country_"+id).attr('country');
  let category = $("#category_"+id).attr('category');
  $("#editexampleInputTempname").val(name);
  $("#editexampleInputTempMessage").val(message);
  $("#editCountry").val(country);
  $("#categoryList").val(category);
  $("#editTemplateForm").attr("action","/template/update/"+id);
});

