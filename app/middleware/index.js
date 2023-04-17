module.exports = function (model) {
	var module = {};

	module.admin = require('./admin')(model);
	
	
	return module;
}
