const env = process.env.NODE_ENV || "production"

module.exports = function (dataBaseType) {

	//Start: sequelize database connection
	var database = '';
	var username = '';
	var password = '';
	var port = "";
	var host = '';
	
	if (env == "production") {
		database = "cngapi";
		username = "developer";
		password = 'Cn9Ap12o!7';
		port = 3306;
		//host = "live.serveftp.net";
		host = "cng.luckynumbersinternet.net";
	} else if (env == "localhost") {
		database = "mlm";
		username = "root";
		dialect ="mysql";
		password = "";
		port = "";
		host = "localhost";
	}
	var sequelize = new dataBaseType(database, username, password, {
		host: host,
		dialect: 'mysql',
		operatorsAliases: false,
		logging: false, // true when you want to seen query 
		port: port,
		pool: {
			max: 10000,
			min: 0,
			acquire: 30000*100,
			idle: 10000*100
		},
		dialectOptions: { connectTimeout:  15000*100 }
	});

	sequelize.authenticate().then(() => {
		console.log('cngapi Connection has been established successfully.');
	}).catch(err => {
		console.error('Unable to connect to the database: cngapi', err);
	});
	return sequelize;
	//End: sequelize database connection
}
