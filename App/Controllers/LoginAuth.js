var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var jwtcofig = {
    'secret': 'AisJwtAuth'
};
var dateFormat = require('dateformat');
// nodemialer to send email
const nodemailer = require('nodemailer');
// create a defaultTransport using gmail and authentication that are
// stored in the `config.js` file.
var defaultTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: Sys.Config.App.mailer.auth.user,
        pass: Sys.Config.App.mailer.auth.pass
    }
});
const accountSid = Sys.Config.App.twilio.accountSid;
const authToken = Sys.Config.App.twilio.authToken;
const client = require('twilio')(accountSid, authToken);


module.exports = {

    postSignup: async function(req, res) {
        try {

            let inputs = req.body;
            let checkLoginStatus="SELECT * FROM "+Sys.Config.Table.MOBILE_DEVICE_ID+" WHERE mobile_device_id='"+inputs.mobile_device_id+"' order by id desc limit 1";
            let LoginStatus = await getResult(checkLoginStatus);
            if(LoginStatus.length)
            {   
                if(LoginStatus[0].status=='1'){
                    return res.send({
                    status: 'fail',
                    message: "Your Device is Blocked",
                    status_code: 404
                    }).end();
                }
                
            }else{
                let checkLoginStatus="INSERT INTO "+Sys.Config.Table.MOBILE_DEVICE_ID+" (mobile_device_id,status) VALUES('"+inputs.mobile_device_id+"','0')";
                await getResult(checkLoginStatus);
            }
			
            let sql = "SELECT userId,mobile,countryCode,fullName,userName  FROM " + Sys.Config.Table.USER + " WHERE mobile=" + Sys.SqlPool.escape(inputs.mobile) + " AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + " limit 1";

            let result = await getResult(sql);
            let otp = Math.floor(1000 + Math.random() * 9000);
            let data = result[0];
            if (result.length && (data.fullName!='' && data.fullName!=null && data.fullName!='null' && data.userName!='' && data.userName!=null && data.userName!='null')) {
               return res.send({
                    status: 'fail',
                    result: '',
                    message: "Mobile number already used",
                    status_code: 422
                }).end();
            } else {
				var now = new Date();
                let today =  dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                let to_mobile_no = '+' + inputs.countryCode + '' + inputs.mobile;
                 if(data && (data.fullName=='' || data.fullName==null || data.fullName=='null' || data.userName=='' || data.userName==null || data.userName=='null')){
                    client.messages
                    .create({
                       body: 'Lucky Numbers OTP: '+otp,
                       from: Sys.Config.App.twilio.fromNumber,
                       to: to_mobile_no
                     })
                    .then(message => console.log(message.sid));
                    let user_update = "UPDATE " + Sys.Config.Table.USER + " SET fullName=" + Sys.SqlPool.escape(inputs.fullName) + ",userName=" + Sys.SqlPool.escape(inputs.userName) + " WHERE userId='"+ data.userId +"' ";
                    //console.log('===',sql)
                    await getResult(user_update);
                    console.log("======otp==",otp)
                    return res.send({
                        userId: data.userId,
                        countryCode: inputs.countryCode,
                        mobile: inputs.mobile,
                        status: "success",
                        otp: otp,
                        message: "Your mobile number successfully registered.",
                        status_code: 200
                    }).end();

                 }else{
                    let sql = "INSERT INTO " + Sys.Config.Table.USER + "(mobile,countryCode,fullName,userName,mobile_device_id,created_at) VALUES(" + Sys.SqlPool.escape(inputs.mobile) + "," + Sys.SqlPool.escape(inputs.countryCode) + "," + Sys.SqlPool.escape(inputs.fullName) + "," + Sys.SqlPool.escape(inputs.userName) + "," + Sys.SqlPool.escape(inputs.mobile_device_id) + ",'" + today + "')";
                    //console.log('===',sql)
                    let result = await getResult(sql);
                    client.messages
                    .create({
                       body: 'Lucky Numbers OTP: '+otp,
                       from: Sys.Config.App.twilio.fromNumber,
                       to: to_mobile_no
                     })
                    .then(message => console.log(message.sid));

                    return res.send({
                        userId: result.insertId,
                        countryCode: inputs.countryCode,
                        mobile: inputs.mobile,
                        status: "success",
                        otp: otp,
                        message: "Your mobile number successfully registered.",
                        status_code: 200
                    }).end();

                 }
                
            }

        } catch (e) {
            Sys.Log.error("Error in postSignup", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },
    otpVerify: async function(req, res) {
        try {

            let inputs = req.body;
            console.log('otpVerify',inputs)
            let sql = "SELECT userId FROM " + Sys.Config.Table.USER + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY created_at DESC limit 1";

            let result = await getResult(sql);

            if (result.length) {
                var d = new Date();
                var date = d.getFullYear() + "-" +
                    ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                    ("00" + d.getDate()).slice(-2) + " " +
                    ("00" + d.getHours()).slice(-2) + ":" +
                    ("00" + d.getMinutes()).slice(-2) + ":" +
                    ("00" + d.getSeconds()).slice(-2);
                let otpFlag = "UPDATE " + Sys.Config.Table.USER + " SET otp_verify='1',deviceId=" + Sys.SqlPool.escape(inputs.deviceId) + ", mobile_ip=" + Sys.SqlPool.escape(inputs.mobile_ip) + ", updated_at=" + Sys.SqlPool.escape(date) + " WHERE  userId=" + Sys.SqlPool.escape(inputs.userId) + "";
                let otpFlagResult = await getResult(otpFlag);
                console.log('OTP verify successfully',{
                    status: 'success',
                    userId: inputs.userId,
                    message: "OTP verify successfully",
                    status_code: 200
                })
                res.send({
                    status: 'success',
                    userId: inputs.userId,
                    message: "OTP verify successfully",
                    status_code: 200
                }).end();
            } else {

                return res.send({
                    status: "fail",
                    message: "Data not found",
                    status_code: 422
                }).end();
            }

        } catch (e) {
            Sys.Log.error("Error in postSignup", e);
            return res.send("postSignup!! Error").end();
        }
    },

    otpResend: async function(req, res) {

        try {


            let inputs = req.body;
            console.log('otpResend',inputs)
            let sql = "SELECT userId,mobile,countryCode FROM " + Sys.Config.Table.USER + " WHERE mobile='" + inputs.mobile + "' AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + " AND userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY created_at DESC limit 1";
            let result = await getResult(sql);

            if (result.length) {
                let otp = Math.floor(1000 + Math.random() * 9000);
                let to_mobile_no = '+' + inputs.countryCode + '' + inputs.mobile;
                client.messages
                 .create({
                    body: 'Lucky Numbers OTP: '+otp,
                    from: Sys.Config.App.twilio.fromNumber,
                    to: to_mobile_no
                  })
                 .then(message => console.log(message.sid));
                return res.send({
                    countryCode: inputs.countryCode,
                    mobile: inputs.mobile,
                    userId: result.userId,
                    status: "success",
                    otp: otp,
                    message: "Otp resend successfully",
                    status_code: 200
                }).end();
            } else {
                return res.send({
                    status: "fail",
                    message: "Data not found..!",
                    status_code: 422
                }).end();
            }

        } catch (e) {
            Sys.Log.error("Error in otpResend", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },

    setPin: async function(req, res) {
        try {

            let inputs = req.body;
            //console.log('====',inputs)
            var d = new Date();
            var date = d.getFullYear() + "-" +
                ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                ("00" + d.getDate()).slice(-2) + " " +
                ("00" + d.getHours()).slice(-2) + ":" +
                ("00" + d.getMinutes()).slice(-2) + ":" +
                ("00" + d.getSeconds()).slice(-2);

            if (inputs.pin != inputs.confirmPin) {
                return res.send({
                    status: "fail",
                    message: "confirmPin not match!",
                    status_code: 422
                }).end();
            } else {
                let sql = "SELECT userId,mobile,countryCode FROM " + Sys.Config.Table.USER + " WHERE mobile=" + Sys.SqlPool.escape(inputs.mobile) + " AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + " AND userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY created_at DESC limit 1";
                let result = await getResult(sql);
                // console.log(sql);
                if (result.length) {
                    let PinSet = "UPDATE " + Sys.Config.Table.USER + " SET pin=" + Sys.SqlPool.escape(inputs.pin) + ",updated_at=" + Sys.SqlPool.escape(date) + " WHERE mobile=" + Sys.SqlPool.escape(inputs.mobile) + " AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + " AND userId=" + Sys.SqlPool.escape(inputs.userId) + "";
                    let pinResult = await getResult(PinSet);
                    return res.send({
                        countryCode: inputs.countryCode,
                        mobile: inputs.mobile,
                        userId: inputs.userId,
                        status: "success",
                        message: "Pin set successfully",
                        status_code: 200
                    }).end();
                } else {
                    return res.send({
                        status: "fail",
                        message: "Data not found..!",
                        status_code: 422
                    }).end();
                }

            }


        } catch (e) {
            Sys.Log.error("Error in setPin", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },
    pinVerify: async function(req, res) {
        try {

            let inputs = req.body;
            let sql = "SELECT userId,mobile,countryCode FROM " + Sys.Config.Table.USER + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY created_at DESC limit 1";

            let result = await getResult(sql);

            if (result.length) {

                var d = new Date();
                var date = d.getFullYear() + "-" +
                    ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                    ("00" + d.getDate()).slice(-2) + " " +
                    ("00" + d.getHours()).slice(-2) + ":" +
                    ("00" + d.getMinutes()).slice(-2) + ":" +
                    ("00" + d.getSeconds()).slice(-2);
                let otpFlag = "UPDATE " + Sys.Config.Table.USER + " SET pin_verify='1',updated_at=" + Sys.SqlPool.escape(date) + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + "";
                let otpFlagResult = await getResult(otpFlag);
                res.send({
                    status: 'success',
                    userId: inputs.userId,
                    message: "PIN verify successfully",
                    status_code: 200
                }).end();
            } else {
                return res.send({
                    status: "fail",
                    message: "Data not found",
                    status_code: 422
                }).end();
            }

        } catch (e) {
            Sys.Log.error("Error in postSignup", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },
    questionList: async function(req, res) {
        try {

            let inputs = req.body;


            let sql = "SELECT userId FROM " + Sys.Config.Table.USER + " WHERE mobile='" + inputs.mobile + "' AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + " AND userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY created_at DESC limit 1";
            let result = await getResult(sql);

            if (result.length) {
                let sql = "SELECT * FROM " + Sys.Config.Table.QUESTIONLIST + " WHERE status='0'";
                let questionList = await getResult(sql);
                return res.send({
                    countryCode: inputs.countryCode,
                    mobile: inputs.mobile,
                    result: questionList,
                    status: "success",
                    message: "List of Question",
                    status_code: 200
                }).end();
            } else {
                return res.send({
                    status: "fail",
                    message: "Data not found..!",
                    status_code: 422
                }).end();
            }

        } catch (e) {
            Sys.Log.error("Error in questionList", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },

    setSecurityQuestion: async function(req, res) {
        try {

            let inputs = req.body;
            var d = new Date();
            var date = d.getFullYear() + "-" +
                ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                ("00" + d.getDate()).slice(-2) + " " +
                ("00" + d.getHours()).slice(-2) + ":" +
                ("00" + d.getMinutes()).slice(-2) + ":" +
                ("00" + d.getSeconds()).slice(-2);
            let sql = "SELECT * FROM " + Sys.Config.Table.USER + " WHERE mobile=" + Sys.SqlPool.escape(inputs.mobile) + " AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + " AND userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY created_at DESC limit 1";
            let result = await getResult(sql);

            if (result.length) {

                let questionSet = "UPDATE " + Sys.Config.Table.USER + " SET question1=" + Sys.SqlPool.escape(inputs.question1) + ",answers1=" + Sys.SqlPool.escape(inputs.answers1) + ",question2=" + Sys.SqlPool.escape(inputs.question2) + ",answers2=" + Sys.SqlPool.escape(inputs.answers2) + ",updated_at=" + Sys.SqlPool.escape(date) + " WHERE mobile=" + Sys.SqlPool.escape(inputs.mobile) + " AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + " AND userId=" + Sys.SqlPool.escape(inputs.userId) + "";
                let questionList = await getResult(questionSet);
                let result = await getResult(sql);
                return res.send({
                    countryCode: inputs.countryCode,
                    mobile: inputs.mobile,
                    result: result,
                    status: "success",
                    message: "You have successfully set security question ",
                    status_code: 200
                }).end();
            } else {
                return res.send({
                    status: "fail",
                    message: "Data not found..!",
                    status_code: 422
                }).end();
            }

        } catch (e) {
            Sys.Log.error("Error in questionList", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },
    securityQuestionVerify: async function(req, res) {
        try {

            let inputs = req.body;
            let sql = "SELECT userId FROM " + Sys.Config.Table.USER + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY created_at DESC limit 1";

            let result = await getResult(sql);
			
            if (result.length) {

                var d = new Date();
                var date = d.getFullYear() + "-" +
                    ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                    ("00" + d.getDate()).slice(-2) + " " +
                    ("00" + d.getHours()).slice(-2) + ":" +
                    ("00" + d.getMinutes()).slice(-2) + ":" +
                    ("00" + d.getSeconds()).slice(-2);
                let otpFlag = "UPDATE " + Sys.Config.Table.USER + " SET security_question_verify='1',updated_at=" + Sys.SqlPool.escape(date) + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + "";
                let otpFlagResult = await getResult(otpFlag);
				let setting_sql = "INSERT INTO " + Sys.Config.Table.MOBILE_SETTING + " (withDraw,lottoResult,userId) VALUES('1','1',"+ Sys.SqlPool.escape(inputs.userId) + ")";
                let setting_result = await getResult(setting_sql);
                res.send({
                    status: 'success',
                    userId: inputs.userId,
                    message: "Security Question Verify successfully",
                    status_code: 200
                });
            } else {
                return res.send({
                    status: "fail",
                    message: "Data not found",
                    status_code: 422
                })
            }

        } catch (e) {
            Sys.Log.error("Error in postSignup", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            })
        }
    },

    login: async function(req, res) {
        try {
            console.log("login body",req.body);

            let inputs = req.body;
			while( inputs.mobile.charAt( 0 ) === '0' ){
                inputs.mobile = inputs.mobile.slice( 1 );
            }
            
            let sql = "SELECT * FROM " + Sys.Config.Table.USER + " WHERE mobile=" + Sys.SqlPool.escape(inputs.mobile) + " AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + " ORDER BY created_at DESC limit 1";
            
            //let result = await getResult(sql);
            let result = await getResult(sql);
			let data = result[0];
            if (result.length) {

                if(data.fullName=='' || data.fullName==null || data.fullName=='null' || data.userName=='' || data.userName==null || data.userName=='null'){
                    return res.send({
                       status: "fail",
                       message:"Please complete signup below",
                       status_code: 422
                    }).end();
                }
				
				//////////////////////////////////// block check///////////////////////////////
                let checkMobileDevice="SELECT * FROM "+Sys.Config.Table.MOBILE_DEVICE_ID+" WHERE mobile_device_id='"+inputs.mobile_device_id+"' limit 1";
                 checkMobileDevice = await getResult(checkMobileDevice);
                if(checkMobileDevice.length)
                {   
                    if(checkMobileDevice[0].status=='1'){
                        return res.send({
                        status: 'fail',
                        message: "Your Device is Blocked",
                        status_code: 404
                        }).end();
                    }
                    
                }else{
                    let sqlMobileDevice="INSERT INTO "+Sys.Config.Table.MOBILE_DEVICE_ID+" (mobile_device_id,status,userId) VALUES('"+inputs.mobile_device_id+"','0','"+data.userId+"')";
                     await getResult(sqlMobileDevice);
                }
				
				if(data.mobile_number_blocked=='1' && data.mobile==inputs.mobile && data.countryCode==inputs.countryCode){
                    return res.send({status : 'fail' , status_code:404, message : "Your Mobile Number is Blocked"});
                }else{
                 let sql2 = "UPDATE " + Sys.Config.Table.USER + " SET mobile_device_id=" + Sys.SqlPool.escape(inputs.mobile_device_id) + " WHERE userId="+ Sys.SqlPool.escape(data.userId) +" ";
                   await getResult(sql2);
                }
			   /////// Otp Screen check//////////////

              
              let otp_screen_flag = true;
              
              console.log("otp_screen_flag=",otp_screen_flag)
              let otp = Math.floor(1000 + Math.random() * 9000);
              if(otp_screen_flag){
              	
                console.log('Lucky Numbers OTP: ',otp);
                let to_mobile_no = '+' + inputs.countryCode + '' + inputs.mobile;
                client.messages
                .create({
                   body: 'Lucky Numbers OTP: '+otp,
                   from: Sys.Config.App.twilio.fromNumber,
                   to: to_mobile_no
                 })
                .then(message => console.log(message.sid))
                .catch(function (error) {
                  console.error(error)
                });
              }
                

                let result2 = await getResult(sql);;
                return res.send({
                    countryCode: inputs.countryCode,
                    mobile: inputs.mobile,
                    otp: otp,
					otp_screen_flag:otp_screen_flag,
                    result: result2,
                    status: "success",
                    message: "Otp send successfully",
                    status_code: 200
                }).end();
            } else {
                return res.send({
                    status: "fail",
                    message: "Mobile number not valid..!",
                    status_code: 422
                }).end();
            }



        } catch (e) {
            Sys.Log.error("Error in login", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },
    
    loginStatusUpadte: async function(req, res) {
        try {

            let inputs = req.body;
            let sql = "SELECT * FROM " + Sys.Config.Table.USER + " WHERE mobile=" + Sys.SqlPool.escape(inputs.mobile) + " AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + " ORDER BY created_at DESC limit 1";
            let result = await getResult(sql);
            //console.log('=====loginStatusUpadte',inputs)
            if (result.length) {
                var d = new Date();
                var date = d.getFullYear() + "-" +
                    ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                    ("00" + d.getDate()).slice(-2) + " " +
                    ("00" + d.getHours()).slice(-2) + ":" +
                    ("00" + d.getMinutes()).slice(-2) + ":" +
                    ("00" + d.getSeconds()).slice(-2);
                let token = jwt.sign({
                    login: true,
                    deviceId: inputs.deviceId
                }, jwtcofig.secret, {
                    //expiresIn: 60 * 60 * 24 // expires in 24 hours
                });
				
				/////////////////////////block check ///////////////////////
				
				let checkMobileDevice="SELECT * FROM "+Sys.Config.Table.MOBILE_DEVICE_ID+" WHERE mobile_device_id='"+result[0].mobile_device_id+"' limit 1";
                 checkMobileDevice = await getResult(checkMobileDevice);
                if(checkMobileDevice.length)
                {   
                    if(checkMobileDevice[0].status=='1'){
                        return res.send({
                        status: 'fail',
                        message: "Your Device is Blocked",
                        status_code: 404
                        }).end();
                    }else{
                        let device_sql = "UPDATE " + Sys.Config.Table.MOBILE_DEVICE_ID + " SET status='0', userId="+ Sys.SqlPool.escape(result[0].userId) +" WHERE mobile_device_id="+ Sys.SqlPool.escape(result[0].mobile_device_id) +" ";
                         getResult(device_sql);
                    }
                    
                }
                let loginStatusSql = "UPDATE " + Sys.Config.Table.USER + " SET loginStatus='1',updated_at=" + Sys.SqlPool.escape(date) + " ,token='" + token + "' WHERE mobile=" + Sys.SqlPool.escape(inputs.mobile) + " AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + "";
                
                let login =  getResult(loginStatusSql);
                let sql2 = "SELECT *,DATE_FORMAT(created_at,'%Y-%m-%d %H:%i:%s') AS created_at,DATE_FORMAT(updated_at,'%Y-%m-%d %H:%i:%s') AS updated_at FROM " + Sys.Config.Table.USER + " WHERE mobile=" + Sys.SqlPool.escape(inputs.mobile) + " AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + " AND loginStatus='1' ORDER BY created_at DESC limit 1";
                let result2 = await getResult(sql2);

                /////////// IAV Running add////////////////////

                
                let sql_iav_update="UPDATE " + Sys.Config.Table.MOBILEUSERIAV + " muil JOIN "+ Sys.Config.Table.IAV_RUNNING +" ir ON muil.IAV_number=ir.IAV_number SET ir.siteid = muil.siteId,ir.userId="+Sys.SqlPool.escape(result[0].userId)+" WHERE muil.userId="+Sys.SqlPool.escape(result[0].userId)+" AND ir.siteId IS NULL";
                 getResult(sql_iav_update);

                let iav_check = "SELECT IAV_number FROM " + Sys.Config.Table.MOBILEUSERIAV + " WHERE userId=" + Sys.SqlPool.escape(result[0].userId) + " GROUP BY id ORDER BY created_at DESC ";

                let result_iav_check = await getResult(iav_check);
                for (let i = 0; i < result_iav_check.length; i++) {
                    let iav_in_sql = "INSERT INTO " + Sys.Config.Table.IAV_IN_KIOSK + "(IAV,intime,userId,iav_status) VALUES(" + Sys.SqlPool.escape(result_iav_check[i].IAV_number) + "," + Sys.SqlPool.escape(date) + "," + Sys.SqlPool.escape(result[0].userId) + "," + Sys.SqlPool.escape('1') + ")";

                    let iav_in_result =  getResult(iav_in_sql);
                }
                
                return res.send({
                    countryCode: inputs.countryCode,
                    mobile: inputs.mobile,
                    result: result2,
                    status: "success",
                    message: "successful login",
                    token: token,
                    status_code: 200
                }).end();
            } else {
                return res.send({
                    status: "fail",
                    message: "Data not Found..!"
                }).end();
            }



        } catch (e) {
            Sys.Log.error("Error in login", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },
    forgotpin: async function(req, res) {
        try {
            console.log("forgotpin body",req.body);

            let inputs = req.body;
            let sql = "SELECT * FROM " + Sys.Config.Table.USER + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId);
            let result = await getResult(sql);
            console.log("result",result);
            if (result.length) {
                let userData = result[0];
                let countryCode = userData.countryCode;
                let mobile = userData.mobile;
                if(userData.pin){
                    let pin = Math.floor(1000 + Math.random() * 9000);
                    console.log('Lucky Numbers OTP: ',pin);
                    let to_mobile_no = '+' + countryCode + '' + mobile;
                    client.messages
                    .create({
                       body: 'Lucky Numbers OTP: '+pin,
                       from: Sys.Config.App.twilio.fromNumber,
                       to: to_mobile_no
                     })
                    .then(message =>console.log("forgotpin message id",message.sid))
                    .catch(function (error) {
                      console.error("forgotpin error",error);
                      return res.send({
                            status: "fail",
                            message: "You have not setted your pin. Please set pin first.",
                            status_code: 422
                        }).end();
                    });
                    let PinSet = "UPDATE " + Sys.Config.Table.USER + " SET pin=" + pin + " WHERE userId=" + userData.userId;
                    let pinResult = await getResult(PinSet);
                    return res.send({
                        pin : pin,
                        status: "success",
                        message: "Pin sent on your registered mobile number",
                        status_code: 200
                    }).end();
                }else{
                    return res.send({
                        status: "fail",
                        message: "You have not setted your pin. Please set pin first.",
                        status_code: 422
                    }).end();
                }
            } else {
                return res.send({
                    status: "fail",
                    message: "Mobile number not registered..!",
                    status_code: 422
                }).end();
            }
        } catch (e) {
            Sys.Log.error("Error in forgotpin", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },
    isApkVersionChanged : async function(req, res) {
        try {
            let inputs = req.body;
            console.log("isApkVersionChanged body",inputs);
            let apk_version = inputs.apk_version;
            let sql = "SELECT * FROM "+Sys.Config.Table.RET_CNG_APK+" WHERE apk_type='cng' ORDER BY id DESC LIMIT 1";
            let result = await getResult(sql);
            if(result.length){
                if(result[0].apk_version == apk_version){
                    return res.send({status:"success",message:"apk version matched"}).end();
                }else{
                    var hostname = req.headers.host; // hostname = 'localhost:8080'
                    console.log("hostname",hostname);
                    let apklink='http://' + hostname + "/apk/cng/"+result[0].apk_name;
                    console.log(apklink)
                    return res.send({status:"notmatch",message:"apk version not matched",link:apklink}).end();
                }
            }else{
                return res.send({status:"fail",message:"No apk found"}).end();
            }
        }catch(e){
            Sys.Log.error("Something went wrong", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },

    /////////////////////////Kiosk Guest mode //////////////////////////////
    checkAccessKey : async function(req, res) {
        try {
            let inputs = req.body;
            console.log("checkAccessKey body",inputs);
            let mode_access_key = inputs.mode_access_key;

            let sql = "SELECT * FROM "+Sys.Config.Table.MODE_ACCESS_KEY+" WHERE mode_key=" + Sys.SqlPool.escape(mode_access_key) +" LIMIT 1";
            let result = await getResult(sql);

            if(result.length){
                if(result[0].status=='0'){
                    return res.send({
                        status: "fail",
                        message: "Mode access disabled",
                        status_code: 422
                    }).end();
                }
                return res.send({
                        mode_access_key : mode_access_key,
                        status: "success",
                        message: "Mode setting key verify successful",
                        status_code: 200
                    }).end();
                
            }else{
                 sql = "SELECT * FROM "+Sys.Config.Table.GLOBAl_ACCESS_KEY+" WHERE global_key=" + Sys.SqlPool.escape(mode_access_key) +" LIMIT 1";
                 result = await getResult(sql);
                if(result.length){

                    return res.send({
                        mode_access_key : mode_access_key,
                        status: "success",
                        message: "Mode setting key verify successful",
                        status_code: 200
                    }).end();

                }else{
                    return res.send({
                        status: "fail",
                        message: "Your mode setting key wrong.!",
                        status_code: 422
                     }).end();
                }
            }
        }catch(e){
            Sys.Log.error("Something went wrong checkAccessKey", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();   
        }
    },
    guestTimerSave : async function(req, res) {
        try {
            let inputs = req.body;
            console.log("checkAccessKey body",inputs);
            let deviceId = inputs.deviceId;
            let time = inputs.time;
            let mode = inputs.mode;
            var now = new Date();
            let today =  dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            let sql = "SELECT * FROM "+Sys.Config.Table.GUEST_USER_TIMER+" WHERE deviceId=" + Sys.SqlPool.escape(deviceId) +" LIMIT 1";
            let result = await getResult(sql);
            if(result.length){
                 sql = "UPDATE "+Sys.Config.Table.GUEST_USER_TIMER+" SET time="+ Sys.SqlPool.escape(time) +",updated_at=" +Sys.SqlPool.escape(today)+", mode="+ Sys.SqlPool.escape(mode) +" WHERE deviceId=" + Sys.SqlPool.escape(deviceId) +" LIMIT 1";
                 result = await getResult(sql);
                return res.send({
                        time : time,
                        deviceId : deviceId,
                        mode : mode,
                        status: "success",
                        message: "Time save successful.",
                        status_code: 200
                    }).end();
                
            }else{
                 sql = "INSERT INTO  "+Sys.Config.Table.GUEST_USER_TIMER+" (deviceId,time,created_at,mode) VALUES("+ Sys.SqlPool.escape(deviceId) +","+ Sys.SqlPool.escape(time) +","+ Sys.SqlPool.escape(today) +","+ Sys.SqlPool.escape(mode) +") ";
                 result = await getResult(sql);
                
                    return res.send({
                        time : time,
                        deviceId : deviceId,
                        mode : mode,
                        status: "success",
                        message: "Time save successful.",
                        status_code: 200
                     }).end();
            }
        }catch(e){
            Sys.Log.error("Something went wrong guestTimerSave", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();   
        }
    },
    getUserMode : async function(req, res) {
        try {
            let inputs = req.body;
            console.log("checkAccessKey body",inputs);
            let deviceId = inputs.deviceId;
            
            let sql = "SELECT * FROM "+Sys.Config.Table.GUEST_USER_TIMER+" WHERE deviceId=" + Sys.SqlPool.escape(deviceId) +" LIMIT 1";
            let result = await getResult(sql);
            if(result.length){
                return res.send({
                        mode : result[0].mode,
                        deviceId : deviceId,
                        status: "success",
                        message: "Mode get successful.",
                        status_code: 200
                     }).end();
                
            }else{
                return res.send({
                        mode : "0",
                        deviceId : deviceId,
                        status: "success",
                        message: "Mode get successful.",
                        status_code: 200
                     }).end();
            }
        }catch(e){
            Sys.Log.error("Something went wrong getUserMode", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();   
        }
    },
    guestLogin: async function(req, res) {
        try {
            console.log("login body",req.body);

            let inputs = req.body;
            let iav = inputs.iav;
            let shiftID = "";
            let siteId = "";
            let siteName = "";
            let iavId = "";
            let Purchased_date = "";
            let balance = 0;
            var d = new Date();
            var date = d.getFullYear() + "-" +
                ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                ("00" + d.getDate()).slice(-2) + " " +
                ("00" + d.getHours()).slice(-2) + ":" +
                ("00" + d.getMinutes()).slice(-2) + ":" +
                ("00" + d.getSeconds()).slice(-2);

            while( inputs.mobile.charAt( 0 ) === '0' ){
                inputs.mobile = inputs.mobile.slice( 1 );
            }

            //////////////iav check/////////////////////
            let iav_running_check = "SELECT IAV FROM " + Sys.Config.Table.IAV_IN_KIOSK + " WHERE IAV=" + Sys.SqlPool.escape(inputs.IAV_number) + " ORDER BY intime DESC";
            let result_running_check = await getResult(iav_running_check);
            if (result_running_check.length > 0) {
                return res.send({
                    status: 'fail',
                    message: "IAV loaded on another device",
                    status_code: 422
                }).end();
            }
            let iav_check = "SELECT id,shiftID,DATE_FORMAT(createDate,'%Y-%m-%d %H:%i:%s') AS createDate,purchase_value FROM " + Sys.Config.Table.IAV_PURCHASE + " WHERE IAV_number=" + Sys.SqlPool.escape(inputs.iav) + " ORDER BY createDate DESC LIMIT 1";

            let result_iav_check = await getResult(iav_check);

            if (!result_iav_check.length) {
                return res.send({
                    status: 'fail',
                    message: "Not valid IAV",
                    status_code: 422
                }).end();
            }else{

                let added_iav_check = "SELECT mui.id,mui.IAV_number,u.mobile,u.countryCode FROM " + Sys.Config.Table.MOBILEUSERIAV + " mui LEFT JOIN " + Sys.Config.Table.USER + " u ON mui.userId=u.userId WHERE mui.IAV_number=" + Sys.SqlPool.escape(iav) + " ORDER BY mui.created_at DESC LIMIT 1";
                let result_added_iav = await getResult(added_iav_check);
                if (result_added_iav.length) {
                    result_added_iav=JSON.parse(JSON.stringify(result_added_iav[0]));
                    console.log("result_added_iav=",result_added_iav)
                    if(result_added_iav.IAV_number==iav && (result_added_iav.countryCode!=inputs.countryCode || result_added_iav.mobile!=inputs.mobile)){
                        return res.send({
                            status: 'fail',
                            message: "Your IAV number used in another mobile number.!",
                            status_code: 422
                        }).end();
                    }
                }
                balance = result_iav_check[0].purchase_value;
                iavId = result_iav_check[0].id;
                Purchased_date = result_iav_check[0].createDate;
                shiftID = result_iav_check[0].shiftID;

                let site_detail = "SELECT f.shiftID,g.siteName,f.siteId FROM `" + Sys.Config.Table.FLOAT + "` f LEFT JOIN " + Sys.Config.Table.GENERAL_SETTING + " g ON f.siteId=g.siteId WHERE f.ShiftID=" + Sys.SqlPool.escape(result_iav_check[0].shiftID) + " ORDER BY g.createDate DESC LIMIT 1";

                let result_site_detail = await getResult(site_detail);
                
                siteName = result_site_detail[0].siteName;
                siteId = result_site_detail[0].siteId;
            }
            let withDrawAmount =  "SELECT sum(last_running_iav) AS balance FROM  "+ Sys.Config.Table.IAV_RUNNING +" WHERE IAV_number=" + Sys.SqlPool.escape(iav) + " AND refundDate IS NOT NULL order by id desc";
                withDrawAmount = await getResult(withDrawAmount);
                let sql_balance = `CALL GetIAVBalance(`+Sys.SqlPool.escape(iav)+`)`; 
                let finalbalance= await getResult(sql_balance);
                finalbalance=Object.values(JSON.parse(JSON.stringify(finalbalance[0])));
                finalbalance= finalbalance[0].IAV_Balance;
                let iav_balance = Math.round(finalbalance) ;
                if(parseFloat(iav_balance)>0 && parseFloat(withDrawAmount[0].balance)>0){
                    iav_balance = parseFloat(iav_balance) - parseFloat(withDrawAmount[0].balance) ;
                }

            let sql = "SELECT * FROM " + Sys.Config.Table.USER + " WHERE mobile=" + Sys.SqlPool.escape(inputs.mobile) + " AND countryCode=" + Sys.SqlPool.escape(inputs.countryCode) + " ORDER BY created_at DESC limit 1";
            let result = await getResult(sql);
            let data = result[0];
            
            if (result.length) {
                let userId = result[0].userId;
                //////////////////////////////////// block check///////////////////////////////
                let checkMobileDevice="SELECT * FROM "+Sys.Config.Table.MOBILE_DEVICE_ID+" WHERE mobile_device_id='"+inputs.mobile_device_id+"' limit 1";
                 checkMobileDevice = await getResult(checkMobileDevice);
                if(checkMobileDevice.length)
                {   
                    if(checkMobileDevice[0].status=='1'){
                        return res.send({
                        status: 'fail',
                        message: "Your Device is Blocked",
                        status_code: 404
                        }).end();
                    }
                    
                }else{
                    let sqlMobileDevice="INSERT INTO "+Sys.Config.Table.MOBILE_DEVICE_ID+" (mobile_device_id,status,userId) VALUES('"+inputs.mobile_device_id+"','0','"+data.userId+"')";
                    await getResult(sqlMobileDevice);
                }
                
                if(data.mobile_number_blocked=='1' && data.mobile==inputs.mobile && data.countryCode==inputs.countryCode){
                    return res.send({status : 'fail' , status_code:404, message : "Your Mobile Number is Blocked"});
                }else{
                 let sql2 = "UPDATE " + Sys.Config.Table.USER + " SET mobile_device_id=" + Sys.SqlPool.escape(inputs.mobile_device_id) + ", mobile_ip=" + Sys.SqlPool.escape(inputs.mobile_ip) + " WHERE userId="+ Sys.SqlPool.escape(data.userId) +" ";
                   await getResult(sql2);
                }
               /////// Otp Screen check//////////////
               let otp_screen_flag = false;

               
                let result2 = await getResult(sql);

                ///////////////////mobile user iav check///////////
                let added_iav_check = "SELECT id FROM " + Sys.Config.Table.MOBILEUSERIAV + " WHERE IAV_number=" + Sys.SqlPool.escape(iav) + " ORDER BY created_at DESC LIMIT 1";
                let result_added_iav = await getResult(added_iav_check);
                if (!result_added_iav.length) {
                    let sql = "INSERT INTO " + Sys.Config.Table.MOBILEUSERIAV + "(userId,siteId,siteName,IAV_number,Purchased_date,balance,iavId) VALUES(" + Sys.SqlPool.escape(userId) + "," + Sys.SqlPool.escape(siteId) + "," + Sys.SqlPool.escape(siteName) + "," + Sys.SqlPool.escape(iav) + "," + Sys.SqlPool.escape(Purchased_date) + "," + Sys.SqlPool.escape(balance) + "," + Sys.SqlPool.escape(iavId) + ")";
                    let result = await getResult(sql);
                    
                }
                
                let iav_detaile={};
                iav_detaile.iav = iav;
                iav_detaile.siteId = siteId;
                iav_detaile.siteName = siteName;
                iav_detaile.purchased_date = Purchased_date;
                iav_detaile.balance = iav_balance;
                return res.send({
                    countryCode: inputs.countryCode,
                    mobile: inputs.mobile,
                    otp: "",
                    otp: "",
                    otp_screen_flag:otp_screen_flag,
                    result: result2,
                    iav_detaile: iav_detaile,
                    status: "success",
                    message: "Guest mode login successful",
                    status_code: 200
                }).end();
            } else {

                let checkLoginStatus="INSERT INTO "+Sys.Config.Table.MOBILE_DEVICE_ID+" (mobile_device_id,status) VALUES('"+inputs.mobile_device_id+"','0')";
                await getResult(checkLoginStatus);

                var now = new Date();
                let today =  dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                let to_mobile_no = '+' + inputs.countryCode + '' + inputs.mobile;
                let sql2 = "INSERT INTO " + Sys.Config.Table.USER + "(mobile,countryCode,mobile_device_id,created_at,mobile_ip,pin) VALUES(" + Sys.SqlPool.escape(inputs.mobile) + "," + Sys.SqlPool.escape(inputs.countryCode) + "," + Sys.SqlPool.escape(inputs.mobile_device_id) + ",'" + today + "', " + Sys.SqlPool.escape(inputs.mobile_ip) + ",'2017')";
                //console.log('===',sql)
                let result = await getResult(sql2);
                let userId = result.insertId;

                let result2 = await getResult(sql);
                ///////////////////mobile user iav check///////////
                let added_iav_check = "SELECT id FROM " + Sys.Config.Table.MOBILEUSERIAV + " WHERE IAV_number=" + Sys.SqlPool.escape(iav) + " ORDER BY created_at DESC LIMIT 1";
                let result_added_iav = await getResult(added_iav_check);
                if (!result_added_iav.length) {
                    let sql = "INSERT INTO " + Sys.Config.Table.MOBILEUSERIAV + "(userId,siteId,siteName,IAV_number,Purchased_date,balance,iavId) VALUES(" + Sys.SqlPool.escape(userId) + "," + Sys.SqlPool.escape(siteId) + "," + Sys.SqlPool.escape(siteName) + "," + Sys.SqlPool.escape(iav) + "," + Sys.SqlPool.escape(Purchased_date) + "," + Sys.SqlPool.escape(balance) + "," + Sys.SqlPool.escape(iavId) + ")";
                    let result = await getResult(sql);
                    
                }

                let iav_detaile={};
                iav_detaile.iav = iav;
                iav_detaile.siteId = siteId;
                iav_detaile.siteName = siteName;
                iav_detaile.purchased_date = Purchased_date;
                iav_detaile.balance = iav_balance;

                return res.send({
                    countryCode: inputs.countryCode,
                    mobile: inputs.mobile,
                    otp: "",
                    otp_screen_flag:false,
                    result: result2,
                    iav_detaile: iav_detaile,
                    status: "success",
                    message: "Guest mode login successful",
                    status_code: 200
                }).end();
            }



        } catch (e) {
            Sys.Log.error("Error in login", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },

    guestIavBalance: async function(req, res) {
        try {
            console.log("guestIavBalance=",req.body);
            let inputs = req.body;
            let iav = inputs.iav;

            let withDrawAmount =  "SELECT sum(last_running_iav) AS balance FROM  "+ Sys.Config.Table.IAV_RUNNING +" WHERE IAV_number='"+iav+"' AND refundDate IS NOT NULL order by id desc";
            withDrawAmount = await getResult(withDrawAmount);

            let sql_balance = `CALL GetIAVBalance(`+inputs.iav+`)`; 
            let finalbalance= await getResult(sql_balance);
            finalbalance=Object.values(JSON.parse(JSON.stringify(finalbalance[0])));
            finalbalance= finalbalance[0].IAV_Balance;
            let iav_balance = Math.round(finalbalance) ;
           
           if(parseFloat(iav_balance)>0 && parseFloat(withDrawAmount[0].balance)>0){
                        iav_balance = parseFloat(iav_balance) - parseFloat(withDrawAmount[0].balance) ;
             }
            

            return res.send({
                iav : inputs.iav,
                iav_balance : iav_balance,
                status: "success",
                message: "IAV balance get successful.",
                status_code: 200
             }).end();
           
        } catch (e) {
            Sys.Log.error("Error in login", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },
    



}
function getResult(sql){
      return new Promise(function(resolve,reject){
         Sys.SqlPool.getConnection( function(err, conn) {
                 conn.query(sql, async function(err, Result) {
                    conn.release();
                    //console.log(JSON.parse(JSON.stringify(Result)))
                    //ress=JSON.parse(JSON.stringify(Result));
                    if(err){
                        reject(JSON.parse(JSON.stringify(err)))
                      }else{
                        resolve(JSON.parse(JSON.stringify(Result)))
                      }
                })
                 
            })
      })
}
function getResult2(sql){
      return new Promise(function(resolve,reject){
         Sys.SqlPool2.getConnection( function(err, conn) {
                 conn.query(sql, async function(err, Result) {
                    conn.release();
                    //console.log(JSON.parse(JSON.stringify(Result)))
                    //ress=JSON.parse(JSON.stringify(Result));
                    if(err){
                        reject(JSON.parse(JSON.stringify(err)))
                      }else{
                        resolve(JSON.parse(JSON.stringify(Result)))
                      }
                })

            })
      })
}
/*function getResult(sql){
      return new Promise(function(resolve,reject){
        var mysql = require('mysql');
            var pool = mysql.createPool({
                connectionLimit: 1000000000,
                acquireTimeout: 100000,
                supportBigNumbers: true,
                bigNumberStrings: true,
                host: Sys.Config.Database[Sys.Config.Database.connectionType].sql.host,
                port:Sys.Config.Database[Sys.Config.Database.connectionType].sql.port,
                user: Sys.Config.Database[Sys.Config.Database.connectionType].sql.user,
                password: Sys.Config.Database[Sys.Config.Database.connectionType].sql.password,
                database: Sys.Config.Database[Sys.Config.Database.connectionType].sql.database
            })
                pool.getConnection( function(err, conn) {
                 conn.query(sql, async function(err, Result) {
                        console.log('==========conn==index==',pool._freeConnections.indexOf(conn)); // -1
                        conn.release();
                        console.log('==========conn==index==',pool._freeConnections.indexOf(conn)); // 0
                    //console.log(JSON.parse(JSON.stringify(Result)))
                    //ress=JSON.parse(JSON.stringify(Result));
                    if(err){
                        reject(JSON.parse(JSON.stringify(err)))
                      }else{
                        resolve(JSON.parse(JSON.stringify(Result)))
                      }
                });
                

            })
        pool.end();
      })
}
function getResult2(sql){
      return new Promise(function(resolve,reject){
        var mysql = require('mysql');
            var pool  = mysql.createPool({
                    connectionLimit: 1000000000,
                    acquireTimeout: 100000,
                    supportBigNumbers: true,
                    bigNumberStrings: true,
                    host: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.host,
                    port:Sys.Config.Database[Sys.Config.Database.connectionType2].sql.port,
                    user: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.user,
                    password: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.password,
                    database: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.database
                })
                pool.getConnection( function(err, conn) {
                 conn.query(sql, async function(err, Result) {
                        console.log('==========conn==index==',pool._freeConnections.indexOf(conn)); // -1
                        conn.release();
                        console.log('==========conn==index==',pool._freeConnections.indexOf(conn)); // 0
                    //console.log(JSON.parse(JSON.stringify(Result)))
                    //ress=JSON.parse(JSON.stringify(Result));
                    if(err){
                        reject(JSON.parse(JSON.stringify(err)))
                      }else{
                        resolve(JSON.parse(JSON.stringify(Result)))
                      }
                });
                

            })
                pool.end();
      })
}*/