module.exports = function (model) {
	var module = {};

	const config = require('../../config/constants.js');
	
	module.user = require('./admin/user')(model,config);
	
	
	
	return module;
}
