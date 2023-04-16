module.exports = function (model) {
	var module = {};

	const config = require('../../config/constants.js');
	
	module.user = require('./admin/user')(model,config);
	module.user = require('./admin/application')(model,config);
	
	
	
	return module;
}
