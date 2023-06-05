const env = process.env.NODE_ENV || "production"

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
		}
	});

	sequelize.authenticate().then(() => {
		console.log('Connection has been established successfully.');
	}).catch(err => {
		console.error('Unable to connect to the database:', err);
	});
	return sequelize;
	//End: sequelize database connection
}
