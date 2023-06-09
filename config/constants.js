const env = process.env.NODE_ENV || "production"

var config = {
	development: {
		
	},
	production: {
		"port": 3000,
		"baseUrl": "https://lottobets.co",
		//"rootpath": "/var/www/html",
		"rootpath_npv": "/public_html/Lottobets-backend/npv/",
		"lottobetsJwtAuth": "lottobetsJwtAuth123!@#",
		"lotto_img_url": "https://img.luckynumbersinternet.net/Colour",
		"siteName": "lucky",
		"jwt_secret": "appjwttokenfetyuhgbcase45w368w3a",
		"jwt_expire": "365d",
		"siteId": "1",
		"twilio_accountSid" : "AC410eaddccc14b5133cd96e35e0b3e499",
		"twilio_authToken" : "d80659226e00cd2022048e00e3198dd2",
		"twilio_fromNumber" : "+27600703069",
		"purchase_value": "10000",
		"Table":{	USER:'mobile_user',
					ADMIN:'admin',
					QUESTIONLIST:'question_list',
					COUNTRIES:'countries',
					MOBILEUSERIAV:'mobile_user_iav_list',
					IAV_PURCHASE:'iav_purchase',
					FLOAT:'float',
					GENERAL_SETTING:'general_setting',
					LOTTO_PROFILE:'lotto_profile',
					FAVOURITE:'favourite',
					IAV_RUNNING:'iav_running',
					LOTTOLIST:'lottolist',
					SITEPROFILE:'siteprofile',
					LOTTOEVENT:'lottoevent',
					CRON_LOTTOEVENT:'ret_events',
					CUNTRYLIST:'countrylist',
					CRON_LOTTOLIST:'ret_lottolists',
					SITEPROFILEMANAGEMENT:'siteprofilemanagement',
					SITEMANAGEMENT:'sitemanagement',
					MARKETLIST:'marketlist',
					MOBILE_USER_FAVOURITE_LOTTO_LIST:'mobile_user_fav_lotto_list',
					PLAYED_EVENT_DETAILS:'played_event_details',
					MOBILE_SETTING:'mobile_setting',
					MOBILE_USER_BET_HISTORY:'mobile_user_bet_history',
					MOBILE_BARCODE_LIST:'mobile_barcode_list',
					IAV_IN_KIOSK:'iav_in_kiosko',
					KIOSK_SETTING : 'kiosk_setting',
					RET_CNG_APK : 'ret_cng_apk',
					MODE_ACCESS_KEY : 'mode_access_key',
					GLOBAl_ACCESS_KEY : 'global_access_key',
					OTP_SCREEN_CHECK : 'otp_screen_check',
					BLOCK_IAV_LIST : 'block_iav_list',
					MOBILE_DEVICE_ID: 'mobile_deviceid',
					GUEST_USER_TIMER : 'guest_user_timer',
					ARCHIVE_TABLE_STATUS: 'archive_table_status'
				}
		
		
	},
	localhost: {
		"port": 3000,
		"baseUrl": "http://localhost:3000",
		"rootpath": "/opt/lampp/htdocs/lucky",
		"siteName": "lucky",
		"jwt_secret": "appjwttokenfetyuhgbcase45w368w3a",
		"jwt_expire": "365d",
	}
}
module.exports = config[env]
