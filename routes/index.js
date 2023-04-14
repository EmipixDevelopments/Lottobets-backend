module.exports = function (app, controllers) {
	require('./admin.js')(app, controllers.admin);
	
}	