const env = process.env.NODE_ENV || "production"

var config = {
	development: {
		
	},
	production: {
		"port": 3000,
		"baseUrl": "http://3.120.231.131:3000",
		//"rootpath": "/var/www/html",
		"rootpath": "/var/www/lucky",
		"lotto_img_url": "https://img.luckynumbersinternet.net/Colour",
		"siteName": "lucky",
		"jwt_secret": "appjwttokenfetyuhgbcase45w368w3a",
		"jwt_expire": "365d",
		"Table":{	USER:'mobile_user',
					QUESTIONLIST:'question_list',
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
