const env = process.env.NODE_ENV || "localhost"
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
	var dbconnection = mysql.createPool({
		connectionLimit: 100000,
		acquireTimeout: 100000,
		queueLimit:0,
		supportBigNumbers: true,
        bigNumberStrings: true,
        waitForConnections: true,
		host: host,
		user: username,
		password: password,
		database: database
	});    

	dbconnection.on('connection', function (connection) {
	  console.log('DB Connection established');

	  connection.on('error', function (err) {
	    console.error(new Date(), 'MySQL error', err.code);
	  });
	  connection.on('close', function (err) {
	    console.error(new Date(), 'MySQL close', err);
	  });

	});
	return dbconnection;
	//End: sequelize database connection
}
