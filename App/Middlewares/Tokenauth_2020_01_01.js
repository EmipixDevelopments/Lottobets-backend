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
                    let LoginStatus = await Sys.SqlPool.query(checkLoginStatus);
                    if(LoginStatus.length)
                    {
                        if(req.body.token!=LoginStatus[0].token){
                            res.send({status : 'fail' , status_code:404, message : "JWT token not valid"});
                        }
                        else if(LoginStatus[0].deviceId_blocked=='1') {

                            res.send({status : 'fail' , status_code:404, message : "Your Device is Blocked"});

                        }else if(LoginStatus[0].mobile_number_blocked=='1'){
                             res.send({status : 'fail' , status_code:404, message : "Your Mobile Number is Blocked"});
                        }
                        

                    }
                    next();
                }

            });

            //next();
        }else{
            res.send({status : 'fail', status_code:404, message : "Please enter token"});
        }
    },
    LoginAuthCheck: function(req, res, next){

        if(req.body.token){
            
            jwt.verify(req.body.token, jwtcofig.secret, async function(err, decoded) {
                if (err)
                {
                    res.send({status : 'fail' , status_code:404, message : "JWT token not valid"});
                            
                }
                else
                {
                    let checkLoginStatus="SELECT token,mobile_number_blocked,deviceId_blocked,mobile,countryCode FROM "+Sys.Config.Table.USER+" WHERE userId='"+req.body.userId+"' limit 1";
                    let LoginStatus = await Sys.SqlPool.query(checkLoginStatus);
                    if(LoginStatus.length)
                    {
                        //console.log("LoginStatus[0]=",LoginStatus[0])
                        if(req.body.token!=LoginStatus[0].token){
                            res.send({status : 'fail' , status_code:404, message : "JWT token not valid"});
                        }
                        else if(LoginStatus[0].deviceId_blocked=='1') {

                            res.send({status : 'fail' , status_code:404, message : "Your Device is Blocked"});

                        }else if(LoginStatus[0].mobile_number_blocked=='1'){
                             res.send({status : 'fail' , status_code:404, message : "Your Mobile Number is Blocked"});
                        }
                        else
                        {
                            res.send({status : 'success' , status_code:200, message : "JWT token valid"});
                        }
                        

                    }else{
                        res.send({status : 'fail' , status_code:404, message : "JWT token not valid"});
                    }
                    
                }

            });

            //next();
        }else{
            res.send({status : 'fail', status_code:404, message : "Please enter token"});
        }
    }

    
}