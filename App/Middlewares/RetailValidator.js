var validate = require('express-validation');
var Joi = require('joi');
module.exports = {
    login : function(req,res,next){
        const rulesSchema = Joi.object({
            username : Joi.string().required(),
            password : Joi.string().required(),
            deviceId : Joi.string().required(),
            isForcefullyLogin : Joi.string().required(),
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });
        if (ret.error) {
            return res.send({status : 'fail',message : ret.error.details[0].message});
        } else {
            next();
        }
    },
    loginWithFloat : function(req,res,next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            openingFloat : Joi.string().required(),
            reFloat : Joi.string().required()
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });
        if (ret.error) {
            return res.send({status : 'fail',message : ret.error.details[0].message});
        } else {
            next();
        }
    },
    confirmLogin : function(req,res,next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            openingFloat : Joi.string().required(),
            reFloat : Joi.string().required(),
            deviceId : Joi.string().required()
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });
        if (ret.error) {
            return res.send({status : 'fail',message : ret.error.details[0].message});
        } else {
            next();
        }
    },
    addUpdateAgentDevice : function(req,res,next){
        const rulesSchema = Joi.object({
            deviceName : Joi.string().required(),
            deviceId : Joi.string().required()
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });
        if (ret.error) {
            return res.send({status : 'fail',message : ret.error.details[0].message});
        } else {
            next();
        }
    },
    addUpdateDisplayDevice : function(req,res,next){
        const rulesSchema = Joi.object({
            deviceName : Joi.string().required(),
            deviceId : Joi.string().required()
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });
        if (ret.error) {
            return res.send({status : 'fail',message : ret.error.details[0].message});
        } else {
            next();
        }
    },
    
    /*getOnlineUser : function(req, res, next){
        const rulesSchema = Joi.object({
            userId : Joi.string().required(),
            token : Joi.string().required()
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });
        if (ret.error) {
            return res.send({status : 'fail',message : ret.error.details[0].message});
        } else {
            next();
        }
    },*/
    /*cashup : function(req, res, next){
        const rulesSchema = Joi.object({
            transferTo : Joi.string().required(),
            transferFrom : Joi.string().required(),
            transferAmount : Joi.string().required(),
            closingFloat : Joi.string().required(),
            token : Joi.string().required(),
            transferToUserType : Joi.string().allow()
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });
        if (ret.error) {
            return res.send({status : 'fail',message : ret.error.details[0].message});
        } else {
            next();
        }
    },*/
    /*confirmCashup : function(req, res, next){
        const rulesSchema = Joi.object({
            transferTo : Joi.string().required(),
            transferFrom : Joi.string().required(),
            transferAmount : Joi.string().required(),
            closingFloat : Joi.string().required(),
            transferToUserType : Joi.string().required(),
            token : Joi.string().required()
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });
        if (ret.error) {
            return res.send({status : 'fail',message : ret.error.details[0].message});
        } else {
            next();
        }
    },*/
    /*logout : function(req,res,next){
        const rulesSchema = Joi.object({
            transferTo : Joi.string().required(),
            transferFrom : Joi.string().required(),
            transferAmount : Joi.string().required(),
            token : Joi.string().required()
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });
        if(ret.error){
            return res.send({status : 'fail',message : ret.error.details[0].message});
        }else{
            next();
        }
    },*/
}
