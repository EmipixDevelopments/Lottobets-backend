$("#offeraddForm").validate({
  rules: {
    company: "required",
    category: "required",
    country: "required",
  },
  messages: {
    company: "Please Enter Company",
    category: "Please Select Category ",
    country: "Please Select Country",
  },
  submitHandler: function (form) {
    $("#offeraddFormSubmit").prop("disabled", true);
    form.submit();
  }
});
$("#offereditForm").validate({
  rules: {
   company: "required",
   category: "required",
   country: "required",
  },
  messages: {
   company: "Please Enter Company",
   category: "Please Select Category ",
   country: "Please Select Country",
  },
  submitHandler: function (form) {
    $("#offereditFormSubmit").prop("disabled", true);
    form.submit();
  }
});
$("body").on("click",".editOfferUrlModal",function(){
  id= $(this).attr('dataid');
  let company = $("#company_"+id).text();
  let country = $("#country_"+id).attr('dataid');
  let category = $("#category_"+id).attr('dataid');
  let url = $("#url_"+id).text();
  let comment = $("#comment_"+id).text();
  $("#editCompany").val(company);
  $("#editCountry").val(country);
  $("#editCategory").val(category);
  $("#editURL").val(url);
  $("#editComment").val(comment);
  
  $("#offereditForm").attr("action","/offer/update/"+id);
})