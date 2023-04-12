const env = process.env.NODE_ENV || "localhost"

var config = {
	development: {
		
	},
	production: {
		"port": 22,
		"baseUrl": "https://3.120.231.131",
		//"rootpath": "/var/www/html",
		"rootpath": "/var/www/lucky",
		"siteName": "lucky",
		"jwt_secret": "appjwttokenfetyuhgbcase45w368w3a",
		"jwt_expire": "365d",
		
		
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
