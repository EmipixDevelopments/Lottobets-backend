const env = process.env.NODE_ENV || "localhost"

module.exports = function (dataBaseType) {

	//Start: sequelize database connection
	var database = '';
	var username = '';
	var password = '';
	var port = "";
	var host = '';
	
	if (env == "production") {
		database = "smsbomb";
		username = "root";
		password = "Emipix123!@#";
		//port = "22";
		host = "localhost";
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
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
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
