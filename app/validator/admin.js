module.exports = function(model){
	var module = {};

	
	module.login = function(req, res, next){
		
		req.checkBody('username', 'username is required').notEmpty();
		req.checkBody('password', 'password is required').notEmpty();
		//req.checkBody('email', 'Please enter valid email-id').isEmail();

	   	var errors = req.validationErrors();
	   	if(errors){
	   		//req.flash('error',errors[0].msg);
	      	//res.send(errors[0]);
	      	return res.send({status : 'fail', status_code:404, message : errors[0].msg})
	   	}else{
	      next();
	   	}
	};
	module.signup = function(req, res, next){
		
		req.checkBody('username', 'username is required').notEmpty();
		req.checkBody('password', 'password is required').notEmpty();
		//req.checkBody('email', 'Please enter valid email-id').isEmail();

	   	var errors = req.validationErrors();
	   	if(errors){
	   		//req.flash('error',errors[0].msg);
	      	//res.send(errors[0]);
	      	return res.send({status : 'fail', status_code:404, message : errors[0].msg})
	   	}else{
	      next();
	   	}
	};
	module.addtoFavourite = function(req, res, next){
		
		req.checkBody('userId', 'userId is required').notEmpty();
		req.checkBody('lottoId', 'lottoId is required').notEmpty();
		req.checkBody('flag', 'flag is required').notEmpty();
		//req.checkBody('email', 'Please enter valid email-id').isEmail();

	   	var errors = req.validationErrors();
	   	if(errors){
	   		//req.flash('error',errors[0].msg);
	      	//res.send(errors[0]);
	      	return res.send({status : 'fail', status_code:404, message : errors[0].msg})
	   	}else{
	      next();
	   	}
	};
	module.countryWiseLottoList = function(req, res, next){
		
		req.checkBody('countryflag', 'countryflag is required').notEmpty();
		req.checkBody('countryId', 'countryId is required').notEmpty();
		//req.checkBody('flag', 'flag is required').notEmpty();
		//req.checkBody('email', 'Please enter valid email-id').isEmail();

	   	var errors = req.validationErrors();
	   	if(errors){
	   		//req.flash('error',errors[0].msg);
	      	//res.send(errors[0]);
	      	return res.send({status : 'fail', status_code:404, message : errors[0].msg})
	   	}else{
	      next();
	   	}
	};
	module.lottoMarket = function(req, res, next){
		
		req.checkBody('userId', 'userId is required').notEmpty();
		req.checkBody('profileId', 'profileId is required').notEmpty();
		//req.checkBody('flag', 'flag is required').notEmpty();
		//req.checkBody('email', 'Please enter valid email-id').isEmail();

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