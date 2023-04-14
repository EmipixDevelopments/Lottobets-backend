var Sys = require('../../Boot/Sys');
var jwt = require('jsonwebtoken');

const flatCache = require('flat-cache'); 
let cache = flatCache.load('dashboardCache');

var jwtcofig = {
  'secret': 'AisJwtAuth'
};
module.exports = {
    Authenticate: function(req, res, next){
        if(req.body.token){
            jwt.verify(req.body.token, jwtcofig.secret, async function(err, decoded) {
                if (err){
                    return res.send({status : 'fail' ,message : "JWT token not valid"});
                }else{
                    next();
                }
            });
        }else{
            return res.send({status : 'fail',result : '',message : "Please enter token"});
        }
    },
}