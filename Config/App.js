module.exports = {
	logger : {
		logFolder : 'Log', // Change Your Name With Your Custom Folder
		logFilePrefix : 'game'
	},
	
	mailer: {
		auth: {
			user: 'node1@aistechnolabs.co.uk',
			pass: 'AIS@#!@#$!@SW',
		},
		defaultFromAddress: 'CNG App <node1@aistechnolabs.co.uk>'
	},
	twilio:{
		accountSid : "AC410eaddccc14b5133cd96e35e0b3e499",
		authToken : "d80659226e00cd2022048e00e3198dd2",
		//fromNumber : "+447723429004"
		fromNumber : "+27600703069"
	}
}
