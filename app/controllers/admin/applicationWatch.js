var dateformat = require('dateformat');
var currentDate = new Date();
var Op = Sequelize.Op;
var md5 = require('md5');
var dateFormat = require('dateformat');
module.exports = function(model,config){    
    var module = {};


    

    module.watchNextDraw = async function(request, response){
            
            var d = new Date();
            var dt = d.getDate()+2;
            var current = new Date(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss",true));
                current = current.setHours(current.getHours() + 2);
                current = dateFormat(current, "yyyy-mm-dd HH:MM:ss");

                var t = new Date();
               // t.setDate(t.getDate() + 2);
                var next = new Date(dateFormat(new Date(t), "yyyy-mm-dd HH:MM:ss",true));
                next.setHours(next.getMinutes() + 55);
                next = dateFormat(next, "yyyy-mm-dd HH:MM:ss");
                console.log("current===",current);
                console.log("next===",next);
            let tra = await sequelize_cngapi.transaction();
            try {
                let sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.drawLink,ll.RegUsed,ll.StartNum,ll.live_url,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " + config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)<='" + next + "' AND ll.Enable=1  AND le.IsClosed!=1 GROUP BY le.ProfileID ORDER by DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)";
                console.log(sql)
                let result = await sequelize_cngapi.query(sql, { transaction: tra ,type: sequelize_cngapi.QueryTypes.SELECT})
                 
                if (result.length) {
                //var time = require('time');
                let dataArr = [];
                for(let i=0;i<result.length;i++){
                    let profileTimezone = result[i]['TimeZone'];
                    let timediff = (+2) - (profileTimezone);
                    var now = dateFormat(new Date(result[i]['CutTime']), "yyyy-mm-dd HH:MM:ss");
                    now  = new Date(now);
                    
                    var CutTime = new Date(now.getTime() + (timediff * 1000 * 60 * 60));
                    CutTime = dateFormat(CutTime, "yyyy-mm-dd HH:MM:ss");
                    result['CutTime'] = CutTime;
                    result[i]['countryFlag'] = config.baseUrl+'/flags/'+result[i].countryFlag+'.png';
                    result[i]['colorimage'] = config.lotto_img_url+'/'+result[i].colorimage;

                     sql = "SELECT DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone, le.Result FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID WHERE le.ProfileID='" + result[i].lottoId + "' AND le.Result!='' AND le.DrawTime <= now() - interval 8 day ORDER BY le.DrawTime DESC limit 1";
                     sql = "CALL ProfileLastResult(" + result[i].lottoId + ")";
                     let lottoevent_result = await sequelize_cngapi.query(sql, { transaction: tra ,type: sequelize_cngapi.QueryTypes.SELECT});
                        
                     if(lottoevent_result[0]['0']){
                        /*let date1 = new Date(dateFormat(lottoevent_result[0].DrawTime, "yyyy-mm-dd"));
                        let date2 = new Date(dateFormat(new Date(), "yyyy-mm-dd"));
                        let diffTime = Math.abs(date2 - date1);
                        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        console.log(diffTime + " milliseconds");
                        console.log(diffDays + " days");*/
                        /*if(diffDays<=8){
                            
                        }else{
                            result[i]['lastDrawTime'] = '';
                        }*/
                        console.log(i,'=',lottoevent_result[0]['0'])
                        result[i]['lastDrawTime'] = lottoevent_result[0]['0'].DrawTime;
                        result[i]['lastResult'] = lottoevent_result[0]['0'].Result;
                        dataArr.push(result[i]);

                     }else{
                        continue;
                        result[i]['lastDrawTime'] = '';
                        result[i]['lastResult'] = '';
                     }
                    
                }
                function custom_sort(a, b) {
                    return new Date(b.lastDrawTime).getTime() - new Date(a.lastDrawTime).getTime();
                }
                dataArr.sort(custom_sort);
                await tra.commit();
                return response.send({
                    status: "success",
                    result: dataArr,
                    message: "Lotto found successfully",
                    status_code: 200
                });
            } else {
                return response.send({
                    status: "success",
                    result: result,
                    message: "Lotto not found",
                    status_code: 200
                });
            }
            } catch (error) {
                console.log('error',error);
                if(tra) {
                   await t.rollback();
                }
                return response.send({
                    status: 'fail',
                    message: error,
                    status_code: 422
                });
            }

    };

    module.watchListAllLotteries = async function(request, response){
            
            var d = new Date();
            var dt = d.getDate()+2;
            var current = new Date(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss",true));
                current = current.setHours(current.getHours() + 2);
                current = dateFormat(current, "yyyy-mm-dd HH:MM:ss");
                console.log("current==",current);

                var t = new Date();
                t.setDate(t.getDate() - 8);
                var next = new Date(dateFormat(new Date(t), "yyyy-mm-dd HH:MM:ss",true));
                next.setHours(next.getHours() + 2);
                next = dateFormat(next, "yyyy-mm-dd HH:MM:ss");
                console.log("next==",next);
            let tra = await sequelize_cngapi.transaction();
            try {
                //let sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.RegUsed,ll.BonusUsed,ll.StartNum,ll.live_url,ll.drawLink,le.Result,le.UpdateTime,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " + config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE le.UpdateTime> now() - interval 8 day AND ll.Enable=1  AND le.IsClosed=1 GROUP BY le.ProfileID ORDER by le.UpdateTime desc";
                let sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.drawLink,ll.RegUsed,ll.StartNum,ll.live_url,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " + config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE le.DrawTime>='" + next + "' AND le.DrawTime<='" + current + "' AND ll.Enable=1  AND le.IsClosed=1 GROUP BY le.ProfileID ORDER by le.DrawTime desc ";
                console.log(sql)
                let result = await sequelize_cngapi.query(sql, { transaction: tra ,type: sequelize_cngapi.QueryTypes.SELECT})
                await tra.commit(); 
                if (result.length) {
                //var time = require('time');
                for(let i=0;i<result.length;i++){
                    let profileTimezone = result[i]['TimeZone'];
                    let timediff = (+2) - (profileTimezone);
                    var now = dateFormat(new Date(result[i]['CutTime']), "yyyy-mm-dd HH:MM:ss");
                    now  = new Date(now);
                    
                    var CutTime = new Date(now.getTime() + (timediff * 1000 * 60 * 60));
                    CutTime = dateFormat(CutTime, "yyyy-mm-dd HH:MM:ss");
                    result['CutTime'] = CutTime;
                    result[i]['countryFlag'] = config.baseUrl+'/flags/'+result[i].countryFlag+'.png';
                    result[i]['colorimage'] = config.lotto_img_url+'/'+result[i].colorimage;
                    
                }
                
                return response.send({
                    status: "success",
                    result: result,
                    message: "Lotto found successfully",
                    status_code: 200
                });
            } else {
                return response.send({
                    status: "success",
                    result: result,
                    message: "Lotto not found",
                    status_code: 200
                });
            }
            } catch (error) {
                console.log('error',error);
                if(tra) {
                   await t.rollback();
                }
                return response.send({
                    status: 'fail',
                    message: error,
                    status_code: 422
                });
            }

    };
    module.watchLottoUpdate = async function(request, response){
            
            
            let tra = await sequelize_cngapi.transaction();
            let input = request.body;
            try {
                let sql = "SELECT ID FROM " + config.Table.LOTTOLIST + " WHERE ID="+sequelize_luckynumberint.escape(input.lottoId)+" limit 1";
                //console.log(sql)
                let result = await sequelize_cngapi.query(sql, { transaction: tra ,type: sequelize_cngapi.QueryTypes.SELECT})
                
                if (result.length) {
                    let sql_update = "UPDATE " + config.Table.LOTTOLIST + " SET drawLink="+sequelize_luckynumberint.escape(input.drawLink)+",live_url="+sequelize_luckynumberint.escape(input.liveURL)+" WHERE ID="+sequelize_luckynumberint.escape(input.lottoId)+" limit 1";
                    await sequelize_cngapi.query(sql_update, { transaction: tra ,type: sequelize_cngapi.QueryTypes.UPADTE})
                    await tra.commit(); 
                    return response.send({
                        status: "success",
                        result: result[0],
                        message: "Lotto Updated Successfully",
                        status_code: 200
                    });
                } else {
                    await tra.commit();
                    return response.send({
                        status: "fail",
                        result: '',
                        message: "Lotto not found",
                        status_code: 422
                    });
                }
            } catch (error) {
                console.log('error',error);
                if(tra) {
                   await tra.rollback();
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
