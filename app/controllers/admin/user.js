var dateformat = require('dateformat');
var currentDate = new Date();
var Op = Sequelize.Op;
var md5 = require('md5');
var dateFormat = require('dateformat');
const querystring = require("querystring");
var jwt = require('jsonwebtoken');
var jwtcofig = {
    'secret': config.lottobetsJwtAuth
};
module.exports = function(model,config){	
	var module = {};

    module.login = async function(request, response){
			
		let tra_lucky = await sequelize_luckynumberint.transaction();
        let inputs = request.body;
        console.log("Login==",inputs);
        
        let ip = request.connection.remoteAddress.replace(/^.*:/, '');
            try {
                	let sql = "SELECT userId,fullName,photo,mobile,countryCode,deviceId,userName,mobile_ip,mobile_device_id,token,mobile_ip,walletId FROM " + config.Table.USER + " WHERE userName=" + sequelize_luckynumberint.escape(inputs.username) + " AND pin=" + sequelize_luckynumberint.escape(inputs.password) + " AND platform='lottobets' ORDER BY created_at DESC limit 1";
                    let result = await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT})
                	 
                	if (result.length) {
                        let token = jwt.sign({
                            login: true,
                            deviceId: inputs.deviceId
                        }, jwtcofig.secret, {
                            //expiresIn: 60 * 60 * 24 // expires in 24 hours
                        });
                        sql = "UPDATE " + config.Table.USER + "  SET token ="+sequelize_luckynumberint.escape(token)+",mobile_ip="+sequelize_luckynumberint.escape(ip)+" WHERE userId="+sequelize_luckynumberint.escape(result[0].userId)+"";
                        await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.UPDATE});
                        result[0]['mobile_ip']=ip;
                        result[0]['token']=token;
                        result[0]['walletId']=(result[0]['walletId'])?result[0]['walletId']:'';
                        await tra_lucky.commit();
                        //sequelize_luckynumberint.release();
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

    module.signup = async function(request, response){
            
        let tra_lucky = await sequelize_luckynumberint.transaction();
        let inputs = request.body;
        let ip = request.connection.remoteAddress.replace(/^.*:/, '');
        console.log("Login==",inputs);
        
        
            try {
                    let sql = "SELECT userName FROM " + config.Table.USER + " WHERE userName=" + sequelize_luckynumberint.escape(inputs.username) + " AND platform='lottobets'  limit 1";
                    let result = await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT})
                     
                    if (result.length) {
                        
                        await tra_lucky.commit();

                        return response.send({
                            status: 'fail',
                            message: 'username already exists',
                            status_code: 422
                        });
                    } else {
                        let walletId = await module.walletId(helper.randomNumber(2));
                        sql = "INSERT INTO " + config.Table.USER + " (username,pin,mobile_ip,platform) VALUES('"+sequelize_luckynumberint.escape(inputs.username)+"','"+sequelize_luckynumberint.escape(inputs.pin)+"','"+sequelize_luckynumberint.escape(ip)+"','lottobets') ";
                        console.log(sql)
                            await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
                            await tra_lucky.commit();
                            return response.send({
                                status: "success",
                                result: inputs,
                                message: "signUp successfully",
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
    module.walletId = async function(customid) {
        let tra_lucky = await sequelize_luckynumberint.transaction();
        try {
            let sql = "SELECT walletId FROM " + config.Table.USER + " WHERE walletId=" + sequelize_luckynumberint.escape(customid) + " AND platform='lottobets'  limit 1";
            let res = await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT})
            if (res.length) {
                var custom_code = [];
                while (custom_code.length < 1) {
                    var r = await helper.randomNumber(2);
                    if (custom_code.indexOf(r) === -1) custom_code.push(r);
                }
                await module.walletId(custom_code[0]);
                customid = custom_code[0];
            }

            return customid;
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
