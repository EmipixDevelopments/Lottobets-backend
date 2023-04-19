module.exports = function(model){
	var module = {};

	
	module.login = function(req, res, next){
		
		req.checkBody('email', 'Email Address is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('email', 'Please enter valid email-id').isEmail();

	   	var errors = req.validationErrors();
	   	if(errors){
	   		req.flash('error',errors[0].msg);
	      	res.redirect('/');
	   	}else{
	      next();
	   	}
	};
	
	//End: Validation for login

	
	//End: Validation for change password



	return module;	
}