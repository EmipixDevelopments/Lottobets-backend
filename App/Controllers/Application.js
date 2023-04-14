var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var jwtcofig = {
    'secret': 'AisJwtAuth'
};
var fs = require('fs');
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
var request = require('request');
module.exports = {


    addIAV: async function(req, res) {
        try {
            let inputs = req.body;
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

            let iav_running_check = "SELECT IAV FROM " + Sys.Config.Table.IAV_IN_KIOSK + " WHERE IAV=" + Sys.SqlPool.escape(inputs.IAV_number) + " ORDER BY intime DESC";
            let result_running_check = await getResult(iav_running_check);
            if (result_running_check.length > 0) {
                return res.send({
                    status: 'fail',
                    message: "IAV loaded on another device",
                    status_code: 422
                }).end();
            }
            let iav_check = "SELECT id,shiftID,DATE_FORMAT(createDate,'%Y-%m-%d %H:%i:%s') AS createDate,purchase_value FROM " + Sys.Config.Table.IAV_PURCHASE + " WHERE IAV_number=" + Sys.SqlPool.escape(inputs.IAV_number) + " ORDER BY createDate DESC LIMIT 1";

            let result_iav_check = await getResult(iav_check);

            if (!result_iav_check.length) {
                return res.send({
                    status: 'fail',
                    message: "Not valid IAV",
                    status_code: 422
                }).end();
            } else {
                balance = result_iav_check[0].purchase_value;
                iavId = result_iav_check[0].id;
                Purchased_date = result_iav_check[0].createDate;
                shiftID = result_iav_check[0].shiftID;
                //console.log('=====',Purchased_date)
                let site_detail = "SELECT f.shiftID,g.siteName,f.siteId FROM `" + Sys.Config.Table.FLOAT + "` f LEFT JOIN " + Sys.Config.Table.GENERAL_SETTING + " g ON f.siteId=g.siteId WHERE f.ShiftID=" + Sys.SqlPool.escape(result_iav_check[0].shiftID) + " ORDER BY g.createDate DESC LIMIT 1";

                let result_site_detail = await getResult(site_detail);
                // console.log('=====addiav',site_detail);
                // console.log('=====addiav',result_site_detail[0].siteId);
                // console.log('=====addiav',result_site_detail);
                siteName = result_site_detail[0].siteName;
                siteId = result_site_detail[0].siteId;

            }
            //console.log('=====addiavsiteId',result_site_detail);
            let added_iav_check = "SELECT id FROM " + Sys.Config.Table.MOBILEUSERIAV + " WHERE IAV_number=" + Sys.SqlPool.escape(inputs.IAV_number) + " ORDER BY created_at DESC LIMIT 1";
            let result_added_iav = await getResult(added_iav_check);
            if (result_added_iav.length) {
                return res.send({
                    status: 'fail',
                    message: "You have already added IAV",
                    status_code: 422
                }).end();
            }

            let sql = "INSERT INTO " + Sys.Config.Table.MOBILEUSERIAV + "(userId,siteId,siteName,IAV_number,Purchased_date,balance,iavId) VALUES(" + Sys.SqlPool.escape(inputs.userId) + "," + Sys.SqlPool.escape(siteId) + "," + Sys.SqlPool.escape(siteName) + "," + Sys.SqlPool.escape(inputs.IAV_number) + "," + Sys.SqlPool.escape(Purchased_date) + "," + Sys.SqlPool.escape(balance) + "," + Sys.SqlPool.escape(iavId) + ")";
            let result = await getResult(sql);
            let sql_iav_check="SELECT IAV_number FROM " + Sys.Config.Table.IAV_RUNNING + " WHERE IAV_number=" + Sys.SqlPool.escape(inputs.IAV_number) + " ORDER BY id DESC LIMIT 1";
            let iav_check_result = await getResult(sql_iav_check);
            if(iav_check_result.length>0){
                let sql_iav_update="UPDATE "+ Sys.Config.Table.IAV_RUNNING +" SET userId="+Sys.SqlPool.escape(inputs.userId)+", siteId="+Sys.SqlPool.escape(siteId)+" WHERE IAV_number=" + Sys.SqlPool.escape(iav_check_result[0].IAV_number) + "";
                //console.log('===',sql_iav_update)
                let iav_update_result = await getResult(sql_iav_update);
            }else{
                let iav_running_sql = "INSERT INTO " + Sys.Config.Table.IAV_RUNNING + "(userId,siteId,last_running_iav,IAV_number,timestamp,IAVshiftID) VALUES(" + Sys.SqlPool.escape(inputs.userId) + "," + Sys.SqlPool.escape(siteId) + "," + Sys.SqlPool.escape(balance) + "," + Sys.SqlPool.escape(inputs.IAV_number) + "," + Sys.SqlPool.escape(date) + "," + Sys.SqlPool.escape(shiftID) + ")";
                let iav_running_result = await getResult(iav_running_sql);
            }
            
            

            let iav_in_sql = "INSERT INTO " + Sys.Config.Table.IAV_IN_KIOSK + "(IAV,intime,userId,iav_status) VALUES(" + Sys.SqlPool.escape(inputs.IAV_number) + "," + Sys.SqlPool.escape(date) + "," + Sys.SqlPool.escape(inputs.userId) + "," + Sys.SqlPool.escape('1') + ")";
            let iav_in_result = await getResult(iav_in_sql);


            return res.send({
                status: 'success',
                message: "IAV added successfully",
                status_code: 200
            }).end();


        } catch (e) {
            console.log("Error in addIAV :", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },

    loadIAV: async function(req, res) {
        try {
            let inputs = req.body;
            //console.log('======load Iav',inputs)
            //let iav_check = "SELECT ir.userId,test.siteId,test.siteName,test.iavId,ir.IAV_number,test.id,DATE_FORMAT(test.Purchased_date,'%Y-%m-%d %H:%i:%s') AS Purchased_date,DATE_FORMAT(test.created_at,'%Y-%m-%d %H:%i:%s') AS created_at,ir.last_running_iav AS balance,TIMESTAMPDIFF(HOUR, ir.timestamp,now()) as diff FROM (SELECT MAX(ir.id) as id,ir.IAV_number,uil.siteName,uil.iavId,uil.Purchased_date,uil.created_at,uil.id as ids,uil.siteId FROM " + Sys.Config.Table.MOBILEUSERIAV + " uil JOIN " + Sys.Config.Table.IAV_RUNNING + " ir ON uil.IAV_number=ir.IAV_number WHERE uil.userId=" + Sys.SqlPool.escape(inputs.userId) + " GROUP BY ir.IAV_number) test JOIN iav_running ir ON test.id=ir.id WHERE   (TIMESTAMPDIFF(HOUR, ir.timestamp,now())<48 or ir.last_running_iav>0)";
            let iav_check = "SELECT ir.userId,test.siteId,test.siteName,test.iavId,ir.IAV_number,test.id,DATE_FORMAT(test.Purchased_date,'%Y-%m-%d %H:%i:%s') AS Purchased_date,DATE_FORMAT(test.created_at,'%Y-%m-%d %H:%i:%s') AS created_at,ir.last_running_iav AS balance,TIMESTAMPDIFF(HOUR, ir.timestamp,now()) as diff FROM (SELECT MAX(ir.id) as id,ir.IAV_number,uil.siteName,uil.iavId,uil.Purchased_date,uil.created_at,uil.id as ids,uil.siteId FROM " + Sys.Config.Table.MOBILEUSERIAV + " uil JOIN " + Sys.Config.Table.IAV_RUNNING + " ir ON uil.IAV_number=ir.IAV_number WHERE uil.userId=" + Sys.SqlPool.escape(inputs.userId) + " GROUP BY ir.IAV_number) test JOIN iav_running ir ON test.id=ir.id WHERE ir.last_running_iav>0 order by test.created_at DESC";


            //console.log('====?',iav_check)
            let result_iav_check = await getResult(iav_check);
            ////////////////Block Iav Check////////////////////
            let sql_block_iav_check = "SELECT iav FROM " + Sys.Config.Table.BLOCK_IAV_LIST + "";
            let result_block_iav = await getResult(sql_block_iav_check);
            let block_iav_arrr = [];
            for(let i=0;i<result_block_iav.length;i++){
                block_iav_arrr.push(result_block_iav[i].iav.trim());
             
            }
            for(let i=0;i<result_iav_check.length;i++){
                let index = block_iav_arrr.indexOf(result_iav_check[i].IAV_number);
                // console.log("iav=",result_iav_check[i].IAV_number)
                // console.log("index=",index)
                result_iav_check[i]['iav_block_status'] = true ;
                if(index<0){
                    result_iav_check[i]['iav_block_status'] = false;
                }
                
            }
             //console.log('====1',result_iav_check)
            if (!result_iav_check.length) {
                return res.send({
                    status: 'success',
                    message: "IAV not available",
                    status_code: 422
                }).end();
            }
        //console.log('====3load Iav',result_iav_check)

            return res.send({
                status: 'success',
                result: result_iav_check,
                message: "User IAV list",
                status_code: 200
            }).end();


        } catch (e) {
            console.log("Error in addIAV :", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },

    getProfile: async function(req, res) {
        try {
            let inputs = req.body;
            let getProfile = "SELECT *,DATE_FORMAT(created_at,'%Y-%m-%d %H:%i:%s') AS created_at,DATE_FORMAT(updated_at,'%Y-%m-%d %H:%i:%s') AS updated_at FROM " + Sys.Config.Table.USER + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY created_at DESC ";
            let result_getProfile = await getResult(getProfile);

            if (!result_getProfile.length) {
                return res.send({
                    status: 'success',
                    message: "Profile data not available",
                    status_code: 422
                }).end();
            }
            result_getProfile[0].win = "0";
            /*let transaction_sql = "SELECT SUM(stake_value) AS transaction_amt FROM " + Sys.Config.Table.PLAYED_EVENT_DETAILS + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY createdate DESC ";
            let result_transaction = await getResult(transaction_sql);

            result_getProfile[0].transaction = "";
            if(result_transaction.length>0){
                result_getProfile[0].transaction = result_transaction[0].transaction_amt;
            }
            let win_amt_sql = "SELECT SUM(stake_value) AS win_amt FROM " + Sys.Config.Table.PLAYED_EVENT_DETAILS + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " AND status='winning' ORDER BY createdate DESC ";
            let result_win_amt_sql = await getResult(win_amt_sql);
            if(result_win_amt_sql.length>0){
                result_getProfile[0].win = result_win_amt_sql[0].win_amt;
            }*/
			// let transaction_sql = "SELECT SUM(stake_value) AS transaction_amt FROM " + Sys.Config.Table.PLAYED_EVENT_DETAILS + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY createdate DESC ";
            let transaction_sql = "SELECT stake_value,status FROM " + Sys.Config.Table.PLAYED_EVENT_DETAILS + " where userId=" + Sys.SqlPool.escape(inputs.userId) + " order by NPV,IAV,stake_value desc";
            let result_transaction = await getResult(transaction_sql);

            let transaction = "";
            if(result_transaction.length>0){
                transaction = 0;
                for(let i=0;i<result_transaction.length;i++){
                    transaction = parseFloat(transaction) + parseFloat(result_transaction[i].stake_value)
                }
                //result_getProfile[0].transaction = result_transaction[0].transaction_amt;
                result_getProfile[0].transaction = transaction;
            }
            let win = "";
            if(result_transaction.length>0){
                win = 0;
                for(let i=0;i<result_transaction.length;i++){
                    if(result_transaction[i].status == 'winning'){
                        win = parseFloat(win) + parseFloat(result_transaction[i].stake_value)
                    }
                    
                }
                result_getProfile[0].win = win;
            }
            if (result_getProfile[0].photo == '' || result_getProfile[0].photo == 'null' || result_getProfile[0].photo == null) {
                result_getProfile[0].photo = 'ic_profile.png';
            }
			console.log({
                status: 'success',
                result: result_getProfile[0],
                message: "User Profile Detail",
                status_code: 200
            });
            return res.send({
                status: 'success',
                result: result_getProfile[0],
                message: "User Profile Detail",
                status_code: 200
            }).end();
        } catch (e) {
            Sys.Log.error("Error in GetProfile :", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },

    updateProfile: async function(req, res) {
        try {
            let inputs = req.body;
            let photo = "";
            var d = new Date();
            var date = d.getFullYear() + "-" +
                ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                ("00" + d.getDate()).slice(-2) + " " +
                ("00" + d.getHours()).slice(-2) + ":" +
                ("00" + d.getMinutes()).slice(-2) + ":" +
                ("00" + d.getSeconds()).slice(-2);

            let getProfile = "SELECT * FROM " + Sys.Config.Table.USER + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY created_at DESC ";

            let result_getProfile = await getResult(getProfile);

            if (!result_getProfile.length) {
                return res.send({
                    status: 'success',
                    message: "Profile data not available",
                    status_code: 422
                }).end();
            }
            if (result_getProfile[0].photo != '') {
                photo = result_getProfile[0].photo;
            }


            if (req.files) {
                let image = req.files.photo;
                let d = new Date();
                let time = d.getTime();
                let file = req.files.photo,
                    filename = time + '_' + file.name;

                if (result_getProfile[0].photo != '' && result_getProfile[0].photo == 'null' && result_getProfile[0].photo == null) {

                    fs.unlink(Sys.Config.Upload.PROFILE + result_getProfile[0].photo, function(err) {
                        if (err) throw err;
                        // if no error, file has been deleted successfully
                        console.log('File deleted!');
                    });

                }
                image.mv(Sys.Config.Upload.PROFILE + filename, function(err) {
                    if (err) {
                        return res.send({
                            status: 'success',
                            message: err,
                            status_code: 422
                        }).end();
                    }


                });
                result_getProfile[0].photo = filename;
                photo = filename;
            }

            if (result_getProfile[0].photo == '' && !req.files || result_getProfile[0].photo == 'null' || result_getProfile[0].photo == null) {
                result_getProfile[0].photo = 'ic_profile.png';
            }


            let profile = "UPDATE " + Sys.Config.Table.USER + " SET userName=" + Sys.SqlPool.escape(inputs.userName) + ",updated_at=" + Sys.SqlPool.escape(date) + ",photo=" + Sys.SqlPool.escape(photo) + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + "";
            //console.log('=====', profile)
            let profileResult = await getResult(profile);
            //result_getProfile[0].win = "";
            //result_getProfile[0].transaction = "";
			let transaction_sql = "SELECT stake_value,status FROM " + Sys.Config.Table.PLAYED_EVENT_DETAILS + " where userId=" + Sys.SqlPool.escape(inputs.userId) + " order by NPV,IAV,stake_value desc";
            let result_transaction = await getResult(transaction_sql);

            let transaction = "";
            if(result_transaction.length>0){
                transaction = 0;
                for(let i=0;i<result_transaction.length;i++){
                    transaction = parseFloat(transaction) + parseFloat(result_transaction[i].stake_value)
                }
                //result_getProfile[0].transaction = result_transaction[0].transaction_amt;
                result_getProfile[0].transaction = transaction;
            }
            let win = "";
            if(result_transaction.length>0){
                win = 0;
                for(let i=0;i<result_transaction.length;i++){
                    if(result_transaction[i].status == 'winning'){
                        win = parseFloat(win) + parseFloat(result_transaction[i].stake_value)
                    }
                    
                }
                result_getProfile[0].win = win;
            }
			
		   
            result_getProfile[0].userName = inputs.userName;

            return res.send({
                status: 'success',
                result: result_getProfile[0],
                message: "Profile Detail Updated",
                status_code: 200
            }).end();


        } catch (e) {
            Sys.Log.error("Error in updateProfile :", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },

    addFavouriteLotto: async function(req, res) {
        try {

            let inputs = req.body;

            if (inputs.flag == 'like') {
                let lottoName = "";
                lottoName = req.body.lottoName + ' added to favourites';
                let sql = "INSERT INTO " + Sys.Config.Table.MOBILE_USER_FAVOURITE_LOTTO_LIST + "(userId,lottoId,countryFlag,countryId) VALUES(" + Sys.SqlPool.escape(inputs.userId) + "," + Sys.SqlPool.escape(inputs.lottoId) + "," + Sys.SqlPool.escape(inputs.countryFlag) + "," + Sys.SqlPool.escape(inputs.countryId) + ")";
                let result =  getResult(sql);

                return res.send({
                    status: 'success',
                    message: lottoName,
                    status_code: 200
                }).end();

            } else {
                let lottoName = "";
                lottoName = req.body.lottoName + ' removed from favourites';
                let sql = "DELETE FROM " + Sys.Config.Table.MOBILE_USER_FAVOURITE_LOTTO_LIST + " WHERE userId='" + inputs.userId + "' AND lottoId='" + inputs.lottoId + "' AND countryFlag='" + inputs.countryFlag + "' AND countryId='" + inputs.countryId + "'";
                // console.log('===',sql)
                let result =  getResult(sql);

                return res.send({
                    status: 'success',
                    message: lottoName,
                    status_code: 200
                }).end();
            }



        } catch (e) {
            Sys.Log.error("Error in addIAV :", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },
    confirmBet: async function(req, res) {
        try {
            let inputs = req.body;
            console.log("request time", new Date());
            console.log('======confirmBet',inputs)
            inputs.regSelection = JSON.parse(inputs.regSelection.replace(/\//g, ""));
            inputs.bonusSelection = JSON.parse(inputs.bonusSelection.replace(/\//g, ""));
            inputs.balance = JSON.parse(inputs.balance.replace(/\//g, ""));
            inputs.winValue = JSON.parse(inputs.winValue.replace(/\//g, ""));
            inputs.stake_value = JSON.parse(inputs.stake_value.replace(/\//g, ""));
			////////////////Block Iav Check////////////////////
            let sql_block_iav_check = "SELECT iav FROM " + Sys.Config.Table.BLOCK_IAV_LIST + " WHERE iav="+Sys.SqlPool.escape(inputs.IAV)+"  LIMIT 1";
            let result_block_iav = await getResult(sql_block_iav_check);
            if(result_block_iav.length>0){
                return res.send({
                    status: 'fail',
                    message: "Your IAV Number has Blocked..!",
                    status_code: 422
                }).end();
            }
            if (inputs.regSelection.length > 0 || inputs.bonusSelection.length > 0) {
                let Multi_NPV_No = Sys.App.Controllers.Application.randomNPV();
                let bonusSelection = 0;
                if (inputs.regSelection.length > 0) {
                    arrayLength = inputs.regSelection.length
                }
                if (inputs.bonusSelection.length > 0) {
                    arrayLength = inputs.bonusSelection.length
                }
				
			let verifyBetAmount =0;
            for (let i = 0; i < arrayLength; i++) {
            	verifyBetAmount = parseFloat(verifyBetAmount) + parseFloat(inputs.stake_value[i]);
            }
            let iav_check = "SELECT ir.userId,test.siteId,test.siteName,test.iavId,ir.IAV_number,test.id,DATE_FORMAT(test.Purchased_date,'%Y-%m-%d %H:%i:%s') AS Purchased_date,DATE_FORMAT(test.created_at,'%Y-%m-%d %H:%i:%s') AS created_at,ir.last_running_iav AS balance FROM (SELECT MAX(ir.id) as id,ir.IAV_number,uil.siteName,uil.iavId,uil.Purchased_date,uil.created_at,uil.id as ids,uil.siteId FROM " + Sys.Config.Table.MOBILEUSERIAV + " uil JOIN " + Sys.Config.Table.IAV_RUNNING + " ir ON uil.IAV_number=ir.IAV_number WHERE uil.userId=" + Sys.SqlPool.escape(inputs.userId) + " and ir.IAV_number="+ Sys.SqlPool.escape(inputs.IAV) +" GROUP BY ir.IAV_number) test JOIN iav_running ir ON test.id=ir.id";
		    //let result_iav_check = await getResult(iav_check);
		    let sql_lotto_result_check = "SELECT IsPost,ID FROM " + Sys.Config.Table.LOTTOEVENT + " WHERE ID="+Sys.SqlPool.escape(inputs.eventId)+" and IsPost='1' AND `Result`!=''";

            let result_lotto_check = await getResult2(sql_lotto_result_check);
			if(result_lotto_check.length>0){
				return res.send({
					status: 'fail',
					message: "Event result already declared",
					status_code: 422
				}).end();
			}
			var IAVNumber=inputs.IAV;
			let sql2 = `CALL GetIAVBalance(`+IAVNumber+`)`; 
			let finalbalance= await getResult(sql2);
			finalbalance=Object.values(JSON.parse(JSON.stringify(finalbalance[0])));
			finalbalance= finalbalance[0].IAV_Balance;
            finalbalance = Math.round(finalbalance) ;
		   if(verifyBetAmount>finalbalance){
		   		return res.send({
                    status: 'fail',
                    message: "Insufficient IAV balance",
                    status_code: 422
                }).end();
		    }
            let siteSql = "SELECT SiteName FROM sitemanagement WHERE ID="+Sys.SqlPool.escape(inputs.siteId)+" LIMIT 1";
                let siteData = await getResult2(siteSql);

                console.log("response time", new Date())

                console.log("response",{
                    status: 'success',
                    message: "Bet confirm successfully",
                    status_code: 200
                });
                
                let sql = "SELECT * FROM "+Sys.Config.Table.GENERAL_SETTING+" WHERE status=true AND siteId="+Sys.SqlPool.escape(inputs.siteId);
                console.log("GetTimeZoneData sql",sql);
                let sitetimezone= await getResult(sql);
				if(sitetimezone.length){
					var timezone=sitetimezone[0].timezone ;
				}else{
					var timezone='+2';
				}
				
				
				
                

                let d2 = new Date(new Date().getTime() + (timezone*1000*60*60));
                let d = new Date(d2).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                let today =  dateFormat(d, "yyyy-mm-dd HH:MM:ss");
                console.log("today",today);
                
                res.send({
                    status: 'success',
                    message: "Bet confirm successfully",
                    status_code: 200
                }).end();
				let withDrawAmount =  "SELECT sum(last_running_iav) AS balance FROM  "+ Sys.Config.Table.IAV_RUNNING +" WHERE IAV_number='"+inputs.IAV+"' AND refundDate IS NOT NULL order by id desc";
				 withDrawAmount = await getResult(withDrawAmount);

                 let sql_end_point_url = "SELECT end_point_url FROM " + Sys.Config.Table.GENERAL_SETTING + " WHERE siteId="+Sys.SqlPool.escape(inputs.siteId)+"  LIMIT 1";
           
                let result_end_point_url = await getResult(sql_end_point_url);

                let userInfo = "SELECT mobile,countryCode FROM " + Sys.Config.Table.USER + " WHERE userId="+Sys.SqlPool.escape(inputs.userId)+"  LIMIT 1";
           
                userInfo = await getResult(userInfo);

                let kiosk_setting = "SELECT NPV_FootNote FROM " + Sys.Config.Table.KIOSK_SETTING + " WHERE siteId="+Sys.SqlPool.escape(inputs.siteId)+"  LIMIT 1";
           
                kiosk_setting = await getResult(kiosk_setting);
                let attachments = [];
                let attachments2 = [];

                for (let i = 0; i < arrayLength; i++) {
				if(inputs.winValue[i]!='' && inputs.stake_value[i]!='' && inputs.winValue[i]!='undefined' && inputs.stake_value[i]!='undefined' && inputs.winValue[i]!='null' && inputs.stake_value[i]!='null' && inputs.winValue[i]!=null && inputs.stake_value[i]!=null && inputs.winValue[i]!=undefined && inputs.stake_value[i]!=undefined)
				{
                    /////////////NPV Logic///////////
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
                    let npv = npv_generate.toString()+''+i+''+M.getUTCMilliseconds().toString();
                    //let npv = await Sys.App.Controllers.Application.checkNPV(npv_generate);
                    if (typeof inputs.bonusSelection[i] === 'undefined') {
                        inputs.bonusSelection[i] = "";
                    }
                    if (typeof inputs.regSelection[i] === 'undefined') {
                        inputs.regSelection[i] = "";
                    }
                    let sql = "INSERT INTO " + Sys.Config.Table.PLAYED_EVENT_DETAILS + " (IAV,eventId,lottoName,NPV,eventDrawTime,eventDay,regSelection,bonusSelection,marketId,winValue,stake_value,TotalNoSelection,status,siteid,country,Multi_NPV_No,userId,lottoId,createdate,mobile_betType) VALUES(" + Sys.SqlPool.escape(inputs.IAV) + "," + Sys.SqlPool.escape(inputs.eventId) + "," + Sys.SqlPool.escape(inputs.lottoName) + "," + Sys.SqlPool.escape(npv) + "," + Sys.SqlPool.escape(inputs.eventDrawTime) + "," + Sys.SqlPool.escape(inputs.eventDay) + "," + Sys.SqlPool.escape(inputs.regSelection[i]) + "," + Sys.SqlPool.escape(inputs.bonusSelection[i]) + "," + Sys.SqlPool.escape(inputs.marketId) + "," + Sys.SqlPool.escape(inputs.winValue[i]) + "," + Sys.SqlPool.escape(inputs.stake_value[i]) + "," + Sys.SqlPool.escape(inputs.marketName) + ",'pending'," + Sys.SqlPool.escape(inputs.siteId) + "," + Sys.SqlPool.escape(inputs.country) + "," + Sys.SqlPool.escape(Multi_NPV_No) + "," + Sys.SqlPool.escape(inputs.userId) + "," + Sys.SqlPool.escape(inputs.lottoId) + ",'" + today + "'," + Sys.SqlPool.escape(inputs.betType) + ")";
                    //console.log('===',sql)
                    let result = await getResult(sql);
					
					
					let sql_balance = `CALL GetIAVBalance(`+inputs.IAV+`)`; 
                    let finalbalance= await getResult(sql_balance);
                    finalbalance=Object.values(JSON.parse(JSON.stringify(finalbalance[0])));
                    finalbalance= finalbalance[0].IAV_Balance;
               		let iav_balance = Math.round(finalbalance) ;
					if(parseFloat(iav_balance)>0 && parseFloat(withDrawAmount[0].balance)>0){
						iav_balance = parseFloat(iav_balance) - parseFloat(withDrawAmount[0].balance) ;
					}
                    if (result) {
                        let sql_iav_running = "INSERT INTO iav_running (IAV_number,last_running_iav,description,siteId,userId,timestamp) VALUES(" + Sys.SqlPool.escape(inputs.IAV) + "," + Sys.SqlPool.escape(iav_balance) + "," + Sys.SqlPool.escape(result.insertId) + "," + Sys.SqlPool.escape(inputs.siteId) + "," + Sys.SqlPool.escape(inputs.userId) + "," + Sys.SqlPool.escape(today) + ")";
                        getResult(sql_iav_running);
                    }

                    let iavBalance = inputs.iavBalance;
                    
                    if (i > 0) {
                        iavBalance = iavBalance - inputs.stake_value[i];
                    }
                     sql2 = "INSERT INTO " + Sys.Config.Table.MOBILE_USER_BET_HISTORY + " (regSelection,bonusSelection,sitename,IAV,eventId,lottoName,NPV,eventDrawTime,eventDay,marketId,winValue,stake_value,marketName,status,siteid,country,userId,lottoId,credit,mobile_betType,created_at) VALUES("+Sys.SqlPool.escape(inputs.regSelection[i])+","+Sys.SqlPool.escape(inputs.bonusSelection[i])+","+Sys.SqlPool.escape(siteData[0].SiteName)+","+ Sys.SqlPool.escape(inputs.IAV) + "," + Sys.SqlPool.escape(inputs.eventId) + "," + Sys.SqlPool.escape(inputs.lottoName) + "," + Sys.SqlPool.escape(npv) + "," + Sys.SqlPool.escape(inputs.eventDrawTime) + "," + Sys.SqlPool.escape(inputs.eventDay) + "," + Sys.SqlPool.escape(inputs.marketId) + "," + Sys.SqlPool.escape(inputs.winValue[i]) + "," + Sys.SqlPool.escape(inputs.stake_value[i]) + "," + Sys.SqlPool.escape(inputs.marketName) + ",'pending'," + Sys.SqlPool.escape(inputs.siteId) + "," + Sys.SqlPool.escape(inputs.country) + "," + Sys.SqlPool.escape(inputs.userId) + "," + Sys.SqlPool.escape(inputs.lottoId) + "," + Sys.SqlPool.escape(iavBalance) + "," + Sys.SqlPool.escape(inputs.betType) + "," + Sys.SqlPool.escape(today) + ")";
                    let result2 =  getResult(sql2);


                    ////////////////json file data///////////////////
                    let d3 = new Date(new Date().getTime() + (timezone*1000*60*60));
                    let djson = new Date(d3).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                    let SendTime =  dateFormat(djson, "yyyy-mm-dd HH:MM:ss");
                    let json_data = {}
                    let Selection = '';

                    let len = inputs.IAV.length -4;
                    var regex = new RegExp(".{1,"+len+"}");
                    let IAV = inputs.IAV;
                    //IAV = IAV.replace(regex, (m) => "*".repeat(m.length));
                    IAV =  IAV.substr(id.length - 5);
                    IAV =  '*'+IAV;
                    if(inputs.regSelection[i]!=''){
                        Selection = inputs.regSelection[i].replace(/,/g, "-");
                    }
                    if(inputs.bonusSelection[i]!=''){
                        Selection = inputs.bonusSelection[i].replace(/,/g, "-")
                    }
                    json_data.SendTime = SendTime;
                    json_data.CreateTime = today;
                    json_data.Type = "NPV";
                    json_data.NPVNumber = npv;
                    json_data.IAVNumber = IAV;
                    json_data.ContactNumber = userInfo[0].countryCode+''+userInfo[0].mobile;
                    json_data.SiteID = inputs.siteId;
                    json_data.SiteName =siteData[0].SiteName;
                    json_data.Country =inputs.country;
                    json_data.ProfileName =inputs.lottoName;
                    json_data.DrawDate =inputs.eventDrawTime;
                    json_data.DrawDay =inputs.eventDay;
                    json_data.EventID =inputs.eventId;
                    json_data.Market =inputs.marketName;
                    json_data.Selection =Selection;
                    json_data.WinStake =inputs.winValue[i]+'/'+inputs.stake_value[i];
                    json_data.AdditionalInfo =kiosk_setting[0].NPV_FootNote;

                    // specify the path to the file, and create a buffer with characters we want to write
                    let path = Sys.Config.Upload.NPV +npv+'.cng';
                    //let buffer = Buffer.from(JSON.stringify(json_data));
                    let buffer = JSON.stringify(json_data);

                    attachments.push(npv);
                    if(result_end_point_url.length){
                        if(result_end_point_url[0].end_point_url){
                            let end_point = JSON.parse(result_end_point_url[0].end_point_url);
                            if((end_point.url_1_access  && end_point.url_1) || (end_point.url_2_access  && end_point.url_2)){
                                await fs.open(path, 'w', async function(err, fd) {
                                    if (err) {
                                        console.log('file Error====',err);
                                    }else{
                                        await fs.write(fd, buffer, async function(err) {
                                            if (err) {
                                                console.log('file Error write====',err);
                                            }else{
                                                fs.close(fd, function() {
                                                    console.log('wrote the file successfully');
                                                });
                                            }
                                            
                                        });
                                    }

                                    // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
                                    
                                });
                        }

                    }
                }
                 

				}
            }

            if(result_end_point_url.length){
                
                    if(result_end_point_url[0].end_point_url){
                    let end_point_url = JSON.parse(result_end_point_url[0].end_point_url);
                    var formData = {};
                    formData.my_field ='filename';
                        for(let f=0;f<attachments.length;f++){
                            if (fs.existsSync(Sys.Config.Upload.NPV+ attachments[f]+'.cng')) {
                                formData['filename_'+f] = fs.createReadStream(Sys.Config.Upload.NPV+ attachments[f]+'.cng');
                            }
                        }
                    if(end_point_url.url_1_access  && end_point_url.url_1){
                       await request.post({
                            url: end_point_url.url_1,
                            formData: formData
                        }, function optionalCallback(err, httpResponse, body) {
                            if (err) {
                                console.log('upload failed:', err);
                            }
                            console.log('Upload successful!  Server responded with:',body);
                        });

                    }
                    if(end_point_url.url_2_access && end_point_url.url_2){
                        await request.post({
                            url: end_point_url.url_2,
                            formData: formData
                        }, function optionalCallback(err, httpResponse, body) {
                            if (err) {
                                 console.log('upload failed:', err);
                            }
                            console.log('Upload successful!  Server responded with:',body);
                        });
                    }

                    
                    
                    for(let f=0;f<attachments.length;f++){
                        if (fs.existsSync(Sys.Config.Upload.NPV+ attachments[f]+'.cng')) {
                            fs.unlink(Sys.Config.Upload.NPV+ attachments[f]+'.cng', function(err) {
                            if (err){
                                console.log('File deleted err',err);
                            }else{
                                console.log('File deleted!');
                            }
                            
                            });
                        }
                        
                    }


                    }
                
            }
                
            } else {
                return res.send({
                    status: 'fail',
                    message: "Please select ball..!",
                    status_code: 422
                }).end();
            }

        } catch (e) {
            console.log("error ",e);
            //Sys.Log.eror("Error in addIAV :", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },

    randomNPV: function() {
        try {
            //let inputs = req.body ;
            var alphabet = '1234567890';
            var pass = '' //remember to declare $pass as an array
            var alphaLength = (alphabet.length) - 1; //put the length -1 in cache
            for (var i = 0; i < 11; i++) {
                var n = Math.floor((Math.random() * alphaLength) + 1);
                pass += alphabet[n]
            }
            return (pass); //turn the array into a string

        } catch (e) {
            Sys.Log.eror("Error in addIAV :", e);
            return {
                status: 'fail',
                message: e,
                status_code: 422
            }
        }
    },

    checkNPV: async function(npv) {
        try {
            let npv_check = "SELECT DISTINCT(NPV) FROM " + Sys.Config.Table.PLAYED_EVENT_DETAILS + " WHERE NPV='" + npv + "' ORDER BY `createdate` DESC LIMIT 1";
            let result_npv_check = await getResult(npv_check);

            if (result_npv_check.length > 0) {
                let new_npv = Sys.App.Application.randomNPV();
                //let check_npv = Sys.App.Application.checkNPV(new_npv);
                return Sys.App.Application.checkNPV(new_npv);;

            }
            // console.log('====?',npv);
            return npv;

        } catch (e) {
            //Sys.Log.eror("Error in checkNPV :", e);
            return {
                status: 'fail',
                message: e,
                status_code: 422
            }
        }
    },

    withDrawPinVerify: async function(req, res) {
        try {
            let inputs = req.body;
            let User = "SELECT userId,pin FROM " + Sys.Config.Table.USER + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + "";
            let UserResult = await getResult(User);
            if (UserResult.length > 0) {
                if (UserResult[0].pin != inputs.pin) {
                    return res.send({
                        status: 'fail',
                        message: "Invalid pin number..!",
                        status_code: 422
                    }).end();
                }
                return res.send({
                    status: 'success',
                    message: "Pin verify successfully",
                    status_code: 200
                }).end();
            } else {
                return res.send({
                    status: 'fail',
                    message: "User not found",
                    status_code: 422
                }).end();
            }

        } catch (e) {
            Sys.Log.eror("Error in  :", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },

    updateSetting: async function(req, res) {
        try {
            let inputs = req.body;
            let getSetting = "SELECT ID FROM " + Sys.Config.Table.MOBILE_SETTING + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY ID DESC ";

            let result_getSetting = await getResult(getSetting);
            let setting = {};
            if (result_getSetting.length > 0) {
                let setting_sql = "UPDATE " + Sys.Config.Table.MOBILE_SETTING + " SET withDraw=" + Sys.SqlPool.escape(inputs.withDraw) + ",lottoResult=" + Sys.SqlPool.escape(inputs.lottoResult) + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ";

                let result = await getResult(setting_sql);
                setting.userId = inputs.userId;
                setting.withDraw = inputs.withDraw;
                setting.lottoResult = inputs.lottoResult;
                return res.send({
                    status: 'success',
                    result: setting,
                    message: "Setting update successfully",
                    status_code: 422
                }).end();
            } else {
                let setting_sql = "INSERT INTO " + Sys.Config.Table.MOBILE_SETTING + " (withDraw,lottoResult,userId) VALUES(" + Sys.SqlPool.escape(inputs.withDraw) + "," + Sys.SqlPool.escape(inputs.lottoResult) + "," + Sys.SqlPool.escape(inputs.userId) + ")";
                let result = await getResult(setting_sql);
                setting.userId = inputs.userId;
                setting.withDraw = inputs.withDraw;
                setting.lottoResult = inputs.lottoResult;
                return res.send({
                    status: 'success',
                    result: setting,
                    message: "Setting update successfully",
                    status_code: 422
                }).end();

            }

        } catch (e) {
            //Sys.Log.eror("Error in updateProfile :", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },

    logout: async function(req, res) {
        try {
            let inputs = req.body;
            let User = "SELECT * FROM " + Sys.Config.Table.USER + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + "";
            let UserResult = await getResult(User);
            if (!UserResult) {
                return res.send({
                    status: 'fail',
                    message: "Data not found",
                    status_code: 422
                }).end();
            }
            let otpFlag = "UPDATE " + Sys.Config.Table.USER + " SET loginStatus='0', token='' WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + "";
            let otpFlagResult = await getResult(otpFlag);

            let iav_in_sql = "DELETE FROM " + Sys.Config.Table.IAV_IN_KIOSK + " WHERE IAV IN(SELECT GROUP_CONCAT(IAV_number)as  IAV_number FROM " + Sys.Config.Table.MOBILEUSERIAV + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " GROUP BY id ORDER BY created_at DESC )";

            let iav_in_result = await getResult(iav_in_sql);
            
            return res.send({
                status: 'success',
                message: "Logout successfully",
                status_code: 200,
                token: ""
            }).end();

            
        } catch (e) {
            Sys.Log.eror("Error in  :", e);
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    },
    updatePin: async function(req, res) {
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

            if (inputs.newPin != inputs.confirmPin) {
                return res.send({
                    status: "fail",
                    message: "confirmPin not match!",
                    status_code: 422
                }).end();
            } else {
                let sql = "SELECT userId,mobile,countryCode FROM " + Sys.Config.Table.USER + " WHERE pin="+Sys.SqlPool.escape(inputs.oldPin)+" AND userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY created_at DESC limit 1";
                let result = await getResult(sql);
                // console.log(sql);
                if (result.length) {
                    let PinSet = "UPDATE " + Sys.Config.Table.USER + " SET pin=" + Sys.SqlPool.escape(inputs.newPin) + ",updated_at=" + Sys.SqlPool.escape(date) + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + "";
                    let pinResult = await getResult(PinSet);
                    return res.send({
                        userId: inputs.userId,
                        status: "success",
                        message: "Pin updated successfully",
                        status_code: 200
                    }).end();
                } else {
                    return res.send({
                        status: "fail",
                        message: "Old pin not matched",
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
    privacypolicy: async function(req, res){
        res.render("privacy-policy.html");
    },
    uploadapk: async function(req, res) {
        res.render("uploadapk.html");
    },
    saveapk : async function(req, res){
        var hostname = req.headers.host; // hostname = 'localhost:8080'
        console.log("hostname",hostname);
        var inputs = req.body;
        let apk_version = inputs.version_number;
        let sql = "SELECT * FROM "+Sys.Config.Table.RET_CNG_APK+" WHERE apk_version="+Sys.SqlPool.escape(apk_version);
        let result = await getResult(sql);
        console.log("result",result);
        if(result.length){
            return res.send({status:"fail",message:"apk version already uploaded with this version"}).end();;
        }
        let apk_name = "kiosk_v"+apk_version+'.apk';
		 let description = inputs.description;

        let apklink='http://' + hostname + "/apk/cng/"+apk_name;
          console.log(apklink);
        let apkfile =   req.files.apkfile;
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(apkfile.name)[1];
        console.log("ext",ext);
        if(!(ext=="apk")){
            return res.send({status:"fail",message:"Please upload valid apk file"}).end();;   
        }
        apkfile.mv('./public/apk/cng/'+apk_name, async function(err) {
           if (err){
             console.log("err",err)
             return res.send({status:'fail',message:'Fail to upload apk file'}).end();;
           }
            let response ={
                message:'apk uploaded successfully',
                status:'success',
                url:apklink
            }
            let today =  dateFormat(new Date(), "yyyy-mm-dd");
            //console.log("today",today);
            sql = "INSERT INTO " + Sys.Config.Table.RET_CNG_APK + "(apk_version,apk_name,apk_type,description,created_at,version_name) VALUES(" + Sys.SqlPool.escape(apk_version) + "," + Sys.SqlPool.escape(apk_name) + ",'cng',"+ Sys.SqlPool.escape(description)+"," +Sys.SqlPool.escape(today) + "," + Sys.SqlPool.escape(inputs.version_name) + ")";
            await getResult(sql);
            return res.send(response).end();;
        });
    }
}

async function GetTimeZoneData(siteId)
    {   // General_Setting
        let sql = "SELECT * FROM "+Sys.Config.Table.GENERAL_SETTING+" WHERE status='true' AND siteId="+Sys.SqlPool.escape(siteId);
        console.log("GetTimeZoneData sql",sql);
        let sitetimezone= await getResult(sql);
        var timezone=sitetimezone[0].timezone
        console.log("timezone ", timezone) 
              var createDate = new Date();
              console.log("createDate ", createDate) 
              var sendtime = new Date(createDate.getTime() + (timezone*1000*60*60)); 
              console.log("sendtime ", sendtime) 
              if((createDate.getMonth()+1) > 0 && (createDate.getMonth()+1) < 9 ){
                var month ='0'+(createDate.getMonth()+1)
              } else {
                var month =(createDate.getMonth()+1)
              }   
              if((createDate.getDate()) > 0 && (createDate.getDate()) < 9 ){
                var newdate ='0'+(createDate.getDate())
              } else {
                var newdate =(createDate.getDate())
              }     
              if((createDate.getHours()) > 0 && (createDate.getHours()) < 9 ){
                var Hours ='0'+(createDate.getHours())
              } else {
                var Hours =(createDate.getHours())
              }   
              if((createDate.getMinutes()) > 0 && (createDate.getMinutes()) < 9 ){
                var Minutes ='0'+(createDate.getMinutes())
              } else {
                var Minutes =(createDate.getMinutes())
              }  
             
              var finaldate=createDate.getFullYear()+'-'+(month)+'-'+newdate+' '+Hours+':'+Minutes
                
              return finaldate
            
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