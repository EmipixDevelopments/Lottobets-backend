const Op = Sequelize.Op;
var dateformat = require('dateformat');
module.exports = function(model){
	var module = {};

	
	//mobile
	module.getMessages = async function(callback){
		try{
			
			let d = await sequelize1.query('SELECT * FROM admins;', { type: sequelize1.QueryTypes.SELECT});
			console.log("d===",d)
			callback(d)
			return d;
		}catch(error){
			console.log(error)
		}
		
	};
	
	//end mobile
	return module;
};