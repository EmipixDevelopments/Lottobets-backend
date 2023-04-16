var dateformat = require('dateformat');
var currentDate = new Date();
var Op = Sequelize.Op;
var md5 = require('md5');
var dateFormat = require('dateformat');
module.exports = function(model,config){	
	var module = {};


	

	module.homeScreen = async function(request, response){
			
			
			let tra_lucky = await sequelize_luckynumberint.transaction();
            let tra_cngapi = await sequelize_cngapi.transaction();
		    try {
		    	let sql = "SELECT DISTINCT(cl.id) AS id,CONCAT(cl.FlagAbv,'.png') as flag,cl.Country,cl.Continent,cl.FlagAbv FROM " + config.Table.CUNTRYLIST + " cl JOIN " + config.Table.LOTTOLIST + " ll ON cl.id=ll.CountryId";
		        let country_result = await sequelize_cngapi.query(sql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT})
				
				sql = "SELECT GROUP_CONCAT(lottoId) as lottoId FROM (SELECT lottoId,COUNT(lottoId) as total FROM `played_event_details` group by lottoId ORDER by total DESC LIMIT 10) as t";
                let result_fav_lotto = await sequelize_cngapi.query(sql, { transaction: tra_lucky ,type: sequelize_cngapi.QueryTypes.SELECT})
                let lotto_id = result_fav_lotto[0].lottoId.replace(/,/g, "','");
                let popular_game=[];
                if (lotto_id != '' || lotto_id != null || lotto_id != 'null' || lotto_id != 'NULL' || lotto_id != 'null') {
                    sql = "SELECT DATE_FORMAT(l.CutTime,'%Y-%m-%d %H:%i:%s') AS CutTime,DATE_FORMAT(l.UpdateTime,'%Y-%m-%d %H:%i:%s') AS UpdateTime,DATE_FORMAT(l.DrawTime,'%Y-%m-%d %H:%i:%s') AS DrawTime,DATE_FORMAT(l.DaylightSavingBegin,'%Y-%m-%d %H:%i:%s') AS DaylightSavingBegin,l.ProfileName AS lottoName,l.ID as lottoId, l.Country,l.State,l.colorimage,l.grayscaleimage,cl.FlagAbv FROM " + config.Table.LOTTOLIST + " AS l LEFT JOIN countrylist cl ON l.CountryId=cl.Id WHERE l.id IN('" + lotto_id + "')";
                     popular_game = await sequelize_cngapi.query(sql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT})
                     if (popular_game.length) {
                        popular_game.sort(function(a,b){

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
                    }
                }

                sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.RegUsed,ll.StartNum,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " +config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)<='" + next + "' AND ll.Enable=1  AND le.IsClosed!=1 GROUP BY le.ProfileID ORDER by DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR) limit 20";
                let next_lotto_result = await sequelize_cngapi.query(sql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT})
                
                if (next_lotto_result.length) {
                    for(let i=0;i<next_lotto_result.length;i++){
                        let profileTimezone = next_lotto_result[i]['TimeZone'];
                        let timediff = (+2) - (profileTimezone);
                                    
                        /*var now = new time.Date(next_lotto_result[i]['CutTime']);
                        now.setTimezone('UTC');*/
                        var now = dateFormat(new Date(next_lotto_result[i]['CutTime']), "yyyy-mm-dd HH:MM:ss");
                        now  = new Date(now);
                        

                        var CutTime = new Date(now.getTime() + (timediff * 1000 * 60 * 60));
                        CutTime = dateFormat(CutTime, "yyyy-mm-dd HH:MM:ss");
                        next_lotto_result['CutTime'] = CutTime;
                    }
                }
                await tra_lucky.commit();
                await tra_cngapi.commit();
                return response.send({
                    status: "success",
                    result: {country:country_result,popular_game:popular_game,next_draw:next_lotto_result},
                    message: "Data found successfully",
                    status_code: 200
                });

                 
		    } catch (error) {
		        console.log('error',error);
		        if(tra_lucky) {
		           await tra_lucky.rollback();
                }
                if(tra_cngapi) {
                   await tra_cngapi.rollback();
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
