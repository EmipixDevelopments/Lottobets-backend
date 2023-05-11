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
            console.log("homeScreen=",request.body);
            let search='';
            if(request.body.hasOwnProperty('search') && request.body.search.trim()!=''){
                search = request.body.search;
            }
		    try {
		    	let sql = "SELECT DISTINCT(cl.id) AS id,CONCAT(cl.FlagAbv,'.png') as flag,cl.Country,cl.Continent,cl.FlagAbv FROM " + config.Table.CUNTRYLIST + " cl JOIN " + config.Table.LOTTOLIST + " ll ON cl.id=ll.CountryId";
                if(search!=''){
                    sql = "SELECT DISTINCT(cl.id) AS id,CONCAT(cl.FlagAbv,'.png') as flag,cl.Country,cl.Continent,cl.FlagAbv FROM " + config.Table.CUNTRYLIST + " cl JOIN " + config.Table.LOTTOLIST + " ll ON cl.id=ll.CountryId WHERE cl.Country like '%"+search+"%' ";
                }
                let country_result = await sequelize_cngapi.query(sql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT});
                for(let i=0;i<country_result.length;i++){
                    country_result[i]['countryFlag'] = config.baseUrl+'/flags/'+country_result[i].flag;
                }
				
				sql = "SELECT GROUP_CONCAT(lottoId) as lottoId FROM (SELECT lottoId,COUNT(lottoId) as total FROM `played_event_details` group by lottoId ORDER by total DESC LIMIT 10) as t";
                let result_fav_lotto = await sequelize_cngapi.query(sql, { transaction: tra_lucky ,type: sequelize_cngapi.QueryTypes.SELECT})
                let lotto_id = result_fav_lotto[0].lottoId.replace(/,/g, "','");
                let popular_game=[];
                if (lotto_id != '' || lotto_id != null || lotto_id != 'null' || lotto_id != 'NULL' || lotto_id != 'null') {
                    sql = "SELECT DATE_FORMAT(l.CutTime,'%Y-%m-%d %H:%i:%s') AS CutTime,DATE_FORMAT(l.UpdateTime,'%Y-%m-%d %H:%i:%s') AS UpdateTime,DATE_FORMAT(l.DrawTime,'%Y-%m-%d %H:%i:%s') AS DrawTime,DATE_FORMAT(l.DaylightSavingBegin,'%Y-%m-%d %H:%i:%s') AS DaylightSavingBegin,l.ProfileName AS lottoName,l.ID as lottoId, l.Country,l.State,l.colorimage,l.grayscaleimage,cl.FlagAbv FROM " + config.Table.LOTTOLIST + " AS l LEFT JOIN countrylist cl ON l.CountryId=cl.Id WHERE l.id IN('" + lotto_id + "')";
                    if(search!=''){
                        sql = "SELECT DATE_FORMAT(l.CutTime,'%Y-%m-%d %H:%i:%s') AS CutTime,DATE_FORMAT(l.UpdateTime,'%Y-%m-%d %H:%i:%s') AS UpdateTime,DATE_FORMAT(l.DrawTime,'%Y-%m-%d %H:%i:%s') AS DrawTime,DATE_FORMAT(l.DaylightSavingBegin,'%Y-%m-%d %H:%i:%s') AS DaylightSavingBegin,l.ProfileName AS lottoName,l.ID as lottoId, l.Country,l.State,l.colorimage,l.grayscaleimage,cl.FlagAbv FROM " + config.Table.LOTTOLIST + " AS l LEFT JOIN countrylist cl ON l.CountryId=cl.Id WHERE l.id IN('" + lotto_id + "') AND (l.ProfileName like '%"+search+"%' OR l.Country like '%"+search+"%')";
                    }
                    
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
                for(let i=0;i<popular_game.length;i++){
                    popular_game[i]['countryFlag'] = config.baseUrl+'/flags/'+popular_game[i].FlagAbv+'.png';
                    popular_game[i]['colorimage'] = config.baseUrl+'/Lotto/'+popular_game[i].colorimage;
                }
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
                sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.RegUsed,ll.StartNum,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " +config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)<='" + next + "' AND ll.Enable=1  AND le.IsClosed!=1 GROUP BY le.ProfileID ORDER by DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)";
                if(search!=''){
                        sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.RegUsed,ll.StartNum,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " +config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)<='" + next + "' AND ll.Enable=1  AND le.IsClosed!=1 AND (ll.ProfileName like '%"+search+"%' OR ll.Country like '%"+search+"%') GROUP BY le.ProfileID ORDER by DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)";
                }
                let next_lotto_result = await sequelize_cngapi.query(sql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT})
                
                if (next_lotto_result.length) {
                    for(let i=0;i<next_lotto_result.length;i++){
                        let profileTimezone = next_lotto_result[i]['TimeZone'];
                        let timediff = (+2) - (profileTimezone);
                                    
                        /*var now = new time.Date(next_lotto_result[i]['CutTime']);
                        now.setTimezone('UTC');*/
                        var now = dateFormat(new Date(next_lotto_result[i]['CutTime']), "yyyy-mm-dd HH:MM:ss");
                        now  = new Date(now);
                        
                        next_lotto_result[i]['countryFlag'] = config.baseUrl+'/flags/'+next_lotto_result[i].countryFlag+'.png';
                        next_lotto_result[i]['colorimage'] = config.baseUrl+'/Lotto/'+next_lotto_result[i].colorimage;
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
    module.popularGames = async function(request, response){
            
            
            let tra_lucky = await sequelize_luckynumberint.transaction();
            let tra_cngapi = await sequelize_cngapi.transaction();
            console.log("homeScreen=",request.body);
            let search='';
            if(request.body.hasOwnProperty('search') && request.body.search.trim()!=''){
                search = request.body.search;
            }
            try {
                let sql = "SELECT GROUP_CONCAT(lottoId) as lottoId FROM (SELECT lottoId,COUNT(lottoId) as total FROM `played_event_details` group by lottoId ORDER by total DESC LIMIT 10) as t";
                let result_fav_lotto = await sequelize_cngapi.query(sql, { transaction: tra_lucky ,type: sequelize_cngapi.QueryTypes.SELECT})
                let lotto_id = result_fav_lotto[0].lottoId.replace(/,/g, "','");
                let popular_game=[];
                if (lotto_id != '' || lotto_id != null || lotto_id != 'null' || lotto_id != 'NULL' || lotto_id != 'null') {
                    sql = "SELECT DATE_FORMAT(l.CutTime,'%Y-%m-%d %H:%i:%s') AS CutTime,DATE_FORMAT(l.UpdateTime,'%Y-%m-%d %H:%i:%s') AS UpdateTime,DATE_FORMAT(l.DrawTime,'%Y-%m-%d %H:%i:%s') AS DrawTime,DATE_FORMAT(l.DaylightSavingBegin,'%Y-%m-%d %H:%i:%s') AS DaylightSavingBegin,l.ProfileName AS lottoName,l.ID as lottoId, l.Country,l.State,l.colorimage,l.grayscaleimage,cl.FlagAbv FROM " + config.Table.LOTTOLIST + " AS l LEFT JOIN countrylist cl ON l.CountryId=cl.Id WHERE l.id IN('" + lotto_id + "')";
                    if(search!=''){
                        sql = "SELECT DATE_FORMAT(l.CutTime,'%Y-%m-%d %H:%i:%s') AS CutTime,DATE_FORMAT(l.UpdateTime,'%Y-%m-%d %H:%i:%s') AS UpdateTime,DATE_FORMAT(l.DrawTime,'%Y-%m-%d %H:%i:%s') AS DrawTime,DATE_FORMAT(l.DaylightSavingBegin,'%Y-%m-%d %H:%i:%s') AS DaylightSavingBegin,l.ProfileName AS lottoName,l.ID as lottoId, l.Country,l.State,l.colorimage,l.grayscaleimage,cl.FlagAbv FROM " + config.Table.LOTTOLIST + " AS l LEFT JOIN countrylist cl ON l.CountryId=cl.Id WHERE l.id IN('" + lotto_id + "') AND l.ProfileName like '%"+search+"%' ";
                    }
                    
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
                for(let i=0;i<popular_game.length;i++){
                    popular_game[i]['countryFlag'] = config.baseUrl+'/flags/'+popular_game[i].FlagAbv+'.png';
                    popular_game[i]['colorimage'] = config.baseUrl+'/Lotto/'+popular_game[i].colorimage;
                }
                
                await tra_lucky.commit();
                await tra_cngapi.commit();
                return response.send({
                    status: "success",
                    result: popular_game,
                    message: (popular_game.length)? "Data found successfully":"Data not found",
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
    module.favourite = async function(request, response){
            
            
            let tra_lucky = await sequelize_luckynumberint.transaction();
            let tra_cngapi = await sequelize_cngapi.transaction();
            console.log("homeScreen=",request.body);
            let inputs = request.body;
            let search='';
            if(request.body.hasOwnProperty('search') && request.body.search.trim()!=''){
                search = request.body.search;
            }
            try {
                let sql = "SELECT favourite as lottoId  FROM " + config.Table.USER + " WHERE userId=" + sequelize_luckynumberint.escape(inputs.userId) + "";
                let result_fav_lotto = await sequelize_cngapi.query(sql, { transaction: tra_lucky ,type: sequelize_cngapi.QueryTypes.SELECT})
                let lotto_id = result_fav_lotto[0].lottoId.replace(/,/g, "','");
                let popular_game=[];
                if (lotto_id != '' || lotto_id != null || lotto_id != 'null' || lotto_id != 'NULL' || lotto_id != 'null') {
                    sql = "SELECT DATE_FORMAT(l.CutTime,'%Y-%m-%d %H:%i:%s') AS CutTime,DATE_FORMAT(l.UpdateTime,'%Y-%m-%d %H:%i:%s') AS UpdateTime,DATE_FORMAT(l.DrawTime,'%Y-%m-%d %H:%i:%s') AS DrawTime,DATE_FORMAT(l.DaylightSavingBegin,'%Y-%m-%d %H:%i:%s') AS DaylightSavingBegin,l.ProfileName AS lottoName,l.ID as lottoId, l.Country,l.State,l.colorimage,l.grayscaleimage,cl.FlagAbv,l.jackpotValue,l.jackpotDate FROM " + config.Table.LOTTOLIST + " AS l LEFT JOIN countrylist cl ON l.CountryId=cl.Id WHERE l.id IN('" + lotto_id + "')";
                    if(search!=''){
                        sql = "SELECT DATE_FORMAT(l.CutTime,'%Y-%m-%d %H:%i:%s') AS CutTime,DATE_FORMAT(l.UpdateTime,'%Y-%m-%d %H:%i:%s') AS UpdateTime,DATE_FORMAT(l.DrawTime,'%Y-%m-%d %H:%i:%s') AS DrawTime,DATE_FORMAT(l.DaylightSavingBegin,'%Y-%m-%d %H:%i:%s') AS DaylightSavingBegin,l.ProfileName AS lottoName,l.ID as lottoId, l.Country,l.State,l.colorimage,l.grayscaleimage,cl.FlagAbv,l.jackpotValue,l.jackpotDate FROM " + config.Table.LOTTOLIST + " AS l LEFT JOIN countrylist cl ON l.CountryId=cl.Id WHERE l.id IN('" + lotto_id + "') AND l.ProfileName like '%"+search+"%' ";
                    }
                    
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
                for(let i=0;i<popular_game.length;i++){
                    popular_game[i]['countryFlag'] = config.baseUrl+'/flags/'+popular_game[i].FlagAbv+'.png';
                    popular_game[i]['colorimage'] = config.baseUrl+'/Lotto/'+popular_game[i].colorimage;
                    popular_game[i]['jackpotValue'] = (popular_game[i].jackpotValue)?popular_game[i].jackpotValue:'';
                    popular_game[i]['jackpotDate'] = (popular_game[i].jackpotDate)?popular_game[i].jackpotDate:'';
                }
                
                await tra_lucky.commit();
                await tra_cngapi.commit();
                return response.send({
                    status: "success",
                    result: popular_game,
                    message: (popular_game.length)? "Data found successfully":"Data not found",
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
    module.getCountry = async function(request, response){
            
            let tra_cngapi = await sequelize_cngapi.transaction();
            console.log("homeScreen=",request.body);
            let search='';
            if(request.body.hasOwnProperty('search') && request.body.search.trim()!=''){
                search = request.body.search;
            }
            try {
                let sql = "SELECT DISTINCT(cl.id) AS id,CONCAT(cl.FlagAbv,'.png') as flag,cl.Country,cl.Continent,cl.FlagAbv FROM " + config.Table.CUNTRYLIST + " cl JOIN " + config.Table.LOTTOLIST + " ll ON cl.id=ll.CountryId";
                if(search!=''){
                    sql = "SELECT DISTINCT(cl.id) AS id,CONCAT(cl.FlagAbv,'.png') as flag,cl.Country,cl.Continent,cl.FlagAbv FROM " + config.Table.CUNTRYLIST + " cl JOIN " + config.Table.LOTTOLIST + " ll ON cl.id=ll.CountryId WHERE cl.Country like '%"+search+"%' ";
                }
                let country_result = await sequelize_cngapi.query(sql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT});
                for(let i=0;i<country_result.length;i++){
                    country_result[i]['countryFlag'] = config.baseUrl+'/flags/'+country_result[i].flag;
                }
               
                await tra_cngapi.commit();
                return response.send({
                    status: "success",
                    result: country_result,
                    message: (country_result.length)? "Data found successfully":"Data not found",
                    status_code: 200
                });

                 
            } catch (error) {
                console.log('error',error);
                
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
    module.nextDraw = async function(request, response){
            
            let tra_cngapi = await sequelize_cngapi.transaction();
            console.log("homeScreen=",request.body);
            let search='';
            if(request.body.hasOwnProperty('search') && request.body.search.trim()!=''){
                search = request.body.search;
            }
            try {
                
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
                let sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.RegUsed,ll.StartNum,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " +config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)<='" + next + "' AND ll.Enable=1  AND le.IsClosed!=1 GROUP BY le.ProfileID ORDER by DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)";
                if(search!=''){
                        sql = "SELECT le.ProfileID AS lottoId,le.ID AS lottoEventId,le.Description,ll.ProfileName,ll.State,ll.Country,ll.RegUsed,ll.StartNum,cl.Id AS CountryId,cl.FlagAbv As countryFlag,ll.colorimage,ll.grayscaleimage,DATE_FORMAT(DATE_ADD(le.DrawTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as DrawTime,ll.TimeZone,cl.Continent, DATE_FORMAT(DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR),'%Y-%m-%d %H:%i:%s') as CutTime FROM " + config.Table.LOTTOLIST + " ll LEFT JOIN " + config.Table.LOTTOEVENT + " le ON  ll.ID=le.ProfileID LEFT JOIN " +config.Table.CUNTRYLIST + " cl ON ll.CountryId=cl.Id WHERE DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)>='" + current + "' AND DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)<='" + next + "' AND ll.Enable=1  AND le.IsClosed!=1 AND (ll.ProfileName like '%"+search+"%' OR ll.Country like '%"+search+"%') GROUP BY le.ProfileID ORDER by DATE_ADD(le.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR)";
                }
                let next_lotto_result = await sequelize_cngapi.query(sql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT})
                
                if (next_lotto_result.length) {
                    for(let i=0;i<next_lotto_result.length;i++){
                        let profileTimezone = next_lotto_result[i]['TimeZone'];
                        let timediff = (+2) - (profileTimezone);
                                    
                        /*var now = new time.Date(next_lotto_result[i]['CutTime']);
                        now.setTimezone('UTC');*/
                        var now = dateFormat(new Date(next_lotto_result[i]['CutTime']), "yyyy-mm-dd HH:MM:ss");
                        now  = new Date(now);
                        
                        next_lotto_result[i]['countryFlag'] = config.baseUrl+'/flags/'+next_lotto_result[i].countryFlag+'.png';
                        next_lotto_result[i]['colorimage'] = config.baseUrl+'/Lotto/'+next_lotto_result[i].colorimage;
                        var CutTime = new Date(now.getTime() + (timediff * 1000 * 60 * 60));
                        CutTime = dateFormat(CutTime, "yyyy-mm-dd HH:MM:ss");
                        next_lotto_result['CutTime'] = CutTime;
                    }
                }
                await tra_cngapi.commit();
                return response.send({
                    status: "success",
                    result: next_lotto_result,
                    message: (next_lotto_result.length)? "Data found successfully":"Data not found",
                    status_code: 200
                });

                 
            } catch (error) {
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
    module.countryWiseLottoList = async function(request, response){
            
            let tra_lucky = await sequelize_luckynumberint.transaction();
            let tra_cngapi = await sequelize_cngapi.transaction();
            console.log("countryWiseLottoList=",request.body);
            let inputs = request.body;
            let search='';
            if(request.body.hasOwnProperty('search') && request.body.search.trim()!=''){
                search = request.body.search;
            }
            try {
                let sql = "select * from " + config.Table.SITEPROFILE + " WHERE Enable=0";
                let stmt = await sequelize_cngapi.query(sql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT})
                
                let finalarr = [];
                let enable = [];

                for (let i = 0; i < stmt.length; i++) {
                    finalarr.push(stmt[i].ProfileID);
                    enable.push(stmt[i].Enable);
                }
                let siteprofileSql = "select *, GROUP_CONCAT(Continent) AS Continent,GROUP_CONCAT(DrawType) AS DrawType,GROUP_CONCAT(DrawingType) AS DrawingType from " + config.Table.SITEPROFILEMANAGEMENT + "";
                // console.log('=======1',siteprofileSql)
                let result_siteprofileSql = await sequelize_cngapi.query(siteprofileSql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT})

                let ContinentListData = result_siteprofileSql[0].Continent;
                let DrawType = result_siteprofileSql[0].DrawType;
                let DrawingType = result_siteprofileSql[0].DrawingType;
                let enableData = enable.toString(",");
                let profileID = finalarr.toString(",");

            if (ContinentListData != '' && DrawingType != '' && DrawType != '') {

                let sqlLottolist = "select CountryId from " + config.Table.LOTTOLIST + " where Enable=1  GROUP BY CountryId";
                 
                let result_sqlLottolist = await sequelize_cngapi.query(sqlLottolist, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT})

                let finalarr = [];
                let final_arrListdata = [];
                for (let i = 0; i < result_sqlLottolist.length; i++) {
                    final_arrListdata.push(result_sqlLottolist[i].CountryId);
                }
                let countryList = final_arrListdata.toString(',');
                let countryid = inputs.countryflag;

                
                let final_arrList = [];
                let country = inputs.countryId ;
                let Lottolist = "select ID,ProfileName,Country,CountryId,State,DrawTime,CutTime,RegUsed,BonusUsed,LastCreateDate,UpdateTime,TimeZone,StartNum,colorimage,grayscaleimage,Continent from " + config.Table.LOTTOLIST + " where Enable=1 AND  CountryId = '" + country + "'";
                let result_lottolist = await sequelize_cngapi.query(Lottolist, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT});
                    
                     
                    let liek_lotto_array =[];
                   // console.log('====================w',Lottolist);
                   if(request.body.hasOwnProperty('userId') && inputs.userId.trim()!=''){
                       sql = "SELECT favourite AS lottoId FROM " + config.Table.USER + " WHERE userId='" + inputs.userId + "' ";
                       let result1 = await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
                        if(result1[0].lottoId){
                         liek_lotto_array = result1[0].lottoId.split(',');
                        }
                    }
                    
                    
                    if(result_lottolist.length)
                    {
                        for (let i = 0; i < result_lottolist.length; i++) 
                        {
                       
                            result_lottolist[i]['fav_flag'] = false;
                            result_lottolist[i]['colorimage'] = config.baseUrl+'/Lotto/'+result_lottolist[i].colorimage;
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
        
                        response.send({
                            status: 'success',
                            result: result_lottolist,
                            message: "countryWiseLottoList",
                            status_code: 200
                        });
                   
                    } else {
                        return response.send({
                            status: 'fail',
                            message: "LottoList not available ",
                            status_code: 422
                        });
                    }
                await tra_lucky.commit();
                await tra_cngapi.commit();

            } else {
                await tra_lucky.commit();
                await tra_cngapi.commit();
                response.send( {
                    status: 'fail',
                    message: "LottoList not available ",
                    status_code: 422
                });
            }

                
                

                 
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
    module.lottoMarket = async function(request, response){
            
            let tra_lucky = await sequelize_luckynumberint.transaction();
            let tra_cngapi = await sequelize_cngapi.transaction();
            console.log("lottoMarket=",request.body);
            let inputs = request.body;
              inputs.siteId ='1';
            
            try {
                
            let fields = "userId";
            if(request.body.hasOwnProperty('userId') && inputs.userId.trim()!=''){
            let userSql = "SELECT " + fields + " FROM " + config.Table.USER + " WHERE userId=" + sequelize_luckynumberint.escape(inputs.userId) + " limit 1";
            //console.log("userSql",userSql);
                let userResult = await sequelize_luckynumberint.query(userSql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
                if (!userResult.length > 0) {
                    await tra_lucky.commit();
                    await tra_cngapi.commit();
                    return response.send({
                        status: "fail",
                        message: "User not found"
                    });
                }
                let userData = userResult[0];
            }
            //saveActivityLog(userData.id,userData.username+" in cashup screen",inputs); //User history log

            //Get lotto profile data
            let profileSql = "SELECT TimeZone,ProfileName,Country from " + config.Table.LOTTOLIST + " where ID=" + sequelize_cngapi.escape(inputs.profileId);
            let profileResult = await sequelize_cngapi.query(profileSql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT});
            if (!profileResult.length > 0) {
                await tra_lucky.commit();
                await tra_cngapi.commit();
                return response.send({
                    status: "fail",
                    message: "Profile not found"
                });
            }
            let lottoListData = profileResult[0];
            let profileTimezone = lottoListData['TimeZone'];
            let timediff = (+2) - (profileTimezone);
            
            let timequery = '';
            timediff = Math.abs(timediff);
            timequery = 'DATE_ADD(t_e.CutTime, INTERVAL ' + timediff + ' HOUR)';

            //Get site data
            let siteSql = "SELECT * FROM " + config.Table.SITEPROFILEMANAGEMENT + " WHERE SiteID=" + inputs.siteId;
            let siteResult = await sequelize_cngapi.query(siteSql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT});
            //console.log("siteResult",siteResult);
            if (!siteResult.length > 0) {
                return response.send({
                    status: "fail",
                    message: "Site not found"
                });
            }
            let continentListData = siteResult[0]['Continent'];
            let drawType = siteResult[0]['DrawType'];
            let drawingType = siteResult[0]['DrawingType'];

            if (continentListData != '' && drawingType != '' && drawType != '') {
                let today = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss",true)
                today = new Date(today);
                today.setHours(today.getHours() + 2);
                today = dateFormat(today, "yyyy-mm-dd HH:MM:ss"); 
                
                
                let eventFields = 't_e.ID,t_e.ProfileID,t_e.Description,DATE_FORMAT(t_e.DrawTime,"%Y-%m-%d %H:%i:%s") AS DrawTime,DATE_FORMAT(t_e.CutTime,"%Y-%m-%d %H:%i:%s") AS CutTime,t_e.UpdateTime,t_e.IsClosed,t_e.Result';
                let condition = ' AND t_e.ProfileID=' + sequelize_cngapi.escape(inputs.profileId);
                //drawType replace with comma separeted single quote
                drawType = '\'' + drawType.split(',').join('\',\'') + '\'';
                drawingType = '\'' + drawingType.split(',').join('\',\'') + '\'';
                continentListData = '\'' + continentListData.split(',').join('\',\'') + '\'';

                condition += " AND t_l.DrawType IN (" + drawType + ") AND t_l.DrawingType IN (" + drawingType + ") AND t_l.Continent IN (" + continentListData + ")";
                condition += " AND (('" + today + "' BETWEEN t_e.DrawTime AND " + timequery + ") OR " +
                    " ('" + today + "' BETWEEN " + timequery + " AND t_e.DrawTime))";
                
                let eventResult = [];
                //Get timezone of sitemanagement table 
                let siteMgtSql = "SELECT TimeZone from " + config.Table.SITEMANAGEMENT + " where ID=" + inputs.siteId;
                let siteMgtResult = await sequelize_cngapi.query(siteMgtSql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT});
                let siteTimeZone = siteMgtResult[0]['TimeZone'];

                let priceData;
                
                if (eventResult.length > 0) {
                    priceData = eventResult[0];
                } else {
                    let condition = " AND t_e.ProfileID=" + sequelize_cngapi.escape(inputs.profileId);
                    //condition += " AND t_e.DrawTime >= '" + today + "'";
                    condition += " AND DATE_ADD(t_e.CutTime,INTERVAL (-1 *TimeZone)+2 HOUR) >= '" + today + "'";
                    condition += " AND t_l.DrawType IN (" + drawType + ") AND t_l.DrawingType IN (" + drawingType + ") AND t_l.Continent IN (" + continentListData + ")";
                    orderby = " ORDER BY t_e.DrawTime";
                    Limit = " Limit 1";
                    eventSql = 'SELECT ' + eventFields + ',t_l.RegUsed, t_l.BonusUsed,t_l.StartNum,t_l.DrawDays,t_l.BonusFromReg,t_l.BonusDrawn, t_l.Price1 as Prices,t_l.RegColours,t_l.jackpotValue,t_l.jackpotDate from ' + config.Table.LOTTOEVENT + ' t_e left join ' + config.Table.LOTTOLIST + ' t_l on t_e.ProfileID=t_l.ID where ProfileID not in (select ProfileID from ' + config.Table.SITEPROFILE + ' where SiteID=' + inputs.siteId + ') ' +
                        condition + ' UNION ' +
                        'SELECT ' + eventFields + ',t_l.RegUsed,t_l.BonusUsed, t_l.jackpotValue,t_l.jackpotDate,t_l.StartNum,t_l.DrawDays,t_l.BonusFromReg,t_l.BonusDrawn,case when PriceIndex=1 then t_l.Price1 when PriceIndex=2 then t_l.Price2 when PriceIndex=3 then t_l.Price3 when PriceIndex=4 then t_l.Price4 when PriceIndex=5 then t_l.Price5 else \'None\' end as Prices,t_l.RegColours from ' + config.Table.LOTTOEVENT + ' t_e left join ' + config.Table.LOTTOLIST + ' t_l on t_e.ProfileID=t_l.ID left join siteprofile t_s on t_e.ProfileID=t_s.ProfileID WHERE SiteID=' + inputs.siteId + ' and t_s.Enable=1 and t_e.IsClosed!=1 and t_e.Result=""' +
                        condition;
                        //condition + Limit;
                    eventSql = 'SELECT * FROM ('+eventSql+') as temp ORDER BY temp.DrawTime LIMIT 1';   
                    eventResult = await sequelize_cngapi.query(eventSql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT});
                    
                   
                }

                let marketSql = "SELECT * FROM marketlist";
                let marketlist = await sequelize_cngapi.query(marketSql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT});
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
                            regBallImages.push(config.baseUrl+'/ball/'+ballImage);
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
                        bonusBallImages.push(config.baseUrl+'/ball/'+ballImage);
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
                    let kioskSettingSql = "SELECT * FROM " + config.Table.KIOSK_SETTING + " WHERE siteId=" + inputs.siteId;
                    let kioskSettingResult = await sequelize_luckynumberint.query(kioskSettingSql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
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

                   

                    let finalResponse = {
                        // "RegUsed":eventResult[0].RegUsed,
                        "minStake" : minStake,
                        "maxStake" : maxStake,
                        "maxWin" : maxWin,
                        "regBallImages" : regBallImages,
                        "bonusBallImages" : (priceData.BonusFromReg)?regBallImages:bonusBallImages,
                        "eventId": eventResult[0].ID,
                        "jackpotValue": (eventResult[0].jackpotValue)?eventResult[0].jackpotValue:'',
                        "jackpotDate": (eventResult[0].jackpotDate)?eventResult[0].jackpotDate:'',
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
                        //console.log("finalResponse===",finalResponse)
                    await tra_lucky.commit();
                    await tra_cngapi.commit();
                    return response.send({
                        status: "success",
                        result: finalResponse,
                        message: "Market found successfully"
                    });
                } else {
                    await tra_lucky.commit();
                    await tra_cngapi.commit();
                    return response.send({
                        status: "fail",
                        status_code: 422,
                        message: "Coming Soon"
                    });
                } //End : Get market data logic
            } else {
                await tra_lucky.commit();
                await tra_cngapi.commit();
                return response.send({
                    status: "fail",
                    status_code: 422,
                    message: "Data not found"
                });
            }
                
                

                 
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
    module.confirmBet = async function(request, res){
            let tra_lucky = await sequelize_luckynumberint.transaction();
            let tra_cngapi = await sequelize_cngapi.transaction();
            try{
            console.log("confirmBet=",request.body);
            let inputs = request.body;
              inputs.siteId ='1';
            console.log("request time", new Date());
            console.log('======confirmBet',inputs)
            /*inputs.regSelection =JSON.parse(inputs.regSelection.replace(/\//g, ""));
            inputs.bonusSelection = JSON.parse(inputs.bonusSelection.replace(/\//g, ""));
            inputs.balance = JSON.parse(inputs.balance.replace(/\//g, ""));
            inputs.winValue = JSON.parse(inputs.winValue.replace(/\//g, ""));
            inputs.stake_value = JSON.parse(inputs.stake_value.replace(/\//g, ""));*/
            ////////////////Block Iav Check////////////////////
            let sql_block_iav_check = "SELECT iav FROM " + config.Table.BLOCK_IAV_LIST + " WHERE iav="+sequelize_luckynumberint.escape(inputs.IAV)+"  LIMIT 1";
            let result_block_iav = await sequelize_luckynumberint.query(sql_block_iav_check, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
            if(result_block_iav.length>0){
                await tra_lucky.commit();
                await tra_cngapi.commit();
                return res.send({
                    status: 'fail',
                    message: "Your IAV Number has Blocked..!",
                    status_code: 422
                }).end();
            }
            if (inputs.regSelection.length > 0 || inputs.bonusSelection.length > 0) {
                let Multi_NPV_No = helper.randomNPV();
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
           
            let sql_lotto_result_check = "SELECT IsPost,ID FROM " + config.Table.LOTTOEVENT + " WHERE ID="+sequelize_cngapi.escape(inputs.eventId)+" and IsPost='1' AND `Result`!=''";

            let result_lotto_check = await sequelize_cngapi.query(sql_lotto_result_check, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT});
            if(result_lotto_check.length>0){
                await tra_lucky.commit();
                await tra_cngapi.commit();
                return res.send({
                    status: 'fail',
                    message: "Event result already declared",
                    status_code: 422
                }).end();
            }
            var IAVNumber=inputs.IAV;
            let sql2 = `CALL GetIAVBalance(`+IAVNumber+`)`; 
            let finalbalance= await sequelize_luckynumberint.query(sql2, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
            finalbalance=Object.values(JSON.parse(JSON.stringify(finalbalance[0])));
            finalbalance= finalbalance[0].IAV_Balance;
            finalbalance = Math.round(finalbalance) ;
           if(verifyBetAmount>finalbalance){
            await tra_lucky.commit();
                await tra_cngapi.commit();
                return res.send({
                    status: 'fail',
                    message: "Insufficient IAV balance",
                    status_code: 422
                }).end();
            }
            let siteSql = "SELECT SiteName FROM sitemanagement WHERE ID="+sequelize_cngapi.escape(inputs.siteId)+" LIMIT 1";
                let siteData = await sequelize_cngapi.query(siteSql, { transaction: tra_cngapi ,type: sequelize_cngapi.QueryTypes.SELECT});

                console.log("response time", new Date())

                console.log("response",{
                    status: 'success',
                    message: "Bet confirm successfully",
                    status_code: 200
                });
                
                let sql = "SELECT * FROM "+config.Table.GENERAL_SETTING+" WHERE status=true AND siteId="+sequelize_luckynumberint.escape(inputs.siteId);
                console.log("GetTimeZoneData sql",sql);
                let sitetimezone= await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
                if(sitetimezone.length){
                    var timezone=sitetimezone[0].timezone ;
                }else{
                    var timezone='+2';
                }
                
                let d2 = new Date(new Date().getTime() + (timezone*1000*60*60));
                let d = new Date(d2).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                let today =  dateFormat(d, "yyyy-mm-dd HH:MM:ss");
                console.log("today",today);
                
                
                let withDrawAmount =  "SELECT sum(last_running_iav) AS balance FROM  "+ config.Table.IAV_RUNNING +" WHERE IAV_number='"+inputs.IAV+"' AND refundDate IS NOT NULL order by id desc";
                 withDrawAmount = await sequelize_luckynumberint.query(withDrawAmount, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});

                 let sql_end_point_url = "SELECT end_point_url FROM " + config.Table.GENERAL_SETTING + " WHERE siteId="+sequelize_luckynumberint.escape(inputs.siteId)+"  LIMIT 1";
           
                let result_end_point_url =await sequelize_luckynumberint.query(sql_end_point_url, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});

                let userInfo = "SELECT mobile,countryCode FROM " + config.Table.USER + " WHERE userId="+sequelize_luckynumberint.escape(inputs.userId)+"  LIMIT 1";
           
                userInfo = await sequelize_luckynumberint.query(userInfo, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});

                let kiosk_setting = "SELECT NPV_FootNote FROM " + config.Table.KIOSK_SETTING + " WHERE siteId="+sequelize_luckynumberint.escape(inputs.siteId)+"  LIMIT 1";
           
                kiosk_setting = await sequelize_luckynumberint.query(kiosk_setting, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
                let attachments = [];
                let attachments2 = [];
                let betHistory = [];
                let iavBalance = inputs.iavBalance;
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
                    
                    let sql = "INSERT INTO " + config.Table.PLAYED_EVENT_DETAILS + " (IAV,eventId,lottoName,NPV,eventDrawTime,eventDay,regSelection,bonusSelection,marketId,winValue,stake_value,TotalNoSelection,status,siteid,country,Multi_NPV_No,userId,lottoId,createdate,mobile_betType) VALUES(" + sequelize_luckynumberint.escape(inputs.IAV) + "," + sequelize_luckynumberint.escape(inputs.eventId) + "," + sequelize_luckynumberint.escape(inputs.lottoName) + "," + sequelize_luckynumberint.escape(npv) + "," + sequelize_luckynumberint.escape(inputs.eventDrawTime) + "," + sequelize_luckynumberint.escape(inputs.eventDay) + "," + sequelize_luckynumberint.escape(inputs.regSelection[i]) + "," + sequelize_luckynumberint.escape(inputs.bonusSelection[i]) + "," + sequelize_luckynumberint.escape(inputs.marketId[i]) + "," + sequelize_luckynumberint.escape(inputs.winValue[i]) + "," + sequelize_luckynumberint.escape(inputs.stake_value[i]) + "," + sequelize_luckynumberint.escape(inputs.marketName[i]) + ",'pending'," + sequelize_luckynumberint.escape(inputs.siteId) + "," + sequelize_luckynumberint.escape(inputs.country) + "," + sequelize_luckynumberint.escape(Multi_NPV_No) + "," + sequelize_luckynumberint.escape(inputs.userId) + "," + sequelize_luckynumberint.escape(inputs.lottoId) + ",'" + today + "'," + sequelize_luckynumberint.escape(inputs.betType[i]) + ")";
                    //console.log('===',sql)
                    let result =  await sequelize_luckynumberint.query(sql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.INSERT});
                    
                    
                    let sql_balance = `CALL GetIAVBalance(`+inputs.IAV+`)`; 
                    let finalbalance= await sequelize_luckynumberint.query(sql_balance, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
                    console.log("finalbalance===",finalbalance)
                    finalbalance=Object.values(JSON.parse(JSON.stringify(finalbalance[0])));
                    finalbalance= finalbalance[0].IAV_Balance;
                    console.log("finalbalance=1==",finalbalance)
                    let iav_balance = Math.round(finalbalance) ;
                    console.log("finalbalance=2==",finalbalance)
                    if(parseFloat(iav_balance)>0 && parseFloat(withDrawAmount[0].balance)>0){
                        iav_balance = parseFloat(iav_balance) - parseFloat(withDrawAmount[0].balance) ;
                    }
                    console.log("finalbalance==3=",iav_balance)
                    if (result) {
                        let sql_iav_running = "INSERT INTO iav_running (IAV_number,last_running_iav,description,siteId,userId,timestamp) VALUES(" + sequelize_luckynumberint.escape(inputs.IAV) + "," + sequelize_luckynumberint.escape(iav_balance) + "," + sequelize_luckynumberint.escape(result.insertId) + "," + sequelize_luckynumberint.escape(inputs.siteId) + "," + sequelize_luckynumberint.escape(inputs.userId) + "," + sequelize_luckynumberint.escape(today) + ")";
                        await sequelize_luckynumberint.query(sql_iav_running, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.INSERT});
                    }

                    
                    
                    if (i > 0) {
                        iavBalance = iavBalance - inputs.stake_value[i];
                    }
                    console.log("iavBalance==",i,'==',iavBalance)
                     sql2 = "INSERT INTO " + config.Table.MOBILE_USER_BET_HISTORY + " (regSelection,bonusSelection,sitename,IAV,eventId,lottoName,NPV,eventDrawTime,eventDay,marketId,winValue,stake_value,marketName,status,siteid,country,userId,lottoId,credit,mobile_betType,created_at) VALUES("+sequelize_luckynumberint.escape(inputs.regSelection[i])+","+sequelize_luckynumberint.escape(inputs.bonusSelection[i])+","+sequelize_luckynumberint.escape(siteData[0].SiteName)+","+ sequelize_luckynumberint.escape(inputs.IAV) + "," + sequelize_luckynumberint.escape(inputs.eventId) + "," + sequelize_luckynumberint.escape(inputs.lottoName) + "," + sequelize_luckynumberint.escape(npv) + "," + sequelize_luckynumberint.escape(inputs.eventDrawTime) + "," + sequelize_luckynumberint.escape(inputs.eventDay) + "," + sequelize_luckynumberint.escape(inputs.marketId[i]) + "," + sequelize_luckynumberint.escape(inputs.winValue[i]) + "," + sequelize_luckynumberint.escape(inputs.stake_value[i]) + "," + sequelize_luckynumberint.escape(inputs.marketName[i]) + ",'pending'," + sequelize_luckynumberint.escape(inputs.siteId) + "," + sequelize_luckynumberint.escape(inputs.country) + "," + sequelize_luckynumberint.escape(inputs.userId) + "," + sequelize_luckynumberint.escape(inputs.lottoId) + "," + sequelize_luckynumberint.escape(iavBalance) + "," + sequelize_luckynumberint.escape(inputs.betType[i]) + "," + sequelize_luckynumberint.escape(today) + ")";
                    let result2 =  await sequelize_luckynumberint.query(sql2, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.INSERT});
                    
                    betHistory.push({"regSelection":inputs.regSelection[i],"bonusSelection":inputs.bonusSelection[i],"market":inputs.marketName[i],"stake":inputs.stake_value[i],"winValue":inputs.winValue[i],"referanceNumber":npv});
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
                    json_data.Market =inputs.marketName[i];
                    json_data.Selection =Selection;
                    json_data.WinStake =inputs.winValue[i]+'/'+inputs.stake_value[i];
                    json_data.AdditionalInfo =kiosk_setting[0].NPV_FootNote;

                    // specify the path to the file, and create a buffer with characters we want to write
                    let path = config.rootpath_npv +npv+'.cng';
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
            let walletSql = `CALL GetIAVBalance(`+IAVNumber+`)`; 
            let walletBalance= await sequelize_luckynumberint.query(walletSql, { transaction: tra_lucky ,type: sequelize_luckynumberint.QueryTypes.SELECT});
            walletBalance=Object.values(JSON.parse(JSON.stringify(walletBalance[0])));
            walletBalance= walletBalance[0].IAV_Balance;
            walletBalance = Math.round(walletBalance) ;
            await tra_lucky.commit();
            await tra_cngapi.commit();
            const sum = inputs.stake_value.reduce((partialSum, a) => partialSum + Number(a), 0);
            res.send({
                    status: 'success',
                    result:betHistory,
                    message: "Bet confirm successfully",
                    total:sum,
                    walletBalance:walletBalance,
                    status_code: 200
                }).end();
            if(result_end_point_url.length){
                
                    if(result_end_point_url[0].end_point_url){
                    let end_point_url = JSON.parse(result_end_point_url[0].end_point_url);
                    var formData = {};
                    formData.my_field ='filename';
                        for(let f=0;f<attachments.length;f++){
                            if (fs.existsSync(config.rootpath_npv+ attachments[f]+'.cng')) {
                                formData['filename_'+f] = fs.createReadStream(config.rootpath_npv+ attachments[f]+'.cng');
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
                        if (fs.existsSync(config.rootpath_npv+ attachments[f]+'.cng')) {
                            fs.unlink(config.rootpath_npv+ attachments[f]+'.cng', function(err) {
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
            if(tra_lucky) {
               await tra_lucky.rollback();
            }
            if(tra_cngapi) {
               await tra_cngapi.rollback();
            }
            return res.send({
                status: 'fail',
                message: e,
                status_code: 422
            }).end();
        }
    };
	return module;
}
