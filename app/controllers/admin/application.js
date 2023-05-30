var dateformat = require('dateformat');
var currentDate = new Date();
var Op = Sequelize.Op;
var md5 = require('md5');
var dateFormat = require('dateformat');
module.exports = function(model,config){	
	var module = {};


	

	module.nextDraw = async function(request, response){
			
			var d = new Date();
            var dt = d.getDate()+2;
            var current = new Date(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss",true));
                current = current.setHours(current.getHours() + 2);
                current = dateFormat(current, "yyyy-mm-dd HH:MM:ss");

                var t = new Date();
                t.setDate(t.getDate() + 2);
                var next = new Date(dateFormat(new Date(t), "yyyy-mm-dd HH:MM:ss",true));
                next.setHours(next.getHours() + 2);
                next = dateFormat(next, "yyyy-mm-dd HH:MM:ss");
			let tra = await sequelize_cngapi.transaction();
		    try {
		    	let sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.drawLink,ll.RegUsed,ll.StartNum,ll.live_url,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " + config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)<='" + next + "' AND ll.Enable=1  AND le.IsClosed!=1 GROUP BY le.ProfileID ORDER by DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR) limit 20";
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

    module.listAllLotteries = async function(request, response){
            
            var d = new Date();
            var dt = d.getDate()+2;
            var current = new Date(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss",true));
                current = current.setHours(current.getHours() + 2);
                current = dateFormat(current, "yyyy-mm-dd HH:MM:ss");
                console.log("current==",current);

                var t = new Date();
                t.setDate(t.getDate() + 2);
                var next = new Date(dateFormat(new Date(t), "yyyy-mm-dd HH:MM:ss",true));
                next.setHours(next.getHours() + 2);
                next = dateFormat(next, "yyyy-mm-dd HH:MM:ss");
                console.log("next==",next);
            let tra = await sequelize_cngapi.transaction();
            try {
                let sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.RegUsed,ll.BonusUsed,ll.StartNum,ll.live_url,ll.drawLink,le.Result,le.UpdateTime,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " + config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE le.UpdateTime> now() - interval 8 day AND ll.Enable=1  AND le.IsClosed=1 GROUP BY le.ProfileID ORDER by le.UpdateTime desc";
                //let sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.RegUsed,ll.BonusUsed,ll.StartNum,ll.live_url,ll.drawLink,le.Result,le.UpdateTime,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " + config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)<='" + next + "' AND ll.Enable=1  AND le.IsClosed!=1 GROUP BY le.ProfileID ORDER by DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR) GROUP BY le.ProfileID ORDER by le.UpdateTime desc";
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

	return module;
}
