'use strict';

var express = require('express'), router = express.Router();
var Sys = require('../../Boot/Sys');

//router.get('/test', Sys.App.Controllers.LoginAuth.test);
//////////////SignUp////////////////////////////
router.post('/signUp', Sys.App.Middlewares.Validator.signupValidation, Sys.App.Controllers.LoginAuth.postSignup);
router.post('/otpVerify', Sys.App.Middlewares.Validator.otpVerify, Sys.App.Controllers.LoginAuth.otpVerify);
router.post('/otpResend', Sys.App.Middlewares.Validator.otpResend, Sys.App.Controllers.LoginAuth.otpResend);
router.post('/setPin', Sys.App.Middlewares.Validator.setPin, Sys.App.Controllers.LoginAuth.setPin);
router.post('/pinVerify', Sys.App.Middlewares.Validator.pinVerify, Sys.App.Controllers.LoginAuth.pinVerify);
router.post('/questionList', Sys.App.Middlewares.Validator.questionList, Sys.App.Controllers.LoginAuth.questionList);
router.post('/setSecurityQuestion', Sys.App.Middlewares.Validator.setSecurityQuestion, Sys.App.Controllers.LoginAuth.setSecurityQuestion);
router.post('/securityQuestionVerify', Sys.App.Middlewares.Validator.securityQuestionVerify, Sys.App.Controllers.LoginAuth.securityQuestionVerify);

//////////////Login////////////////////////////

router.post('/login', Sys.App.Middlewares.Validator.login, Sys.App.Controllers.LoginAuth.login);
router.post('/loginStatusUpadte', Sys.App.Middlewares.Validator.loginStatusUpadte, Sys.App.Controllers.LoginAuth.loginStatusUpadte);
router.post('/loginCheck', Sys.App.Middlewares.Validator.loginCheck,Sys.App.Middlewares.Tokenauth.LoginAuthCheck);
router.post('/logout',Sys.App.Middlewares.Validator.logout, Sys.App.Controllers.Application.logout);

///////////APP//////////////////////
router.post('/addIAV', Sys.App.Middlewares.Tokenauth.Authenticate, Sys.App.Middlewares.Validator.addIAV, Sys.App.Controllers.Application.addIAV);
router.post('/addFavouriteLotto', Sys.App.Middlewares.Tokenauth.Authenticate, Sys.App.Middlewares.Validator.addFavouriteLotto, Sys.App.Controllers.Application.addFavouriteLotto);
router.post('/loadIAV', Sys.App.Middlewares.Tokenauth.Authenticate, Sys.App.Middlewares.Validator.loadIAV, Sys.App.Controllers.Application.loadIAV);



///////////////Profile//////////////////
router.post('/getProfile', Sys.App.Middlewares.Tokenauth.Authenticate, Sys.App.Middlewares.Validator.getProfile, Sys.App.Controllers.Application.getProfile);
router.post('/updateProfile', Sys.App.Middlewares.Tokenauth.Authenticate, Sys.App.Middlewares.Validator.updateProfile, Sys.App.Controllers.Application.updateProfile);
router.post('/confirmBet', Sys.App.Middlewares.Tokenauth.Authenticate, Sys.App.Middlewares.Validator.confirmBet, Sys.App.Controllers.Application.confirmBet);
router.post('/withDrawPinVerify', Sys.App.Middlewares.Tokenauth.Authenticate, Sys.App.Middlewares.Validator.withDrawPinVerify, Sys.App.Controllers.Application.withDrawPinVerify);
router.post('/updateSetting', Sys.App.Middlewares.Tokenauth.Authenticate, Sys.App.Middlewares.Validator.updateSetting, Sys.App.Controllers.Application.updateSetting);
router.post('/updatePin', Sys.App.Middlewares.Tokenauth.Authenticate, Sys.App.Middlewares.Validator.updatePin, Sys.App.Controllers.Application.updatePin);
 router.post('/forgotpin', Sys.App.Controllers.LoginAuth.forgotpin);
router.post('/isApkVersionChanged',Sys.App.Controllers.LoginAuth.isApkVersionChanged);

router.get('/privacypolicy', Sys.App.Controllers.Application.privacypolicy);
router.get('/uploadapk', Sys.App.Controllers.Application.uploadapk);
router.post('/uploadapk', Sys.App.Controllers.Application.saveapk);

/////////////////////Kiosk new mode changes/////////////////
router.post('/checkAccessKey', Sys.App.Middlewares.Validator.checkAccessKey, Sys.App.Controllers.LoginAuth.checkAccessKey);
router.post('/guestTimerSave', Sys.App.Middlewares.Validator.guestTimerSave, Sys.App.Controllers.LoginAuth.guestTimerSave);
router.post('/guestLogin', Sys.App.Middlewares.Validator.guestLogin, Sys.App.Controllers.LoginAuth.guestLogin);
router.post('/guestIavBalance', Sys.App.Middlewares.Validator.guestIavBalance, Sys.App.Controllers.LoginAuth.guestIavBalance);
//router.post('/betAccessUrl',  Sys.App.Controllers.LoginAuth.betAccessUrl);
router.post('/getUserMode',  Sys.App.Middlewares.Validator.getUserMode, Sys.App.Controllers.LoginAuth.getUserMode)

module.exports = router