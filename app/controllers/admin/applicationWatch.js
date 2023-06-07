var dateformat = require('dateformat');
var currentDate = new Date();
var Op = Sequelize.Op;
var md5 = require('md5');
var dateFormat = require('dateformat');
module.exports = function(model,config){    
    var module = {};


    

    module.watchNextDraw = async function(request, response){
            //request.setTimeout(1500000);
            var d = new Date();
            var dt = d.getDate()+2;
            var current = new Date(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss",true));
                current = current.setHours(current.getHours() + 2);
                current = dateFormat(current, "yyyy-mm-dd HH:MM:ss");

                var t = new Date();
               // t.setDate(t.getDate() + 2);
                var next = new Date(dateFormat(new Date(t), "yyyy-mm-dd HH:MM:ss",true));
                next.setDate(next.getDate() - 8);
                next = dateFormat(next, "yyyy-mm-dd HH:MM:ss");
                console.log("current===",current);
                console.log("next===",next);
            let tra = await sequelize_cngapi.transaction();
            try {
                function custom_sort(a, b) {
                    return new Date(b.lastUpdateTime).getTime() - new Date(a.lastUpdateTime).getTime();
                }
                //let sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.drawLink,ll.RegUsed,ll.StartNum,ll.live_url,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " + config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)<='" + next + "' AND ll.Enable=1  AND le.IsClosed!=1 GROUP BY le.ProfileID ORDER by DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)";
                let sql = "SELECT le.profileID,le.ID,le.DrawTime,ll.TimeZone, le.Result,le.UpdateTime,le.CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID WHERE  le.IsClosed=1 AND le.Result!='' AND  le.UpdateTime >= '"+next+"' AND le.UpdateTime <= '"+current+"' ORDER BY le.ID DESC";
                console.log(sql)
                let result = await sequelize_cngapi.query(sql, { transaction: tra ,type: sequelize_cngapi.QueryTypes.SELECT})
                 
                if (result.length) {
                //var time = require('time');
                let dataArr = [];
                let profileIDArr = [];
                for(let i=0;i<result.length;i++){
                    //let profileTimezone = result[i]['TimeZone'];
                    profileIDArr.push(result[i].profileID);
                    /*let timediff = (+2) - (profileTimezone);
                    var now = dateFormat(new Date(result[i]['CutTime']), "yyyy-mm-dd HH:MM:ss");
                    now  = new Date(now);
                    
                    var CutTime = new Date(now.getTime() + (timediff * 1000 * 60 * 60));
                    CutTime = dateFormat(CutTime, "yyyy-mm-dd HH:MM:ss");
                    result['CutTime'] = CutTime;
                    result[i]['countryFlag'] = config.baseUrl+'/flags/'+result[i].countryFlag+'.png';
                    result[i]['colorimage'] = config.lotto_img_url+'/'+result[i].colorimage;*/

                     //sql = "SELECT DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone, le.Result FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID WHERE le.ProfileID='" + result[i].lottoId + "' AND le.Result!='' AND le.DrawTime <= now() - interval 8 day ORDER BY le.DrawTime DESC limit 1";
                     /*sql = "CALL ProfileLastResult(" + result[i].lottoId + ")";
                     let lottoevent_result = await sequelize_cngapi.query(sql, { transaction: tra ,type: sequelize_cngapi.QueryTypes.SELECT});
                        
                     if(lottoevent_result[0]['0']){
                        let date1 = new Date(dateFormat(lottoevent_result[0].DrawTime, "yyyy-mm-dd"));
                        let date2 = new Date(dateFormat(new Date(), "yyyy-mm-dd"));
                        let diffTime = Math.abs(date2 - date1);
                        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        console.log(diffTime + " milliseconds");
                        console.log(diffDays + " days");
                        if(diffDays<=8){
                            
                        }else{
                            result[i]['lastDrawTime'] = '';
                        }
                        console.log(i,'=',lottoevent_result[0]['0'])
                        result[i]['lastDrawTime'] = lottoevent_result[0]['0'].DrawTime;
                        result[i]['lastResult'] = lottoevent_result[0]['0'].Result;
                        dataArr.push(result[i]);

                     }else{
                        continue;
                        result[i]['lastDrawTime'] = '';
                        result[i]['lastResult'] = '';
                     }*/
                    
                }
                if(profileIDArr.length){
                    
                /*result.sort(custom_sort);*/
                    console.log("profileID=",profileIDArr)
                    profileIDArr = profileIDArr.filter((value, index, array) => array.indexOf(value) === index);
                    var ids = profileIDArr,
                    formatted = `(${ids.map(v => JSON.stringify(v.toString())).join(', ')})`;

                console.log("formatted",formatted)

                    //let next_sql="SELECT le.ProfileID,le.ID,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,le.DrawTime as Draw,ll.TimeZone, le.Result FROM lottolist ll LEFT JOIN lottoevent le ON  ll.ID=le.ProfileID WHERE le.ProfileID IN"+formatted+" AND le.Result!='' AND le.IsClosed=1  ORDER BY le.DrawTime DESC ";
                    let next_sql="SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.drawLink,ll.RegUsed,ll.StartNum,ll.live_url,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " + config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND le.Result='' AND ll.Enable=1  AND le.IsClosed!=1 AND le.ProfileID IN"+formatted+" GROUP BY le.ProfileID ORDER by le.DrawTime DESC ";
                    let filter_result = await sequelize_cngapi.query(next_sql, { transaction: tra ,type: sequelize_cngapi.QueryTypes.SELECT});
                    for(let i=0;i<result.length;i++){
                        for(j=0;j<filter_result.length;j++){
                            if(result[i].profileID==filter_result[j].lottoId){
                                var index = dataArr.findIndex(obj => obj.lottoId==filter_result[j].lottoId);
                                
                                if(index<=-1){
                                    let profileTimezone = result[i]['TimeZone'];
                                    let timediff = (+2) - (profileTimezone);
                                    var now = dateFormat(new Date(result[i]['CutTime']), "yyyy-mm-dd HH:MM:ss");
                                    now  = new Date(now);
                                    console.log("now1",now);
                                    
                                    var CutTime = new Date(now.getTime() + (timediff * 1000 * 60 * 60));

                                    CutTime = dateFormat(CutTime, "yyyy-mm-dd HH:MM:ss");
                                    console.log("now2",CutTime);
                                    filter_result[j]['CutTime'] = CutTime;
                                    filter_result[j]['countryFlag'] = config.baseUrl+'/flags/'+filter_result[j].countryFlag+'.png';
                                    filter_result[j]['colorimage'] = config.lotto_img_url+'/'+filter_result[j].colorimage;
                                    filter_result[j]['lastDrawTime'] = dateFormat(result[i].DrawTime, "yyyy-mm-dd HH:MM:ss");
                                    filter_result[j]['lastUpdateTime'] = dateFormat(result[i].UpdateTime, "yyyy-mm-dd HH:MM:ss");
                                    filter_result[j]['lastResult'] = result[i].Result;
                                    filter_result[j]['lastID'] = result[i].ID;
                                    dataArr.push(filter_result[j])
                                    
                                }
                                
                            }
                        }
                    }
                    //console.log(dataArr);

                }
                
                dataArr.sort(custom_sort);
                /*dataArr = dataArr.sort(function(a, b) {
                    return new Date(b.DrawTime).getTime() - new Date(a.DrawTime).getTime();
                });*/
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
                   await tra.rollback();
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
                
                let profileIDArr = [];
                let dataArr = [];
                if (result.length) {
                //var time = require('time');
                for(let i=0;i<result.length;i++){
                    profileIDArr.push(result[i].lottoId)
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
                if(profileIDArr.length){
                    console.log(profileIDArr)
                    profileIDArr = profileIDArr.filter((value, index, array) => array.indexOf(value) === index);
                    var ids = profileIDArr,
                    formatted = `(${ids.map(v => JSON.stringify(v.toString())).join(', ')})`;
                    let next_sql="SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.drawLink,ll.RegUsed,ll.StartNum,ll.live_url,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " + config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND le.Result='' AND ll.Enable=1  AND le.IsClosed!=1 AND le.ProfileID IN"+formatted+" GROUP BY le.ProfileID ORDER by le.DrawTime DESC ";
                    
                        let filter_result = await sequelize_cngapi.query(next_sql, { transaction: tra ,type: sequelize_cngapi.QueryTypes.SELECT});
                        for(let i=0;i<result.length;i++){
                            for(j=0;j<filter_result.length;j++){
                                if(result[i].lottoId==filter_result[j].lottoId){
                                    var index = dataArr.findIndex(obj => obj.lottoId==filter_result[j].lottoId);
                                    
                                    if(index<=-1){
                                        let profileTimezone = filter_result[j]['TimeZone'];
                                        let timediff = (+2) - (profileTimezone);
                                        var now = dateFormat(new Date(filter_result[j]['CutTime']), "yyyy-mm-dd HH:MM:ss");
                                        now  = new Date(now);
                                        
                                        var CutTime = new Date(now.getTime() + (timediff * 1000 * 60 * 60));
                                        CutTime = dateFormat(CutTime, "yyyy-mm-dd HH:MM:ss");
                                        result[i]['DrawTime'] = filter_result[j].DrawTime;
                                        result[i]['CutTime'] = CutTime;
                                        dataArr.push(result[i])
                                        
                                    }
                                    
                                }
                            }
                        }
                }
                await tra.commit(); 
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
                   await tra.rollback();
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
