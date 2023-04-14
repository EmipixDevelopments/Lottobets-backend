var validate = require('express-validation');
var Joi = require('joi');
module.exports = {
    
    countryWiseLottoList : function(data,next){
        const rulesSchema = Joi.object({
            token : Joi.required(),
            countryflag : Joi.string().required()
            
            
        });
        const ret = Joi.validate(data, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message});
            //console.log("error",ret.error.toString());
        } else {
            res.send({status : 'success', status_code:200, message :"Data validate"});
        }

    }

    
    
    
}
