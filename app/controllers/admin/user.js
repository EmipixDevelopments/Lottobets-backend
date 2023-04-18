var dateformat = require('dateformat');
var currentDate = new Date();
var Op = Sequelize.Op;
var md5 = require('md5');
var dateFormat = require('dateformat');
const querystring = require("querystring");
var jwt = require('jsonwebtoken');
var jwtcofig = {
    'secret': 'AisJwtAuth'
};
module.exports = function(model,config){	
	var module = {};

    module.Login = async function(request, response){
			
		let tra_lucky = await sequelize_luckynumberint.transaction();
        let inputs = request.body;
        console.log("Login==",inputs);
        console.log("ip==",request.socket.remoteAddress);
        console.log("ip==",request.connection.remoteAddress.replace(/^.*:/, ''));
            try {
                	let sql = "SELECT userId,fullName,photo,mobile,countryCode,deviceId,userName,mobile_ip,mobile_device_id,token,mobile_ip FROM " + config.Table.USER + " WHERE userName=" + sequelize_luckynumberint.escape(inputs.username) + " AND pin=" + sequelize_luckynumberint.escape(inputs.password) + " AND platform='lottobets' ORDER BY created_at DESC limit 1";
                    let result = await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT})
                	await tra_lucky.commit(); 
                	if (result.length) {
                        sql = "UPDATE " + config.Table.USER + "  SET token ="+tra_lucky.escape(result[0].userId)+" WHERE userId="+sequelize_luckynumberint.escape(result[0].userId)+"";
                        console.log("sql==",sql);
                        // await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.UPDATE})
                        return response.send({
                            status: "success",
                            result: result[0],
                            message: "Login successfully",
                            status_code: 200
                        });
                    } else {
                        return response.send({
                            status: "success",
                            result: result,
                            message: "Usename or password invalid",
                            status_code: 200
                        });
                    }
		    } catch (error) {
		        console.log('error',error);
		        if(tra_lucky) {
		           await tra_lucky.rollback();
		        }
                return response.send({
                    status: 'fail',
                    message: error,
                    status_code: 422
                });
		    }

	};


	return module;
}
