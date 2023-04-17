
/* Registration Form Validation */

/* Login Form Validation */
$("#loginForm").validate({
  rules: {
    email: "required",
    password: {
      required: true
    }
  },
  messages: {
    email: "Please Enter Your Email Address",
    password: {
      required: "Please Enter Your Password"
    }
  },
  submitHandler: function (form) {
    $("#loginSubmit").prop("disabled", true);
    form.submit();
  }
});
