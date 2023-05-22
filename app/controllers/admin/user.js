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
const accountSid = config.twilio_accountSid;
const authToken = config.twilio_authToken;
const client = require('twilio')(accountSid, authToken);
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
                        let walletId = (result[0]['walletId'])?result[0]['walletId']: await module.walletId(helper.randomNumber(3));
                        console.log("walletId=",walletId)
                        sql = "UPDATE " + config.Table.USER + "  SET token ="+sequelize_luckynumberint.escape(token)+",mobile_ip="+sequelize_luckynumberint.escape(ip)+", walletId='"+ walletId +"' WHERE userId="+sequelize_luckynumberint.escape(result[0].userId)+"";
                        await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.UPDATE});
                        result[0]['mobile_ip']=ip;
                        result[0]['token']=token;
                        result[0]['walletId']=walletId;
                        
                        let sql2 = `CALL GetIAVBalance(`+walletId+`)`; 
                        let finalbalance= await sequelize_luckynumberint.query(sql2, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
                        finalbalance=Object.values(JSON.parse(JSON.stringify(finalbalance[0])));
                        finalbalance= finalbalance[0].IAV_Balance;
                        finalbalance = Math.round(finalbalance) ;
                        result[0]['walletBalance']=finalbalance;
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
    module.forgot = async function(request, response){
            
        let tra_lucky = await sequelize_luckynumberint.transaction();
        let inputs = request.body;
        console.log("forgot==",inputs);
        
        let ip = request.connection.remoteAddress.replace(/^.*:/, '');
            try {
                    let sql = "SELECT userId,mobile,countryCode,pin FROM " + config.Table.USER + " WHERE userName=" + sequelize_luckynumberint.escape(inputs.username) + " AND platform='lottobets' limit 1";
                    let result = await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT})
                     
                    if (result.length) {
                        let to_mobile_no = '+' + result[0].countryCode + '' + result[0].mobile;
                        client.messages
                        .create({
                           body: 'Lottobets OTP: '+result[0].pin,
                           from: config.twilio_fromNumber,
                           to: to_mobile_no
                         })
                        .then(message => console.log(message.sid));
                        await tra_lucky.commit();
                        //sequelize_luckynumberint.release();
                        return response.send({
                            status: "success",
                            result: [],
                            message: "password successfully sent in your mobile number",
                            status_code: 200
                        });
                    } else {
                        return response.send({
                            status: "success",
                            result: result,
                            message: "Usename invalid",
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
                    if(sequelize_luckynumberint.escape(inputs.password)!=sequelize_luckynumberint.escape(inputs.confpassword)){
                        return response.send({
                            status: 'fail',
                            message: `Password and confirm password don't match`,
                            status_code: 422
                        });
                    }
                    let sql = "SELECT userName FROM " + config.Table.USER + " WHERE userName=" + sequelize_luckynumberint.escape(inputs.username) + " AND platform='lottobets'  limit 1";
                    let result = await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT})
                    let mobile_sql = "SELECT mobile FROM " + config.Table.USER + " WHERE mobile=" + sequelize_luckynumberint.escape(inputs.mobile) + " AND platform='lottobets' AND countryCode=" + sequelize_luckynumberint.escape(inputs.countryCode) + " limit 1";
                    let mobile_result = await sequelize_luckynumberint.query(mobile_sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
                    if (result.length) {
                        
                        await tra_lucky.commit();

                        return response.send({
                            status: 'fail',
                            message: 'Username taken',
                            status_code: 422
                        });
                    } else if (mobile_result.length) {
                        
                        await tra_lucky.commit();

                        return response.send({
                            status: 'fail',
                            message: 'Mobile number already in use',
                            status_code: 422
                        });
                    }else {
                        //let walletId = await module.walletId(helper.randomNumber(2));
                        let length = 12;
                        let timestamp = +new Date;

                        var _getRandomInt = function( min, max ) {
                        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
                        }


                        var ts = timestamp.toString();
                        var parts = ts.split( "" ).reverse();
                        var id = "";

                        for( var j = 0; j < length; ++j ) {
                        var index = _getRandomInt( 0, parts.length - 1 );
                        id += parts[index];  
                        }
                       
                        let npv_generate =  id;
                        
                        var M = new Date();
                        let walletId = npv_generate.toString()+''+M.getUTCMilliseconds().toString();

                        let float_sql = "SELECT ShiftID FROM `" + config.Table.FLOAT + "` WHERE siteId=" + sequelize_luckynumberint.escape(config.siteId) + " AND status='open' ORDER BY ShiftID desc  limit 1";
                        let float_result = await sequelize_luckynumberint.query(float_sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
                        let timezone_sql = "SELECT timezone FROM " + config.Table.GENERAL_SETTING + " WHERE siteId=" + sequelize_luckynumberint.escape(config.siteId) + " limit 1";
                        let timezone_result = await sequelize_luckynumberint.query(timezone_sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
                        if(timezone_result.length){
                            var timezone=timezone_result[0].timezone ;
                        }else{
                            var timezone='+2';
                        }
                        if(float_result.length){

                            let d3 = new Date(new Date().getTime() + (timezone*1000*60*60));
                            let djson = new Date(d3).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                            let timestamp =  dateFormat(djson, "yyyy-mm-dd HH:MM:ss");
                            sql = "INSERT INTO " + config.Table.IAV_PURCHASE + " (shiftID,purchase_value,purchase_type,IAV_number,IAV_type,createDate) VALUES("+sequelize_luckynumberint.escape(float_result[0].ShiftID)+","+sequelize_luckynumberint.escape(config.purchase_value)+","+sequelize_luckynumberint.escape('cash')+","+sequelize_luckynumberint.escape(walletId)+",'purchased',"+sequelize_luckynumberint.escape(timestamp)+") ";
                            await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.INSERT});

                            sql = "INSERT INTO " + config.Table.IAV_RUNNING + " (IAV_number,last_running_iav,timestamp) VALUES("+sequelize_luckynumberint.escape(walletId)+","+sequelize_luckynumberint.escape(config.purchase_value)+","+sequelize_luckynumberint.escape(timestamp)+") ";
                            await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.INSERT});
                        }

                        sql = "INSERT INTO " + config.Table.USER + " (mobile,countryCode,userName,pin,mobile_ip,platform,walletId) VALUES("+sequelize_luckynumberint.escape(inputs.mobile)+","+sequelize_luckynumberint.escape(inputs.countryCode)+","+sequelize_luckynumberint.escape(inputs.username)+","+sequelize_luckynumberint.escape(inputs.password)+","+sequelize_luckynumberint.escape(ip)+",'lottobets','"+walletId+"') ";
                        console.log(sql)
                            await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.INSERT});
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
    module.addtoFavourite = async function(request, response){
            
        let tra_lucky = await sequelize_luckynumberint.transaction();
        let inputs = request.body;
        let ip = request.connection.remoteAddress.replace(/^.*:/, '');
        console.log("addtoFavourite==",inputs);
        
        
            try {
                
                let sql = "SELECT favourite as lottoId  FROM " + config.Table.USER + " WHERE userId=" + sequelize_luckynumberint.escape(inputs.userId) + "";
                let result_fav_lotto = await sequelize_cngapi.query(sql, { transaction: tra_lucky ,type: sequelize_cngapi.QueryTypes.SELECT})
                let lotto_id = (result_fav_lotto[0].lottoId)?result_fav_lotto[0].lottoId.split(','):[];
                let index = lotto_id.indexOf(inputs.lottoId);
                console.log("index==",index)
                 if(index<=-1 && inputs.flag=='yes'){
                    lotto_id.push(inputs.lottoId);
                    sql = "UPDATE " + config.Table.USER + " SET favourite ='"+lotto_id.toString()+"' WHERE userId="+sequelize_luckynumberint.escape(inputs.userId)+" ";
                    console.log("sql==",sql)
                    await sequelize_cngapi.query(sql, { transaction: tra_lucky ,type: sequelize_cngapi.QueryTypes.UPDATE});
                    await tra_lucky.commit();
                    return response.send({
                        status: "success",
                        result: inputs,
                        message: "favourite successfully",
                        status_code: 200
                    });
                 }
                 else if(index>-1 && inputs.flag=='no'){
                    lotto_id.splice(index, 1);
                    sql = "UPDATE " + config.Table.USER + " SET favourite ='"+lotto_id.toString()+"' WHERE userId="+sequelize_luckynumberint.escape(inputs.userId)+" ";
                    console.log("sql==",sql)
                    await sequelize_cngapi.query(sql, { transaction: tra_lucky ,type: sequelize_cngapi.QueryTypes.UPDATE});
                    await tra_lucky.commit();
                    return response.send({
                        status: "success",
                        result: inputs,
                        message: "unfavourite successfully",
                        status_code: 200
                    });
                 }else{
                   return response.send({
                        status: 'fail',
                        message: 'Please enter valid data',
                        status_code: 422
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
                    var r = await helper.randomNumber(3);
                    if (custom_code.indexOf(r) === -1) custom_code.push(r);
                }
                await module.walletId(custom_code[0]);
                customid = custom_code[0];
            }
            await tra_lucky.commit();
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
