var dateformat = require('dateformat');
var currentDate = new Date();
//var Op = Sequelize.Op;
var md5 = require('md5');

module.exports = function(model,config){	
	var module = {};


	

	module.getUsers = async function(request, response){
			
			//const t = await Sequelize.transaction();
			//let transaction;
			//let t = await sequelize1.transaction();
		    /*try {
		        let d = await sequelize1.query('SELECT * FROM admins;', { transaction: t ,type: sequelize1.QueryTypes.SELECT})
				await t.commit(); 
				return response.send(d)
		    } catch (error) {
		        console.log('error',error);
		        if(t) {
		           await t.rollback();
		        }
		    }*/
		    let iav_running_check = "SELECT * FROM question_list";
            let result_running_check = await getResult(iav_running_check);
            console.log("result_running_check==",result_running_check)

	};
	function getResult(sql){
      return new Promise(function(resolve,reject){
         dbconnection.getConnection( function(err, conn) {
         	console.log("sql==",sql)
         	console.log("conn==",conn)
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

	return module;
}
