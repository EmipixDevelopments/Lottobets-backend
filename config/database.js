const env = process.env.NODE_ENV || "production"
var mysql = require('mysql');
module.exports = function (dataBaseType) {

	//Start: sequelize database connection
	var database = '';
	var username = '';
	var password = '';
	var port = "";
	var host = '';
	
	if (env == "production") {
		database = "luckynumberint";
		username = "luckynumberint";
		password = '7@x"`f3d(~LUQRf(';
		//port = "22";
		host = "172.31.37.175";
	} else if (env == "localhost") {
		database = "mlm";
		username = "root";
		dialect ="mysql";
		password = "";
		port = "";
		host = "localhost";
	}
	
	//End: sequelize database connection
}
