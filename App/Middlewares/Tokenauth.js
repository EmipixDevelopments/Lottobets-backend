var Sys = require('../../Boot/Sys');
var jwt = require('jsonwebtoken');

const flatCache = require('flat-cache'); 
let cache = flatCache.load('dashboardCache');

var jwtcofig = {
  'secret': 'AisJwtAuth'
};
module.exports = {

    

    Authenticate: function(req, res, next){
        //console.log('=====',req.body)
        if(req.body.token){
            
            jwt.verify(req.body.token, jwtcofig.secret, async function(err, decoded) {
                if (err)
                {
                    res.send({status : 'fail' , status_code:404, message : "JWT token not valid"});
                            
                }
                else
                {
                    let checkLoginStatus="SELECT * FROM "+Sys.Config.Table.USER+" WHERE userId='"+req.body.userId+"' limit 1";
                    let LoginStatus = await getResult(checkLoginStatus);
					
					let checkMobileDevice="SELECT * FROM "+Sys.Config.Table.MOBILE_DEVICE_ID+" WHERE mobile_device_id='"+LoginStatus[0].mobile_device_id+"'  limit 1";
                     checkMobileDevice = await getResult(checkMobileDevice);
                    if(checkMobileDevice.length)
                    {   
                        if(checkMobileDevice[0].status=='1'){
                             res.send({
                            status: 'fail',
                            message: "Your Device is Blocked",
                            status_code: 404
                            }).end();
                        }
                        
                    }else{
                        let sqlMobileDevice="INSERT INTO "+Sys.Config.Table.MOBILE_DEVICE_ID+" (mobile_device_id,status,userId) VALUES('"+LoginStatus[0].mobile_device_id+"','0','"+LoginStatus[0].userId+"')";
                         await getResult(sqlMobileDevice);
                    }
					
                    if(LoginStatus.length)
                    {
                        if(req.body.token!=LoginStatus[0].token){
                            res.send({status : 'fail' , status_code:404, message : "JWT token not valid"}).end();
                        }
                        else if(LoginStatus[0].mobile_number_blocked=='1'){
                             res.send({status : 'fail' , status_code:404, message : "Your Mobile Number is Blocked"}).end();
                        }
                        

                    }
                    next();
                }

            });

            //next();
        }else{
            res.send({status : 'fail', status_code:404, message : "Please enter token"}).end();
        }
    },
    LoginAuthCheck: function(req, res, next){

        if(req.body.token){
            
            jwt.verify(req.body.token, jwtcofig.secret, async function(err, decoded) {
                if (err)
                {
                    res.send({status : 'fail' , status_code:404, message : "JWT token not valid"}).end();
                            
                }
                else
                {
                    let checkLoginStatus="SELECT token,mobile_number_blocked,deviceId_blocked,mobile,countryCode,userId,mobile_device_id FROM "+Sys.Config.Table.USER+" WHERE userId='"+req.body.userId+"' limit 1";
                    let LoginStatus = await getResult(checkLoginStatus);
					
					let checkMobileDevice="SELECT * FROM "+Sys.Config.Table.MOBILE_DEVICE_ID+" WHERE mobile_device_id='"+LoginStatus[0].mobile_device_id+"' limit 1";
                    checkMobileDevice = await getResult(checkMobileDevice);
                    if(checkMobileDevice.length)
                    {   
                        if(checkMobileDevice[0].status=='1'){
                             res.send({
                            status: 'fail',
                            message: "Your Device is Blocked",
                            status_code: 404
                            }).end();
                        }
                        
                    }else{
                        let sqlMobileDevice="INSERT INTO "+Sys.Config.Table.MOBILE_DEVICE_ID+" (mobile_device_id,status,userId) VALUES('"+LoginStatus[0].mobile_device_id+"','0','"+LoginStatus[0].userId+"')";
                        await getResult(sqlMobileDevice);
                    }
					
                    if(LoginStatus.length)
                    {
                        //console.log("LoginStatus[0]=",LoginStatus[0])
                        if(req.body.token!=LoginStatus[0].token){
                            res.send({status : 'fail' , status_code:404, message : "JWT token not valid"}).end();
                        }
                        else if(LoginStatus[0].mobile_number_blocked=='1'){
                             res.send({status : 'fail' , status_code:404, message : "Your Mobile Number is Blocked"}).end();
                        }
                        else
                        {
                            res.send({status : 'success' , status_code:200, message : "JWT token valid"}).end();
                        }
                        

                    }else{
                        res.send({status : 'fail' , status_code:404, message : "JWT token not valid"}).end();
                    }
                    
                }

            });

            //next();
        }else{
            res.send({status : 'fail', status_code:404, message : "Please enter token"}).end();
        }
    }

    
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