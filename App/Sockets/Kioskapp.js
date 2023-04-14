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


module.exports = {
    // jwtverify: function(data) {
    //     if (data.token) {
    //         let flag = false;
    //         jwt.verify(data.token, jwtcofig.secret, async function(err, decoded) {
    //             if (err) {
    //                 flag = true;
    //             }
    //         });
    //         if (flag) {
    //             return {
    //                 status: 'fail',
    //                 status_code: 404,
    //                 message: "JWT token not valid"
    //             };
    //         } else {
    //             return {
    //                 status: 'success',
    //                 status_code: 200,
    //                 message: "JWT valid"
    //             };
    //         }
    //     } else {
    //         return {
    //             status: 'fail',
    //             status_code: 404,
    //             message: "Please enter token"
    //         };
    //     }
    // },

    jwtverify: async function(data) {
        try {

            if (data.token)
            {
                let flag = false;
                await jwt.verify(data.token, jwtcofig.secret, async function(err, decoded) {
                    if (err) {
                        flag = true;
                    }
                });
                if (flag) {
                    return {
                        status: 'fail',
                        status_code: 404,
                        message: "JWT token not valid"
                    };
                } else {
                    let checkLoginStatus="SELECT * FROM "+Sys.Config.Table.USER+" WHERE userId='"+data.userId+"' limit 1";
					let LoginStatus = await getResult(checkLoginStatus);
                    //console.log("LoginStatus=",LoginStatus[0]);
					let checkMobileDevice="SELECT * FROM "+Sys.Config.Table.MOBILE_DEVICE_ID+" WHERE mobile_device_id='"+LoginStatus[0].mobile_device_id+"' limit 1";
                     checkMobileDevice = await getResult(checkMobileDevice);
                    if(checkMobileDevice.length)
                    {   
                        if(checkMobileDevice[0].status=='1'){
                            return{
                            status: 'fail',
                            message: "Your Device is Blocked",
                            status_code: 404
                            };
                        }
                        
                    }else{
                        let sqlMobileDevice="INSERT INTO "+Sys.Config.Table.MOBILE_DEVICE_ID+" (mobile_device_id,status,userId) VALUES('"+LoginStatus[0].mobile_device_id+"','0','"+data.userId+"')";
                        await getResult(sqlMobileDevice);
                    }
                   
                    if(LoginStatus.length)
                    {
                        if(data.token!=LoginStatus[0].token){
                            return {status : 'fail' , status_code:404, message : "JWT token not valid"};
                        }
                        else if(LoginStatus[0].mobile_number_blocked=='1'){
                             return {status : 'fail' , status_code:404, message : "Your Mobile Number is Blocked"};
                        }
                        

                    }
                    return {
                        status: 'success',
                        status_code: 200,
                        message: "JWT valid"
                    };
                }
            } else {
                return {
                    status: 'fail',
                    status_code: 404,
                    message: "Please enter token"
                };
            }
             


        } catch (e) {
            Sys.Log.error("Error in SocketValidator :", e);
            return {
                status: 'fail',
                message: e,
                status_code: 422
            }
        }
    },

    loadIAV: async function(Socket, data) {
        try {
            let inputs = data;
            let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
            
            console.log("SocketValidator=",jwtverify);
            if (jwtverify.status_code == 404) {
                return jwtverify;
            }
             //let iav_check = "SELECT ir.userId,ir.siteId,test.siteName,test.iavId,ir.IAV_number,test.id,DATE_FORMAT(test.Purchased_date,'%Y-%m-%d %H:%i:%s') AS Purchased_date,DATE_FORMAT(test.created_at,'%Y-%m-%d %H:%i:%s') AS created_at,ir.last_running_iav AS balance FROM (SELECT MAX(ir.id) as id,ir.IAV_number,uil.siteName,uil.iavId,uil.Purchased_date,uil.created_at,uil.id as ids,TIMESTAMPDIFF(HOUR, ir.timestamp,now()) as diff FROM " + Sys.Config.Table.MOBILEUSERIAV + " uil JOIN " + Sys.Config.Table.IAV_RUNNING + " ir ON uil.IAV_number=ir.IAV_number WHERE uil.userId=" + Sys.SqlPool.escape(inputs.userId) + " GROUP BY ir.IAV_number) test JOIN iav_running ir ON test.id=ir.id WHERE   (TIMESTAMPDIFF(HOUR, ir.timestamp,now())<48 or ir.last_running_iav>0)";
              let iav_check = "SELECT ir.userId,ir.siteId,test.siteName,test.iavId,ir.IAV_number,test.id,DATE_FORMAT(test.Purchased_date,'%Y-%m-%d %H:%i:%s') AS Purchased_date,DATE_FORMAT(test.created_at,'%Y-%m-%d %H:%i:%s') AS created_at,ir.last_running_iav AS balance FROM (SELECT MAX(ir.id) as id,ir.IAV_number,uil.siteName,uil.iavId,uil.Purchased_date,uil.created_at,uil.id as ids,TIMESTAMPDIFF(HOUR, ir.timestamp,now()) as diff FROM " + Sys.Config.Table.MOBILEUSERIAV + " uil JOIN " + Sys.Config.Table.IAV_RUNNING + " ir ON uil.IAV_number=ir.IAV_number WHERE uil.userId=" + Sys.SqlPool.escape(inputs.userId) + " GROUP BY ir.IAV_number) test JOIN iav_running ir ON test.id=ir.id WHERE ir.last_running_iav>0 order by test.created_at DESC";
            
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
             
            if (!result_iav_check.length) {
                return {
                    status: 'success',
                    message: "IAV not available",
                    status_code: 422
                };
            }
            //console.log('====3',result_iav_check)

            return {
                status: 'success',
                result: result_iav_check,
                message: "User IAV list",
                status_code: 200
            };


        } catch (e) {
            Sys.Log.eror("Error in loadIav :", e);
            return {
                status: 'fail',
                message: e,
                status_code: 422
            }
        }
    },

    withDrawHistory: async function(Socket, data) {
        try {
            let inputs = data;
            let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
            if (jwtverify.status_code == 404) {
                return jwtverify;
            }
            let withDrawHistory = "SELECT DATE_FORMAT(refundDate,'%Y-%m-%d %H:%i:%s') AS refundDate,DATE_FORMAT(timestamp,'%Y-%m-%d %H:%i:%s') AS timestamp,IAV_number,last_running_iav AS balance,siteId FROM " + Sys.Config.Table.IAV_RUNNING + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " AND refundDate is not null AND admin_refund='0' order by id desc";
            //console.log('====?',iav_check)
            let result_withDrawHistory = await getResult(withDrawHistory);
            // console.log('====1',result_iav_check)
            if (!result_withDrawHistory.length) {
                return {
                    status: 'success',
					result:[],
                    message: "withDrawHistory list not available",
                    status_code: 422
                };
            }
            //console.log('====3',result_iav_check)

            return {
                status: 'success',
                result: result_withDrawHistory,
                message: "WithDrawHistory",
                status_code: 200
            };


        } catch (e) {
            Sys.Log.eror("Error in withDrawHistory :", e);
            return {
                status: 'fail',
                message: e,
                status_code: 422
            }
        }
    },
    countryWiseLottoList: async function(Socket, data) {
        try {
            
            //Sys.App.Middlewares.SocketValidator.countryWiseLottoList(data) ;
            let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
            if (jwtverify.status_code == 404) {
                return jwtverify;
            }
            //console.log('=======c',data)
            let sql = "select * from " + Sys.Config.Table.SITEPROFILE + " WHERE Enable=0";

            let stmt = await getResult2(sql);
            let finalarr = [];
            let enable = [];

            for (let i = 0; i < stmt.length; i++) {
                finalarr.push(stmt[i].ProfileID);
                enable.push(stmt[i].Enable);
            }

            let siteprofileSql = "select *, GROUP_CONCAT(Continent) AS Continent,GROUP_CONCAT(DrawType) AS DrawType,GROUP_CONCAT(DrawingType) AS DrawingType from " + Sys.Config.Table.SITEPROFILEMANAGEMENT + "";
            // console.log('=======1',siteprofileSql)
            let result_siteprofileSql = await getResult2(siteprofileSql);

            let ContinentListData = result_siteprofileSql[0].Continent;
            let DrawType = result_siteprofileSql[0].DrawType;
            let DrawingType = result_siteprofileSql[0].DrawingType;
            let enableData = enable.toString(",");
            let profileID = finalarr.toString(",");



            if (ContinentListData != '' && DrawingType != '' && DrawType != '') {

                /*let sqlLottolist = "select CountryId from " + Sys.Config.Table.LOTTOLIST + " where ID Not IN ('" + profileID + "') AND Enable=1 AND DrawType='" + DrawType + "' AND DrawingType IN ('" + DrawingType.replace(/,/g, "','") + "') AND Continent IN ('" + ContinentListData.replace(/,/g, "','") + "') AND Enable=1  GROUP BY CountryId";*/
                /*let sqlLottolist = "select CountryId from " + Sys.Config.Table.LOTTOLIST + " where ID Not IN ('" + profileID + "') AND Enable=1  GROUP BY CountryId";*/

                let sqlLottolist = "select CountryId from " + Sys.Config.Table.LOTTOLIST + " where Enable=1  GROUP BY CountryId";
                 
                let result_sqlLottolist = await getResult2(sqlLottolist);

                let finalarr = [];
                let final_arrListdata = [];
                for (let i = 0; i < result_sqlLottolist.length; i++) {
                    final_arrListdata.push(result_sqlLottolist[i].CountryId);
                }
                let countryList = final_arrListdata.toString(',');
                let countryid = data.countryflag;

                // let sqlcountryist = "select * from " + Sys.Config.Table.CUNTRYLIST + " WHERE Id IN (" + countryList + ") AND FlagAbv='" + countryid + "'";
                // //console.log("=======",sqlcountryist);
                // let result_arr_country = await getResult2(sqlcountryist);
                let final_arrList = [];


                //if (result_arr_country.length) {
                    let country = data.id ;

                    /*let Lottolist = "select ID,ProfileName,Country,CountryId,State,DrawTime,CutTime,RegUsed,BonusUsed,LastCreateDate,UpdateTime,TimeZone,StartNum,colorimage,grayscaleimage,Continent from " + Sys.Config.Table.LOTTOLIST + " where ID NOT IN (" + profileID + ") AND Enable=1 AND DrawType IN ('" + DrawType.replace(/,/g, "','") + "') AND DrawingType IN ('" + DrawingType.replace(/,/g, "','") + "') AND Continent IN ('" + ContinentListData.replace(/,/g, "','") + "') AND  CountryId = '" + country + "'";*/

                    let Lottolist = "select ID,ProfileName,Country,CountryId,State,DrawTime,CutTime,RegUsed,BonusUsed,LastCreateDate,UpdateTime,TimeZone,StartNum,colorimage,grayscaleimage,Continent from " + Sys.Config.Table.LOTTOLIST + " where Enable=1 AND  CountryId = '" + country + "'";
                    
                    
                    let result_lottolist = await getResult2(Lottolist);
                    
                    let sql = "SELECT GROUP_CONCAT(lottoId) AS lottoId FROM " + Sys.Config.Table.MOBILE_USER_FAVOURITE_LOTTO_LIST + " WHERE userId='" + data.userId + "'  AND countryFlag='" + data.countryflag + "'";
                        
                    let result1 = await getResult(sql);
                    let liek_lotto_array =[];
                   // console.log('====================w',Lottolist);
                    if(result1[0].lottoId){
                         liek_lotto_array = result1[0].lottoId.split(',');
                    }
                    
                    if(result_lottolist.length)
                    {
                        for (let i = 0; i < result_lottolist.length; i++) 
                        {
                       
                            result_lottolist[i]['fav_flag'] = false;
                           
                            if (liek_lotto_array.indexOf(result_lottolist[i].ID.toString()) >= 0) {
                                
                                result_lottolist[i]['fav_flag'] = true;
                            }
                        }

                        

                        result_lottolist.sort(function(a,b){
                          var o1 = a.State.toLowerCase();
                          var o2 = b.State.toLowerCase();
                          if (o1 < o2) return -1;
                          if (o1 > o2) return 1;
                            
                          var p1 = a.ProfileName.toLowerCase();
                          var p2 = b.ProfileName.toLowerCase();
                          if (p1 < p2) return -1;
                          if (p1 > p2) return 1;

                          return 0;
                        });
        
                        return {
                            status: 'success',
                            result: result_lottolist,
                            message: "countryWiseLottoList",
                            status_code: 200
                        };
                   
                    } else {
                        return {
                            status: 'fail',
                            message: "LottoList not available ",
                            status_code: 422
                        };
                    }


            } else {
                return {
                    status: 'fail',
                    message: "LottoList not available ",
                    status_code: 422
                };
            }


        } catch (e) {
            console.log("Error in countryWiseLottoList :", e);
            return {
                status: 'fail',
                message: e,
                status_code: 422
            };
        }
    },

    FavouriteLotto: async function(Socket, data) {

        let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
        if (jwtverify.status_code == 404) {
            return jwtverify;
        }

        let fav_lotto = "SELECT * FROM " + Sys.Config.Table.MOBILE_USER_FAVOURITE_LOTTO_LIST + " WHERE userId='" + data.userId + "'";

        let result_fav_lotto = await getResult(fav_lotto);
        //console.log('===',fav_lotto)
        let fav_lotto_list = [];
        for (let i = 0; i < result_fav_lotto.length; i++) {
            let sql_lotto = "SELECT *,DATE_FORMAT(CutTime,'%Y-%m-%d %H:%i:%s') AS CutTime,DATE_FORMAT(UpdateTime,'%Y-%m-%d %H:%i:%s') AS UpdateTime,DATE_FORMAT(DrawTime,'%Y-%m-%d %H:%i:%s') AS DrawTime,DATE_FORMAT(DaylightSavingBegin,'%Y-%m-%d %H:%i:%s') AS DaylightSavingBegin FROM " + Sys.Config.Table.LOTTOLIST + " WHERE id='" + result_fav_lotto[i].lottoId + "'";

            let result_lotto = await getResult2(sql_lotto);
            if (result_lotto.length) {
                result_lotto[0]['countryFlag'] = result_fav_lotto[i].countryFlag;
            } else {
                return {
                    status: 'success',
                    status_code: 200,
                    result: fav_lotto_list,
                    message: "FavouriteLotto not  available"
                }
            }
            fav_lotto_list.push(result_lotto[0]);


        }
        //Following code for sorting lotto name ascending order
        fav_lotto_list.sort(function(a,b){
            
          var o1 = a.State.toLowerCase();
          var o2 = b.State.toLowerCase();
          
          if (o1 < o2) return -1;
          if (o1 > o2) return 1;
            
            
          var p1 = a.ProfileName.toLowerCase();
          var p2 = b.ProfileName.toLowerCase();
          if (p1 < p2) return -1;
          if (p1 > p2) return 1;

          return 0;
        });

        return {
            status: 'success',
            status_code: 200,
            result: fav_lotto_list,
            message: "FavouriteLotto List"
        }

    },

    mobileLottoMarket: async function(socket, data) {
        try {
            
            let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
            if (jwtverify.status_code == 404) {
                return jwtverify;
            }
            let inputs = data;
            
            let fields = "userId";
            let userSql = "SELECT " + fields + " FROM " + Sys.Config.Table.USER + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " limit 1";
            //console.log("userSql",userSql);
            let userResult = await getResult(userSql);
            if (!userResult.length > 0) {
                return {
                    status: "fail",
                    message: "User not found"
                };
            }
            let userData = userResult[0];
            //saveActivityLog(userData.id,userData.username+" in cashup screen",inputs); //User history log

            //Get lotto profile data
            let profileSql = "SELECT TimeZone,ProfileName,Country from " + Sys.Config.Table.LOTTOLIST + " where ID=" + Sys.SqlPool.escape(inputs.profileId);
            let profileResult = await getResult2(profileSql);
            if (!profileResult.length > 0) {
                return {
                    status: "fail",
                    message: "Profile not found"
                };
            }
            let lottoListData = profileResult[0];
            let profileTimezone = lottoListData['TimeZone'];
            let timediff = (+2) - (profileTimezone);
            
            let timequery = '';
            timediff = Math.abs(timediff);
            timequery = 'DATE_ADD(t_e.CutTime, INTERVAL ' + timediff + ' HOUR)';

            //Get site data
            let siteSql = "SELECT * FROM " + Sys.Config.Table.SITEPROFILEMANAGEMENT + " WHERE SiteID=" + inputs.siteId;
            let siteResult = await getResult2(siteSql);
            //console.log("siteResult",siteResult);
            if (!siteResult.length > 0) {
                return {
                    status: "fail",
                    message: "Site not found"
                };
            }
            let continentListData = siteResult[0]['Continent'];
            let drawType = siteResult[0]['DrawType'];
            let drawingType = siteResult[0]['DrawingType'];

            if (continentListData != '' && drawingType != '' && drawType != '') {
                let today = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss",true)
                today = new Date(today);
                today.setHours(today.getHours() + 2);
                today = dateFormat(today, "yyyy-mm-dd HH:MM:ss"); 
                
                

               

                //let today = '2019-04-03 11:07:10';
                //DATE_FORMAT(t_e.DrawTime,"%Y-%m-%d %H:%i:%s") AS t_e.DrawTime
                let eventFields = 't_e.ID,t_e.ProfileID,t_e.Description,DATE_FORMAT(t_e.DrawTime,"%Y-%m-%d %H:%i:%s") AS DrawTime,DATE_FORMAT(t_e.CutTime,"%Y-%m-%d %H:%i:%s") AS CutTime,t_e.UpdateTime,t_e.IsClosed,t_e.Result';
                let condition = ' AND t_e.ProfileID=' + Sys.SqlPool.escape(inputs.profileId);
                //drawType replace with comma separeted single quote
                drawType = '\'' + drawType.split(',').join('\',\'') + '\'';
                drawingType = '\'' + drawingType.split(',').join('\',\'') + '\'';
                continentListData = '\'' + continentListData.split(',').join('\',\'') + '\'';

                condition += " AND t_l.DrawType IN (" + drawType + ") AND t_l.DrawingType IN (" + drawingType + ") AND t_l.Continent IN (" + continentListData + ")";
                condition += " AND (('" + today + "' BETWEEN t_e.DrawTime AND " + timequery + ") OR " +
                    " ('" + today + "' BETWEEN " + timequery + " AND t_e.DrawTime))";
                /*let eventSql = 'SELECT ' + eventFields + ',t_e.CutTime As dbCutTime,t_l.DrawDays,t_l.BonusFromReg,t_l.BonusDrawn, t_l.Price1 as Prices,t_l.RegUsed,t_l.BonusUsed, t_l.StartNum,t_l.RegColours from ' + Sys.Config.Table.LOTTOEVENT + ' t_e left join ' + Sys.Config.Table.LOTTOLIST + ' t_l on t_e.ProfileID=t_l.ID WHERE ProfileID not in (select ProfileID from ' + Sys.Config.Table.SITEPROFILE + ' where SiteID=' + inputs.siteId + ') ' +
                    condition + ' UNION ' +
                    'SELECT ' + eventFields + ',t_e.CutTime As dbCutTime,t_l.RegUsed,t_l.BonusUsed, t_l.StartNum, t_l.DrawDays,t_l.BonusFromReg,t_l.BonusDrawn, case when PriceIndex=1 then t_l.Price1 when PriceIndex=2 then t_l.Price2 when PriceIndex=3 then t_l.Price3 when PriceIndex=4 then t_l.Price4 when PriceIndex=5 then t_l.Price5 else \'None\' end as Prices,t_l.RegColours from ' + Sys.Config.Table.LOTTOEVENT + ' t_e left join ' + Sys.Config.Table.LOTTOLIST + ' t_l on t_e.ProfileID=t_l.ID left join ' + Sys.Config.Table.SITEPROFILE + ' t_s on t_e.ProfileID=t_s.ProfileID where SiteID=' + inputs.siteId + ' AND t_s.Enable=1 ' +
                    condition;

                let eventResult = await getResult2(eventSql);*/
                let eventResult = [];
                //Get timezone of sitemanagement table 
                let siteMgtSql = "SELECT TimeZone from " + Sys.Config.Table.SITEMANAGEMENT + " where ID=" + inputs.siteId;
                let siteMgtResult = await getResult2(siteMgtSql);
                let siteTimeZone = siteMgtResult[0]['TimeZone'];

                let priceData;
                
                if (eventResult.length > 0) {
                    priceData = eventResult[0];
                } else {
                    let condition = " AND t_e.ProfileID=" + Sys.SqlPool.escape(inputs.profileId);
                    //condition += " AND t_e.DrawTime >= '" + today + "'";
                    condition += " AND DATE_ADD(t_e.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR) >= '" + today + "'";
                    condition += " AND t_l.DrawType IN (" + drawType + ") AND t_l.DrawingType IN (" + drawingType + ") AND t_l.Continent IN (" + continentListData + ")";
                    orderby = " ORDER BY t_e.DrawTime";
                    Limit = " Limit 1";
                    eventSql = 'SELECT ' + eventFields + ',t_l.RegUsed, t_l.BonusUsed,t_l.StartNum,t_l.DrawDays,t_l.BonusFromReg,t_l.BonusDrawn, t_l.Price1 as Prices,t_l.RegColours from ' + Sys.Config.Table.LOTTOEVENT + ' t_e left join ' + Sys.Config.Table.LOTTOLIST + ' t_l on t_e.ProfileID=t_l.ID where ProfileID not in (select ProfileID from ' + Sys.Config.Table.SITEPROFILE + ' where SiteID=' + inputs.siteId + ') ' +
                        condition + ' UNION ' +
                        'SELECT ' + eventFields + ',t_l.RegUsed,t_l.BonusUsed, t_l.StartNum,t_l.DrawDays,t_l.BonusFromReg,t_l.BonusDrawn,case when PriceIndex=1 then t_l.Price1 when PriceIndex=2 then t_l.Price2 when PriceIndex=3 then t_l.Price3 when PriceIndex=4 then t_l.Price4 when PriceIndex=5 then t_l.Price5 else \'None\' end as Prices,t_l.RegColours from ' + Sys.Config.Table.LOTTOEVENT + ' t_e left join ' + Sys.Config.Table.LOTTOLIST + ' t_l on t_e.ProfileID=t_l.ID left join siteprofile t_s on t_e.ProfileID=t_s.ProfileID WHERE SiteID=' + inputs.siteId + ' and t_s.Enable=1 and t_e.IsClosed!=1 and t_e.Result=""' +
                        condition;
                        //condition + Limit;
                    eventSql = 'SELECT * FROM ('+eventSql+') as temp ORDER BY temp.DrawTime LIMIT 1';   
                    eventResult = await getResult2(eventSql);
                    
                    //console.log("eventResult",eventResult);
                }

                let marketSql = "SELECT * FROM marketlist";
                let marketlist = await getResult2(marketSql);
                //Start: Get market data logic
                if (eventResult.length) {

                    priceData = eventResult[0];
                    //Timezone logic
                    timediff = (priceData.DrawTime).split(" ");
                    var gettime = (timediff[1]).split(":");

                    
                    timediff = (-parseFloat(profileTimezone) + parseFloat(siteTimeZone));
                    //timediff =  siteTimeZone;
                    

                    /*var time = require('time');
                    var now = new time.Date(priceData.DrawTime);
                    now.setTimezone('UTC');*/
                    var now = dateFormat(new Date(priceData.DrawTime), "yyyy-mm-dd HH:MM:ss");
                    now  = new Date(now);

                    var DrawTime = new Date(now.getTime() + (timediff * 1000 * 60 * 60));

                    if ((DrawTime.getMonth() + 1) >= 1 && (DrawTime.getMonth() + 1) <= 9) {
                        var month = '0' + (DrawTime.getMonth() + 1)
                    } else {
                        var month = (DrawTime.getMonth() + 1)
                    }
                    if ((DrawTime.getDate()) >= 0 && (DrawTime.getDate()) <= 9) {
                        var newdate = '0' + (DrawTime.getDate())
                    } else {
                        var newdate = (DrawTime.getDate())
                    }
                    if ((DrawTime.getHours()) >= 0 && (DrawTime.getHours()) <= 9) {
                        var Hours = '0' + (DrawTime.getHours())
                    } else {
                        var Hours = (DrawTime.getHours())
                    }
                    if ((DrawTime.getMinutes()) >= 0 && (DrawTime.getMinutes()) <= 9) {
                        var Minutes = '0' + (DrawTime.getMinutes())
                    } else {
                        var Minutes = (DrawTime.getMinutes())
                    }

                    var DrawTime = DrawTime.getFullYear() + '-' + (month) + '-' + newdate + ' ' + Hours + ':' + Minutes
                    
                    let prices = priceData.Prices.split(",");
                    let regulararr = [];
                    let bonusarr = [];
                    let bonuspickarr = [];

                    let regArr = [];
                    let bonsArr = [];
                    let bonsPickerArr = [];
                    for (let index1 = 0; index1 < prices.length; ++index1) {

                        var pricevalue = (prices[index1]).split(":");
                        var marketid = pricevalue[0];
                        var marketprice = pricevalue[1];
                        if (marketid >= 1 && marketid <= 20) {
                            for (var index = 0; index < marketlist.length; ++index) {
                                if (marketlist[index].MarketID == marketid) {
                                    var marketdesc = marketlist[index].MarketDescription;
                                    regulararr[marketdesc] = prices[index1];
                                    regArr.push({
                                        "market": marketdesc,
                                        "marketId": marketid,
                                        "price": marketprice,
                                    })

                                }
                            }


                        }
                        if (marketid >= 21 && marketid <= 40) {
                            for (var index = 0; index < marketlist.length; ++index) {
                                if (marketlist[index].MarketID == marketid) {
                                    var marketdesc = marketlist[index].MarketDescription;
                                    bonusarr[marketdesc] = prices[index1]
                                    bonsArr.push({
                                        "market": marketdesc,
                                        "marketId": marketid,
                                        "price": marketprice,
                                    })

                                }
                            }
                        }
                        //market from 51 to 55
                        if ((marketid >= 51 && marketid <= 55)) {
                            for (var index = 0; index < marketlist.length; ++index) {
                                if (marketlist[index].MarketID == marketid) {
                                    var marketdesc = marketlist[index].MarketDescription;

                                    bonuspickarr[marketdesc] = prices[index1]
                                    bonsPickerArr.push({
                                        "market": marketdesc,
                                        "marketId": marketid,
                                        "price": marketprice,
                                    })
                                }
                            }
                        }
                        if ((marketid >= 81 && marketid < 82)) {
                            for (var index = 0; index < marketlist.length; ++index) {
                                if (marketlist[index].MarketID == marketid) {
                                    var marketdesc = marketlist[index].MarketDescription;

                                    bonuspickarr[marketdesc] = prices[index1]
                                    bonsPickerArr.push({
                                        "market": marketdesc,
                                        "marketId": marketid,
                                        "price": marketprice,
                                    })
                                }
                            }
                        }
                    }

                    //Start: Regular Ball color logic
                        let regBallImages = [];
                        
                        let letters = [];
                        if(priceData.RegColours){
                            letters = priceData.RegColours.split("");
                        }
                        let strtNum = eventResult[0].StartNum;                        
                        let endNum = eventResult[0].RegUsed;
                        for(let z=strtNum;z<=endNum;z++){
                            let ballImage = 'multi_color_ball.png';
                            if(letters[z] && letters[z] == 'A'){
                                ballImage = "white_ball.png";
                            }
                            if(letters[z] && letters[z] == 'B'){
                                ballImage = "blue_ball.png";
                            }
                            if(letters[z] && letters[z] == 'C'){
                                ballImage = "green_ball.png";
                            }
                            if(letters[z] && letters[z] == 'D'){
                                ballImage = "orange_ball.png";
                            }
                            if(letters[z] && letters[z] == 'E'){
                                ballImage = "pink_ball.png";
                            }
                            if(letters[z] && letters[z] == 'F'){
                                ballImage = "purple_ball.png";
                            }
                            if(letters[z] && letters[z] == 'H'){
                                ballImage = "red_ball.png";
                            }
                            if(letters[z] && letters[z] == 'G'){
                                ballImage = "yellow_ball.png";
                            }                   
                            if(letters[z] && letters[z] == 'Z'){
                                ballImage = "multi_color_ball.png";
                            }
                            if(letters[z] && (letters[z] == '*' || letters[z] == '')){
                                ballImage = "multi_color_ball.png";
                            }
                            regBallImages.push(ballImage);
                        }                        
                        //End :Rgular  Ball color logic

                    //Start: Bonus Ball color logic
                    let bonusBallImages = [];
                    
                    letters = [];
                    if(priceData.BonusColours){
                        letters = priceData.BonusColours.split("");
                    }
                    strtNum = eventResult[0].StartNum;
                    endNum = eventResult[0].BonusUsed;
                    for(let z=strtNum;z<=endNum;z++){
                        let ballImage = 'multi_color_ball.png';
                        if(letters[z] && letters[z] == 'A'){
                            ballImage = "white_ball.png";
                        }
                        if(letters[z] && letters[z] == 'B'){
                            ballImage = "blue_ball.png";
                        }
                        if(letters[z] && letters[z] == 'C'){
                            ballImage = "green_ball.png";
                        }
                        if(letters[z] && letters[z] == 'D'){
                            ballImage = "orange_ball.png";
                        }
                        if(letters[z] && letters[z] == 'E'){
                            ballImage = "pink_ball.png";
                        }
                        if(letters[z] && letters[z] == 'F'){
                            ballImage = "purple_ball.png";
                        }
                        if(letters[z] && letters[z] == 'H'){
                            ballImage = "red_ball.png";
                        }
                        if(letters[z] && letters[z] == 'G'){
                            ballImage = "yellow_ball.png";
                        }                   
                        if(letters[z] && letters[z] == 'Z'){
                            ballImage = "multi_color_ball.png";
                        }
                        if(letters[z] && (letters[z] == '*' || letters[z] == '')){
                            ballImage = "multi_color_ball.png";
                        }
                        bonusBallImages.push(ballImage);
                    }                        
                    //End :Bonus  Ball color logic


                    //Start: create regular and bonus array
                    let regnewArr = [];
                    for (let i = 0; i < regArr.length; i++) {
                        let regBonusMarketId = '';
                        
                        if (bonsArr[i]) {
                            regBonusMarketId = bonsArr[i].marketId;
                        }
                        var reglastChar = "";
                        var bonuslastChar = "";
                        if (regArr[i].marketId) {
                            var reglastChar = regArr[i].marketId.substr(regArr[i].marketId.length - 1);
                        }
                        if (regBonusMarketId) {
                            bonuslastChar = bonsArr[i].marketId.substr(bonsArr[i].marketId.length - 1);
                        }
                        

                        //var reglastChar = regArr[i].marketId.substr(regArr[i].marketId.length - 1); 
                        //var bonuslastChar = bonsArr[i].marketId.substr(bonsArr[i].marketId.length - 1); 
                        regnewArr.push({
                            "market": regArr[i].market,
                            "StartNum": eventResult[0].StartNum,
                            "RegUsed": eventResult[0].RegUsed,
                            "regularMarketId": regArr[i].marketId,
                            "regularMarketPrice": regArr[i].price,
                            "bonusMarketId": (regBonusMarketId == "") ? "" : bonsArr[i].marketId,
                            "bonusMarketprice": (regBonusMarketId == "") ? "" : bonsArr[i].price,
                            "regularballselect": reglastChar,
                            "bonusballselect": bonuslastChar,
                        })
                    }

                    let bonusnewArr = [];
                    let marketregularball = 1;
                    let marketbonusball = 1;
                    for (let i = 0; i < bonsPickerArr.length; i++) {

                        if (bonsPickerArr[i].marketId == 51) {
                            marketregularball = 1;
                            marketbonusball = 1;

                        } else if (bonsPickerArr[i].marketId == 52) {
                            marketregularball = 2;
                            marketbonusball = 1;

                        } else if (bonsPickerArr[i].marketId == 53) {
                            marketregularball = 3;
                            marketbonusball = 1;

                        } else if (bonsPickerArr[i].marketId == 54) {
                            marketregularball = 4;
                            marketbonusball = 1;

                        } else if (bonsPickerArr[i].marketId == 55) {
                            marketregularball = 5;
                            marketbonusball = 1;

                        }else if (bonsPickerArr[i].marketId == 81) {
                            marketregularball = 0;
                            marketbonusball = 1;

                        }
                        let RegUsed = eventResult[0].RegUsed;
                        let BonusUsed = eventResult[0].RegUsed;
                        if (bonsPickerArr[i].marketId == 81 && eventResult[0].BonusUsed != 0 && eventResult[0].BonusUsed != '0') {
                            RegUsed = eventResult[0].BonusUsed;
                            BonusUsed = eventResult[0].BonusUsed;
                            
                        }else if (bonsPickerArr[i].marketId != 81 && eventResult[0].BonusUsed != 0 && eventResult[0].BonusUsed != '0') {
                            RegUsed = eventResult[0].RegUsed;
                            BonusUsed = eventResult[0].BonusUsed;
                            
                        }

                        bonusnewArr.push({
                            "market": bonsPickerArr[i].market,
                            "marketId": bonsPickerArr[i].marketId,
                            "price": bonsPickerArr[i].price,
                            "sameBallSet":priceData.BonusFromReg,
                            "regularballselect": marketregularball,
                            "bonusballselect": marketbonusball,
                            "StartNum": eventResult[0].StartNum,
                            "RegUsed": RegUsed,
                            "BonusUsed": BonusUsed,
                        })
                    }

                    //Start: Get general settings
                    //Get site data
                    let kioskSettingSql = "SELECT * FROM " + Sys.Config.Table.KIOSK_SETTING + " WHERE siteId=" + inputs.siteId;
                    let kioskSettingResult = await getResult(kioskSettingSql);
                    let minStake = 0;
                    let maxStake = 0;
                    let maxWin = 0;
                    if (kioskSettingResult.length > 0) {
                        minStake = kioskSettingResult[0].Min_Stack;
                        maxStake = kioskSettingResult[0].Max_Stack;
                        maxWin = kioskSettingResult[0].Max_Win;
                    }
                    //End: Get general settings
                    
                    //End: create regular and bonus array
                    let CutTime = new Date(dateFormat(priceData.CutTime, "yyyy-mm-dd HH:MM:ss"));
                    /*let mobileTimeZone = inputs.mobileTimeZone;//"+05:30";
                    let convertTime = timeConvert(mobileTimeZone);
                    if(mobileTimeZone.charAt(0)=="-"){
                        CutTime.setMinutes(CutTime.getMinutes() + convertTime);
                    }else{
                        CutTime.setMinutes(CutTime.getMinutes() - convertTime);
                    }*/
                    CutTime = new Date(CutTime.getTime() + (timediff * 1000 * 60 * 60));    //Converted hour to microsecond
                    CutTime = dateFormat(CutTime, "yyyy-mm-dd HH:MM:ss");
                    
                    let siteTime =  new Date(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss",true));
                    siteTime = new Date(siteTime.getTime() + (parseFloat(siteTimeZone) * 1000 * 60 * 60));

                    siteTimeDate = dateFormat(siteTime, "yyyy-mm-dd HH:MM:ss");

                    /*var now = new time.Date(priceData.CutTime);
                    now.setTimezone('UTC');
                    //var CutTime = new Date(now.getTime() + (timediff * 1000 * 60 * 60));
                    var CutTime = new Date(now.getTime() + (timediff));
                    //var CutTime = new Date(now.getTime());
                    CutTime = dateFormat(CutTime, "yyyy-mm-dd HH:MM:ss");*/

                    let finalResponse = {
                        // "RegUsed":eventResult[0].RegUsed,
                        "minStake" : minStake,
                        "maxStake" : maxStake,
                        "maxWin" : maxWin,
                        "regBallImages" : regBallImages,
                        "bonusBallImages" : (priceData.BonusFromReg)?regBallImages:bonusBallImages,
                        "eventId": eventResult[0].ID,
                        "day": priceData.Description,
                        "country": lottoListData.Country,
                        "profileName": lottoListData.ProfileName,
                        "drawTime": DrawTime,
                        "CutTime":  CutTime,
                        "siteTime":  siteTime.getTime(),
                        "siteDateTime":  siteTimeDate,
                        "regular": regnewArr,
                        "bonusPickArr": bonusnewArr
                    };
						console.log("finalResponse===",finalResponse)

                    return {
                        status: "success",
                        result: finalResponse,
                        message: "Market found successfully"
                    };
                } else {
                    return {
                        status: "fail",
                        status_code: 422,
                        message: "Coming Soon"
                    };
                } //End : Get market data logic
            } else {
                return {
                    status: "fail",
                    status_code: 422,
                    message: "Data not found"
                };
            }
        } catch (e) {
            Sys.Log.error("Error in getLottoMarket", e);
            return {
                status: "fail",
                status_code: 422,
                message: "Something went wrong"
            };
        }
    },

    mobileNextLotto: async function(socket, data) {
        try {
            let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
            if (jwtverify.status_code == 404) {
                return jwtverify;
            }
            let inputs = data;
            var d = new Date();
            var dt = d.getDate()+2;
            /*var next = d.getFullYear() + "-" +
                ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                ("00" + dt).slice(-2) + " " +
                ("00" + d.getHours()).slice(-2) + ":" +
                ("00" + d.getMinutes()).slice(-2) + ":" +
                ("00" + d.getSeconds()).slice(-2);

            var current = d.getFullYear() + "-" +
                ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                ("00" + d.getDate()).slice(-2) + " " +
                ("00" + d.getHours()).slice(-2) + ":" +
                ("00" + d.getMinutes()).slice(-2) + ":" +
                ("00" + d.getSeconds()).slice(-2);*/
                var current = new Date(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss",true));
                current = current.setHours(current.getHours() + 2);
                current = dateFormat(current, "yyyy-mm-dd HH:MM:ss");

                var t = new Date();
                t.setDate(t.getDate() + 2);
                var next = new Date(dateFormat(new Date(t), "yyyy-mm-dd HH:MM:ss",true));
                next.setHours(next.getHours() + 2);
                next = dateFormat(next, "yyyy-mm-dd HH:MM:ss");
            let sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.RegUsed,ll.StartNum,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + Sys.Config.Table.LOTTOLIST + " ll LEFT JOIN " + Sys.Config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " + Sys.Config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)<='" + next + "' AND ll.Enable=1  AND le.IsClosed!=1 GROUP BY le.ProfileID ORDER by DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR) limit 10";

            let result = await getResult2(sql);
            if (result.length) {
                //var time = require('time');
                for(let i=0;i<result.length;i++){
                    let profileTimezone = result[i]['TimeZone'];
                    let timediff = (+2) - (profileTimezone);
                                
                    /*var now = new time.Date(result[i]['CutTime']);
                    now.setTimezone('UTC');*/
                    var now = dateFormat(new Date(result[i]['CutTime']), "yyyy-mm-dd HH:MM:ss");
                    now  = new Date(now);
                    

                    var CutTime = new Date(now.getTime() + (timediff * 1000 * 60 * 60));
                    CutTime = dateFormat(CutTime, "yyyy-mm-dd HH:MM:ss");
                    result['CutTime'] = CutTime;
                }
                /*result.sort(function(a,b){
                  var o1 = a.State.toLowerCase();
                  var o2 = b.State.toLowerCase();
                  if (o1 < o2) return -1;
                  if (o1 > o2) return 1;
                    
                  var p1 = a.ProfileName.toLowerCase();
                  var p2 = b.ProfileName.toLowerCase();
                  if (p1 < p2) return -1;
                  if (p1 > p2) return 1;

                  return 0;
                });*/
        
                return {
                    status: "success",
                    result: result,
                    message: "Lotto found successfully",
                    status_code: 200
                };
            } else {
                return {
                    status: "success",
                    result: result,
                    message: "Lotto not found",
                    status_code: 200
                };
            }

        } catch (e) {
            Sys.Log.error("Error in mobileNextLotto", e);
            return {
                status: "fail",
                status_code: 422,
                message: e
            };
        }
    },

    popularLotto: async function(socket, data) {
        let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
        if (jwtverify.status_code == 404) {
            return jwtverify;
        }
        let fav_lotto = "SELECT GROUP_CONCAT(lottoId) as lottoId FROM (SELECT lottoId,COUNT(lottoId) as total FROM `played_event_details` group by lottoId ORDER by total DESC LIMIT 10) as t";
        let result_fav_lotto = await getResult(fav_lotto);

        let lotto_id = result_fav_lotto[0].lottoId.replace(/,/g, "','")
        if (lotto_id == '' || lotto_id == null || lotto_id == 'null' || lotto_id == 'NULL' || lotto_id == 'null') {
            return {
                status: 'success',
                status_code: 200,
                result: result_lotto,
                message: "popularLotto not  available"
            };
        }

        let sql_lotto = "SELECT DATE_FORMAT(l.CutTime,'%Y-%m-%d %H:%i:%s') AS CutTime,DATE_FORMAT(l.UpdateTime,'%Y-%m-%d %H:%i:%s') AS UpdateTime,DATE_FORMAT(l.DrawTime,'%Y-%m-%d %H:%i:%s') AS DrawTime,DATE_FORMAT(l.DaylightSavingBegin,'%Y-%m-%d %H:%i:%s') AS DaylightSavingBegin,l.ProfileName AS lottoName,l.ID as lottoId, l.Country,l.State,l.colorimage,l.grayscaleimage,cl.FlagAbv FROM " + Sys.Config.Table.LOTTOLIST + " AS l LEFT JOIN countrylist cl ON l.CountryId=cl.Id WHERE l.id IN('" + lotto_id + "')";

        let result_lotto = await getResult2(sql_lotto);
        if (!result_lotto.length) {
            return {
                status: 'success',
                status_code: 200,
                result: [],
                message: "popularLotto not  available"
            };
        }
        //Following code for sorting lotto by name
        /*result_lotto.sort((a, b) => a.lottoName.localeCompare(b.lottoName, 'es', {sensitivity: 'base'}));*/

        result_lotto.sort(function(a,b){

          var o1 = a.State.toLowerCase();
          var o2 = b.State.toLowerCase();
          if (o1 < o2) return -1;
          if (o1 > o2) return 1;
            
          var p1 = a.lottoName.toLowerCase();
          var p2 = b.lottoName.toLowerCase();
          if (p1 < p2) return -1;
          if (p1 > p2) return 1;

          return 0;
        });

        return {
            status: 'success',
            status_code: 200,
            result: result_lotto,
            message: "Popular Lotto List"
        };

    },

    iavBalance: async function(socket, data) {
        let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
        if (jwtverify.status_code == 404) {
            return jwtverify;
        }
        let inputs = data;
        let iav_sql = "SELECT ir.last_running_iav AS balance FROM (SELECT MAX(ir.id) as id FROM " + Sys.Config.Table.MOBILEUSERIAV + " uil JOIN " + Sys.Config.Table.IAV_RUNNING + " ir ON uil.IAV_number=ir.IAV_number WHERE uil.userId=" + Sys.SqlPool.escape(inputs.userId) + " GROUP BY ir.IAV_number) test JOIN iav_running ir ON test.id=ir.id";

        let result_iav = await getResult(iav_sql);
        let result = {};
        let balance = 0;

        for (let i = 0; i < result_iav.length; i++) {
            balance = balance + result_iav[i].balance;
        }
        result.balance = balance;

        return {
            status: 'success',
            status_code: 200,
            result: result,
            message: "IAV Balance"
        };
    },

    betHistory: async function(socket, data) {
        try {
            let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
			if (jwtverify.status_code == 404) {
				return jwtverify;
			}
            let inputs = data;
			inputs.status = inputs.status.toLowerCase();
            //console.log("inputs.status==",inputs.status)
            if(inputs.status=='losing'){
                inputs.status = 'loosing';
            }
            let fav_lotto = "SELECT ped.*,DATE_FORMAT(ped.eventDrawTime,'%Y-%m-%d %H:%i:%s') AS eventDrawTime,DATE_FORMAT(ped.created_at,'%Y-%m-%d %H:%i:%s') AS created_at,rel.colorimage,cl.FlagAbv,TO_BASE64(ped.NPV) AS BASE64_ENCODED_NPV FROM " + Sys.Config.Table.MOBILE_USER_BET_HISTORY + " ped left join " + Sys.Config.Table.CRON_LOTTOLIST + " rel on ped.lottoId=rel.profileId left join " + Sys.Config.Table.CUNTRYLIST + " cl ON rel.CountryId=cl.id WHERE ped.userId='" + inputs.userId + "' and ped.status='"+ inputs.status +"' and DATE(created_at) >= DATE(NOW()) - INTERVAL 7 DAY ORDER BY ped.created_at DESC";
			console.log("===",fav_lotto)
            let result_fav_lotto = await getResult(fav_lotto);
            for (let i = 0; i < result_fav_lotto.length; i++) {
            	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(r){var t,e,o,a,h,n,c,d="",C=0;for(r=Base64._utf8_encode(r);C<r.length;)a=(t=r.charCodeAt(C++))>>2,h=(3&t)<<4|(e=r.charCodeAt(C++))>>4,n=(15&e)<<2|(o=r.charCodeAt(C++))>>6,c=63&o,isNaN(e)?n=c=64:isNaN(o)&&(c=64),d=d+this._keyStr.charAt(a)+this._keyStr.charAt(h)+this._keyStr.charAt(n)+this._keyStr.charAt(c);return d},decode:function(r){var t,e,o,a,h,n,c="",d=0;for(r=r.replace(/[^A-Za-z0-9\+\/\=]/g,"");d<r.length;)t=this._keyStr.indexOf(r.charAt(d++))<<2|(a=this._keyStr.indexOf(r.charAt(d++)))>>4,e=(15&a)<<4|(h=this._keyStr.indexOf(r.charAt(d++)))>>2,o=(3&h)<<6|(n=this._keyStr.indexOf(r.charAt(d++))),c+=String.fromCharCode(t),64!=h&&(c+=String.fromCharCode(e)),64!=n&&(c+=String.fromCharCode(o));return c=Base64._utf8_decode(c)},_utf8_encode:function(r){r=r.replace(/\r\n/g,"\n");for(var t="",e=0;e<r.length;e++){var o=r.charCodeAt(e);o<128?t+=String.fromCharCode(o):o>127&&o<2048?(t+=String.fromCharCode(o>>6|192),t+=String.fromCharCode(63&o|128)):(t+=String.fromCharCode(o>>12|224),t+=String.fromCharCode(o>>6&63|128),t+=String.fromCharCode(63&o|128))}return t},_utf8_decode:function(r){for(var t="",e=0,o=c1=c2=0;e<r.length;)(o=r.charCodeAt(e))<128?(t+=String.fromCharCode(o),e++):o>191&&o<224?(c2=r.charCodeAt(e+1),t+=String.fromCharCode((31&o)<<6|63&c2),e+=2):(c2=r.charCodeAt(e+1),c3=r.charCodeAt(e+2),t+=String.fromCharCode((15&o)<<12|(63&c2)<<6|63&c3),e+=3);return t}};

                result_fav_lotto[i].winValue = parseFloat(result_fav_lotto[i].winValue).toFixed(2);
                result_fav_lotto[i].stake_value = parseFloat(result_fav_lotto[i].stake_value).toFixed(2);
                result_fav_lotto[i].credit = parseFloat(result_fav_lotto[i].credit).toFixed(2);
                //result_fav_lotto[i].NPV = Base64.decode(result_fav_lotto[i].BASE64_ENCODED_NPV);
                if(result_fav_lotto[i].status=="loosing"){
                    result_fav_lotto[i].status = "losing";
                }
                result_fav_lotto[i]['country_image'] = result_fav_lotto[i].FlagAbv + '.png'
            }
			console.log("===result_fav_lotto=",result_fav_lotto)
            if (result_fav_lotto.length > 0) {
                return {
                    status: 'success',
                    status_code: 200,
                    result: result_fav_lotto,
                    message: "Bet History List"
                };
            } else {
                return {
                    status: 'success',
                    status_code: 200,
                    result: result_fav_lotto,
                    message: "Bet History not available"
                };
            }
        } catch (e) {
            Sys.Log.error("Error in mobileNextLotto", e);
            return {
                status: "fail",
                status_code: 422,
                message: e
            };
        }

    },

    iavHistory: async function(socket, data) {
        try {
            let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
            if (jwtverify.status_code == 404) {
                return jwtverify;
            }
            let inputs = data;
            //let check_iav = "SELECT IAV_number as iavNo,last_running_iav as balance,DATE_FORMAT(refundDate,'%Y-%m-%d %H:%i:%s') AS refundDate,userId,DATE_FORMAT(timestamp,'%Y-%m-%d %H:%i:%s') AS historyDate ,siteId FROM " + Sys.Config.Table.IAV_RUNNING + "  WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY IAV_number,ID ASC";
			let check_iav = "SELECT IAV_number as iavNo,balance,userId,DATE_FORMAT(Purchased_date,'%d-%m-%Y %H:%i') AS historyDate ,siteId,siteName FROM " + Sys.Config.Table.MOBILEUSERIAV + "  WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY id ASC";
			
            let result_check_iav = await getResult(check_iav);
            if (result_check_iav.length > 0) {
                return {
                    status: 'success',
                    status_code: 200,
                    result: result_check_iav,
                    message: "IAV History List"
                };
            } else {
                return {
                    status: 'success',
                    status_code: 200,
                    result: result_check_iav,
                    message: "IAV History not available"
                };
            }
        } catch (e) {
            //Sys.Log.error("Error in mobileNextLotto", e);
            return {
                status: "fail",
                status_code: 422,
                message: e
            };
        }

    },

    getSetting: async function(socket, data) {
        try {
            let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
            if (jwtverify.status_code == 404) {
                return jwtverify;
            }
            let inputs = data;
            let sql_setting = "SELECT * FROM " + Sys.Config.Table.MOBILE_SETTING + " WHERE userId=" + Sys.SqlPool.escape(inputs.userId) + " ORDER BY ID DESC LIMIT 1";
            let result_setting = await getResult(sql_setting);
            let setting = {};
            if (result_setting.length > 0) {

                setting.userId = result_setting[0].userId;
                setting.withDraw = result_setting[0].withDraw;
                setting.lottoResult = result_setting[0].lottoResult;
                return {
                    status: 'success',
                    status_code: 200,
                    result: setting,
                    message: "Get Setting successfully"
                };
            } else {
                setting.userId = inputs.userId
                setting.withDraw = 0;
                setting.lottoResult = 0;
                return {
                    status: 'success',
                    status_code: 200,
                    result: setting,
                    message: "Get Setting successfully"
                };
            }
        } catch (e) {
            //Sys.Log.error("Error in mobileNextLotto", e);
            return {
                status: "fail",
                status_code: 422,
                message: e
            };
        }

    },

    countryList: async function(socket, data) {
        try {
            let jwtverify = await Sys.App.Sockets.Kioskapp.jwtverify(data);
            if (jwtverify.status_code == 404) {
                return jwtverify;
            }
            let inputs = data;
            let country = "SELECT DISTINCT(cl.id) AS id,CONCAT(cl.FlagAbv,'.png') as flag,cl.Country,cl.Continent,cl.FlagAbv FROM " + Sys.Config.Table.CUNTRYLIST + " cl JOIN " + Sys.Config.Table.LOTTOLIST + " ll ON cl.id=ll.CountryId";

            let result_country = await getResult2(country);
            if (result_country.length > 0) {
                
                return {
                    status: 'success',
                    status_code: 200,
                    result: result_country,
                    message: "Country list"
                };
            } else {
                return {
                    status: 'success',
                    status_code: 200,
                    result: result_country,
                    message: "Country list not available"
                };
            }
        } catch (e) {
            //Sys.Log.error("Error in mobileNextLotto", e);
            return {
                status: "fail",
                status_code: 422,
                message: e
            };
        }

    },



}

function timeConvert(timezone){
let operator = timezone.charAt(0);
    timezone = timezone.substr(1);
  let time = timezone.split(":");
  let hour = parseInt(time[0]);
  let minute = parseInt(time[1]);
    
  //return operator+(hour*60+minute);
  return (hour*60+minute);
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