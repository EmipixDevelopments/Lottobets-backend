var validate = require('express-validation');
var Joi = require('joi');
module.exports = {
    
    signupValidation : function(req,res,next){
        const rulesSchema = Joi.object({
            userName : Joi.required(),
            fullName : Joi.string().required(),
            countryCode : Joi.string().required(),
            mobile : Joi.string().required(),
			mobile_device_id : Joi.string().required()
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    otpVerify : function(req,res,next){
         const rulesSchema = Joi.object({
            deviceId : Joi.string().required(),
            userId : Joi.string().required(),
            mobile_ip : Joi.string().required()
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    otpResend : function(req,res,next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            countryCode : Joi.string().required(),
            mobile : Joi.string().required()
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },


    setPin : function(req,res,next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            pin : Joi.string().required(),
            confirmPin : Joi.string().required(),
            mobile : Joi.string().required(),
            countryCode : Joi.string().required()
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    pinVerify : function(req,res,next){
        const rulesSchema = Joi.object({
            //token : Joi.string().required(),
            userId : Joi.string().required(),
           // IAV_number : Joi.string().required()
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    questionList : function(req,res,next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            pin : Joi.string().required(),
            confirmPin : Joi.string().required(),
            mobile : Joi.string().required(),
            countryCode : Joi.string().required()
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    setSecurityQuestion : function(req,res,next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            pin : Joi.string().required(),
            confirmPin : Joi.string().required(),
            mobile : Joi.string().required(),
            countryCode : Joi.string().required(),
            question1 : Joi.string().required(),
            question2 : Joi.string().required(),
            answers1 : Joi.string().required(),
            answers2 : Joi.string().required()
            
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    securityQuestionVerify : function(req,res,next){
         const rulesSchema = Joi.object({
            //token : Joi.string().required(),
            userId : Joi.string().required(),
            //IAV_number : Joi.string().required()
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    login : function(req,res,next){
		
        const rulesSchema = Joi.object({
            mobile : Joi.string().required(),
            countryCode : Joi.string().required(),
			mobile_device_id : Joi.string().required()
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    loginStatusUpadte : function(req,res,next){
        const rulesSchema = Joi.object({
            mobile : Joi.string().required(),
            countryCode : Joi.string().required(),
            deviceId : Joi.string().required()
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail',message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    addIAV : function(req,res,next){
        const rulesSchema = Joi.object({
            token : Joi.string().required(),
            userId : Joi.string().required(),
            IAV_number : Joi.string().required()
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    loadIAV : function(req,res,next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            token : Joi.string().required()
           
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    loginCheck : function(req,res,next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            token : Joi.string().required()
           
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    logout : function(req,res,next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            //token : Joi.string().required()
           
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    
    getProfile : function(req,res,next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            token : Joi.string().required()
           
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    updateProfile : function(req,res,next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            userName : Joi.string().required(),
            photo : Joi,
            token : Joi.string().required()
           
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    addFavouriteLotto : function(req,res,next){
        const rulesSchema = Joi.object({
            token : Joi.string().required(),
            userId : Joi.string().required(),
            flag: Joi.string().required(),
            lottoId : Joi.string().required(),
            countryFlag : Joi.string().required(),
            lottoName : Joi.string().required(),
            countryId : Joi.string().required()
           
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    confirmBet : function(req,res,next){
        const rulesSchema = Joi.object({
            token : Joi.string().required(),
            userId : Joi.string().required(),
            siteId: Joi.string().required(),
            lottoId : Joi.string().required(),
            lottoName : Joi.string().required(),
            marketId : Joi.string().required(),
            marketName : Joi.string().required(), /////TotalNoSelection///
            winValue : Joi.string().required(),
            stake_value : Joi.string().required(),
            country : Joi.string().required(),
            eventDay : Joi.string().required(),
            regSelection : Joi,
            bonusSelection : Joi,
            balance : Joi,
            eventDrawTime : Joi.string().required(),
            IAV : Joi.string().required(),
            eventId : Joi.string().required(),
            iavBalance : Joi.string().required(),
            betType : Joi.string().required(),
            
           
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    
    withDrawPinVerify : function(req,res,next){
        const rulesSchema = Joi.object({
            token : Joi.string().required(),
            userId : Joi.string().required(),
            pin : Joi.string().required(),
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    
    updateSetting : function(req,res,next){
        const rulesSchema = Joi.object({
            token : Joi.string().required(),
            userId : Joi.string().required(),
            withDraw : Joi.string().required(),
            lottoResult : Joi.string().required(),
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    updatePin : function(req,res,next){
        const rulesSchema = Joi.object({
            token : Joi.string().required(),
            userId : Joi.string().required(),
            newPin : Joi.string().required(),
            confirmPin : Joi.string().required(),
            oldPin : Joi.string().required(),
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    checkAccessKey : function(req,res,next){
        const rulesSchema = Joi.object({
            mode_access_key : Joi.string().required(),
           
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    guestTimerSave : function(req,res,next){
        const rulesSchema = Joi.object({
            deviceId: Joi.string().required(),
            time: Joi.string().required(),
            mode: Joi.string().required(),
           
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

           res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    guestLogin : function(req,res,next){
        const rulesSchema = Joi.object({
            iav : Joi.string().required(),
            countryCode : Joi.string().required(),
            mobile : Joi.string().required(),
            mobile_device_id : Joi.string().required(),
            mobile_ip : Joi.string().required(),
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    guestIavBalance : function(req,res,next){
        const rulesSchema = Joi.object({
            iav : Joi.string().required(),
            
            
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },

    getUserMode : function(req,res,next){
        const rulesSchema = Joi.object({
            deviceId : Joi.string().required(),
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {

            res.send({status : 'fail', status_code:422, message : ret.error.details[0].message}).end();
            //console.log("error",ret.error.toString());
        } else {
            next();
        }

    },
    
    
}
