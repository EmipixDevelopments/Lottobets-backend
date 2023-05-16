const { check, validationResult } = require('express-validator/check');
module.exports = function (app, model, controller) {
    
    var middleware = require('../app/middleware/index')(model);
    var validation = require('../app/validator/index')(model);
    
    /*Start: homescreen routing*/
    app.post('/homeScreen',  controller.application.homeScreen);
    app.post('/getCountry',  controller.application.getCountry);
    app.post('/country',  controller.application.country);
    app.post('/nextDraw',  controller.application.nextDraw);
    app.post('/popularGames',  controller.application.popularGames);
    app.post('/favourite',  controller.application.favourite);
    app.post('/betHistory',  controller.application.betHistory);
    app.post('/countryWiseLottoList',validation.admin.countryWiseLottoList, controller.application.countryWiseLottoList);
    app.post('/addtoFavourite',  validation.admin.addtoFavourite,controller.user.addtoFavourite);
    app.post('/lottoMarket',  validation.admin.lottoMarket,controller.application.lottoMarket);
    app.post('/confirmBet',  controller.application.confirmBet);

    app.post('/login',  validation.admin.login,controller.user.login);
    app.post('/signup',  validation.admin.signup,controller.user.signup);
    app.post('/forgot',  validation.admin.forgot,controller.user.forgot);
    

   } 