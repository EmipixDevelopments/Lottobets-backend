$("#profileFrm").validate({
  	rules: {
    	pro_name: "required",
    	pro_email: {
      		required: true,
      		email: true
    	}
  	},
    messages: {
      pro_name: "Please enter your name",
      email: {
        required: "Please enter your email address",
        email: "Please enter a valid email address",
      }
    },
    submitHandler: function (form) {
        form.submit();
    }
});