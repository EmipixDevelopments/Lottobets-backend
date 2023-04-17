const env = process.env.NODE_ENV || "production"

var config = {
	development: {
		
	},
	production: {
		
}
module.exports = config[env]
