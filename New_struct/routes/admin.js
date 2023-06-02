const { check, validationResult } = require('express-validator/check');
module.exports = function (app, model, controller) {
    
    var middleware = require('../app/middleware/index')(model);
    var validation = require('../app/validator/index')(model);
    
    /*Start: smsbomb routing*/
    app.get('/nextDraw',  controller.application.nextDraw);
    app.get('/listAllLotteries',  controller.application.listAllLotteries);
    app.post('/watchAdminLogin',  validation.admin.watchAdminLogin,controller.user.watchAdminLogin);

   } 