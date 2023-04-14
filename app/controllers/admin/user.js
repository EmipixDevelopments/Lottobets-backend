var dateformat = require('dateformat');
var currentDate = new Date();
var Op = Sequelize.Op;
var md5 = require('md5');

module.exports = function(model,config){	
	var module = {};


	

	module.getUsers = async function(request, response){
			
			//const t = await Sequelize.transaction();
			//let transaction;
			let t = await sequelize1.transaction();
		    try {
		        let d = await sequelize_luckynumberint.query('SELECT * FROM question_list;', { transaction: t ,type: sequelize1.QueryTypes.SELECT})
				await t.commit(); 
				return response.send(d)
		    } catch (error) {
		        console.log('error',error);
		        if(t) {
		           await t.rollback();
		        }
		    }

	};


	return module;
}
