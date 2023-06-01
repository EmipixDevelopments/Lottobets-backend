module.exports = function (model) {
	var module = {};

	const config = require('../../config/constants.js');
	
	module.user = require('./admin/user')(model,config);
	module.userWatch = require('./admin/userWatch')(model,config);
	module.application = require('./admin/application')(model,config);
	module.applicationWatch = require('./admin/applicationWatch')(model,config);
	
	
	
	return module;
}
