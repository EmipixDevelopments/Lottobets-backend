const { check, validationResult } = require('express-validator/check');
module.exports = function (app, model, controller) {
    
    var middleware = require('../app/middleware/index')(model);
    var validation = require('../app/validator/index')(model);
    
    /*Start: smsbomb routing*/
    app.get('/test',  controller.user.getUsers);
    /*app.get('/logout',  controller.login.logout);
    app.get('/mmdcheck',  controller.login.mmdcheck);
    app.get('/dashboard', middleware.admin.login_return, controller.smsbomb.view);
    app.get('/getCampaign', middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.getCampaign);
    app.get('/getBroadcastHistory', middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.getBroadcastHistory);
    app.post('/campaing/save', validation.admin.addCampaign,middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.saveCampaign);
    app.post('/campaing/update/:id', validation.admin.addCampaign,middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.updateCampaign);
    //app.get('/send/campaign/:id', middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.sendCampaign);
    app.get('/send/campaign/:id/:datetime', middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.sendCampaign);
    app.get('/campaing/delete/:id', middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.campaigndelete);
    app.post('/login/check', validation.admin.login, controller.login.signinCheck);

    app.get('/user_list', middleware.admin.login_return,middleware.admin.superadmin_check, controller.user.view);
    app.get('/getUsers', middleware.admin.login_return,middleware.admin.superadmin_check, controller.user.getUsers);
    app.post('/user/save', validation.admin.addUser,middleware.admin.login_return,middleware.admin.superadmin_check, controller.user.save);
    app.post('/user/update/:id', validation.admin.updateUser,middleware.admin.login_return,middleware.admin.superadmin_check, controller.user.update);
    app.get('/user/delete/:id',middleware.admin.login_return,middleware.admin.superadmin_check, controller.user.delete);
   
   
    app.get('/contact', middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.view);
    app.get('/getContact', middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.getContact);
    
    app.post('/contact/save', validation.admin.addContact,middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.save);
    app.post('/contact/update/:id', validation.admin.updateContact,middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.update);
    app.get('/contact/delete/:id',middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.delete);
    
   
     app.get('/contactList/:id', middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.contact_list_view);
     app.get('/allContact/:id', middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.all_contact_view);
     app.get('/allContact', middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.all_contact_view);
     app.get('/getAllContact', middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.getAllContact);
     app.post('/contactList/save/:id', middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.saveContact);
     app.post('/contact/save/:id', middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.saveContactList);
     app.post('/singleContactupdate/:id', middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.singleContactupdate);
     app.get('/deleteContact/:id',middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.deleteContact);
     

     app.post('/contact/fileread', middleware.admin.login_return,middleware.admin.superadmin_check, controller.contact.csvRead);
	 
	 app.post('/textTemplate/save', validation.admin.textTemplate,middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.saveTextTemplate);
     app.post('/saveCampingTemplate/save', middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.saveCampingTemplate);
	 app.post('/getTemplates/all', middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.getCampaignTemplates);
     app.post('/template/delete', middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.templateDelete);
	 app.post('/template/enableDisable', middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.enableDisableTemp);

     
	 app.get('/senders_list', middleware.admin.login_return,middleware.admin.superadmin_check, controller.senders.view);
	 app.get('/getSenders', middleware.admin.login_return,middleware.admin.superadmin_check, controller.senders.getSenders);
	 app.post('/sender/save', validation.admin.addSenders,middleware.admin.login_return,middleware.admin.superadmin_check, controller.senders.save);
	 app.post('/sender/update/:id', validation.admin.addSenders,middleware.admin.login_return,middleware.admin.superadmin_check, controller.senders.update);
     app.get('/sender/delete/:id',middleware.admin.login_return,middleware.admin.superadmin_check, controller.senders.delete);


    app.get('/offer', middleware.admin.login_return,middleware.admin.superadmin_check, controller.offer.view);
    app.get('/getOffers', middleware.admin.login_return,middleware.admin.superadmin_check, controller.offer.getOffers);
    app.post('/offer/save', validation.admin.addCompany,middleware.admin.login_return,middleware.admin.superadmin_check, controller.offer.save);
    app.post('/offer/update/:id', validation.admin.addCompany,middleware.admin.login_return,middleware.admin.superadmin_check, controller.offer.update);
    app.get('/offer/delete/:id',middleware.admin.login_return,middleware.admin.superadmin_check, controller.offer.delete);



    app.get('/template', middleware.admin.login_return,middleware.admin.superadmin_check, controller.template.view);
    app.get('/getTemplateList', middleware.admin.login_return,middleware.admin.superadmin_check, controller.template.getTemplateList);
    
    app.post('/template/save', validation.admin.addTemplate,middleware.admin.login_return,middleware.admin.superadmin_check, controller.template.save);
    app.post('/template/update/:id', validation.admin.updateContact,middleware.admin.login_return,middleware.admin.superadmin_check, controller.template.update);
    app.get('/template/delete/:id',middleware.admin.login_return,middleware.admin.superadmin_check, controller.template.delete);
    
    app.get('/deliveryReport', controller.smsbomb.mmdDeliveryReport);
    app.post('/txtlocalCallback', controller.smsbomb.txtlocalCallback);
    app.post('/deliverhubCallback', controller.smsbomb.deliverhubCallback);
    app.get('/deliverhubCallback', controller.smsbomb.deliverhubCallback);
    //app.get('/hitsCron', controller.smsbomb.hitsCron);


    app.post('/mmdWebhook', controller.webhook.mmdWebhook);
    app.post('/txtlocalWebhook', controller.webhook.txtlocalWebhook);
    app.post('/deliverhubWebhook', controller.webhook.deliverhubWebhook);
	
	app.post('/getContactPercentage', middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.getContactPercentage);
    app.post('/getHits', middleware.admin.login_return,middleware.admin.superadmin_check, controller.smsbomb.getHits);


    app.get('/countries', middleware.admin.login_return,middleware.admin.superadmin_check, controller.setting.countries);
    app.get('/getCountries', middleware.admin.login_return,middleware.admin.superadmin_check, controller.setting.getCountries);
    app.get('/integrations_mmd', middleware.admin.login_return,middleware.admin.superadmin_check, controller.setting.integrations_mmd);
    app.get('/integrations_deliverhub', middleware.admin.login_return,middleware.admin.superadmin_check, controller.setting.integrations_deliverhub);
    app.get('/integrations_textlocal', middleware.admin.login_return,middleware.admin.superadmin_check, controller.setting.integrations_textlocal);
    app.get('/integrations_textbox', middleware.admin.login_return,middleware.admin.superadmin_check, controller.setting.integrations_textbox);
    app.get('/integrations_tiny', middleware.admin.login_return,middleware.admin.superadmin_check, controller.setting.integrations_tiny);
    app.post('/integrations/save', middleware.admin.login_return,middleware.admin.superadmin_check, controller.setting.integrationSave);
    app.get('/getIntegration', controller.setting.getIntegration);


    app.get('/categories', middleware.admin.login_return,middleware.admin.superadmin_check, controller.setting.categories);
    app.get('/getCategories', middleware.admin.login_return,middleware.admin.superadmin_check, controller.setting.getCategories);
    app.post('/categories/save', validation.admin.addCategories,middleware.admin.login_return,middleware.admin.superadmin_check, controller.setting.categoriesSave);
    

    app.post('/getContactList/all', controller.smsbomb.getContactList);*/

   } 