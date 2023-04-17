$("#CategoryaddForm").validate({
  rules: {
    name: "required",
  },
  messages: {
    name: "Please Enter Category",
  },
  submitHandler: function (form) {
    $("#CategoryaddFormSubmit").prop("disabled", true);
    //form.submit();
    if (confirm('Category '+$('#exampleInputCategory').val()+' ?')) {
            form.submit();
    }else{
      return false;
    }
  }
});