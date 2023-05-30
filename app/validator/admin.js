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
	module.watchAdminLogin = function(req, res, next){
		
		req.checkBody('username', 'username is required').notEmpty();
		req.checkBody('password', 'password is required').notEmpty();
		

	   	var errors = req.validationErrors();
	   	if(errors){
	   		//req.flash('error',errors[0].msg);
	      	//res.send(errors[0]);
	      	return res.send({status : 'fail', status_code:404, message : errors[0].msg})
	   	}else{
	      next();
	   	}
	};
	//End: Validation for login

	
	//End: Validation for change password



	return module;	
}