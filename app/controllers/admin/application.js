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
                let country = inputs.id ;
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


            } else {
                response.send( {
                    status: 'fail',
                    message: "LottoList not available ",
                    status_code: 422
                });
            }

                await tra_lucky.commit();
                await tra_cngapi.commit();
                

                 
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
