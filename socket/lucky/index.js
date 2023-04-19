var flag = true;
const { query } = require('express');
var lowerCase = require('lower-case');
var moment = require('moment');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var fs = require('fs');
var Buffer = require('buffer/').Buffer
var dateformat = require('dateformat');
var currentDate = new Date();
const { log } = require('console');

//var fcm_push = require('fcm-notification');
//var FCM_Push = new fcm_push('/var/www/html/privatekey.json');
module.exports = function (model, io, client) {
	var config = require('../../config/constants.js');

	//Start: User Notification Send
	client.on('sendUserNotification', async function (data, callback) {
		console.log("sendUserNotification: ", data)
		let t = await sequelize1.transaction();
		    try {
		        let d = await sequelize1.query('SELECT * FROM admins;', { transaction: t ,type: sequelize1.QueryTypes.SELECT});
		        console.log(d)
				await t.commit(); 
				return callback(d);
		    } catch (error) {
		        console.log('error',error);
		        if(t) {
		           await t.rollback();
		        }
		        return callback(error);
		    }
		 
	});
	//END: User Notification Send
	

}

function randomNumber(length) {
	var chars = '0123456789';
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}

// add soketId in users Table									Done
// user can send image in chat									Done
// make offer delete if any ine delete
// make changes in offer by sellers_id buyers_id
// make changes in offer by is_deleted // deleteConversation 
