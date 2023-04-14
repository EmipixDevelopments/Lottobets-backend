// MySql Connection Data

module.exports = {
	connectionType :  'staging',
	connectionType2 :  'dotNet_staging',
	option : {},
	local: {
		mode: 'local',
		sql: {
			host: '192.168.1.34',
			user: 'aisin_kiosk',
			password : 'nNm9sgQ3', // Admin@1234
			database: 'aisin_kiosk',
			
		}

	},
	dotNet: {
		mode: 'dotNet',
		sql: {
			host: '192.168.2.15',
			user: 'root',
			password : '', // Admin@1234
			database: 'CNGCore',
		}
	},
	dotNet_staging: {
			mode: 'dotNet_staging',
			sql: {
				host: 'live.serveftp.net',
				port: 3306,
				user: 'developer',
				password : 'Cn9Ap12o!7',
				database: 'cngapi'
			}
	},
	staging: {
			mode: 'staging',
			sql: {
				//host: '172.31.44.69',
				host: '172.31.37.175',
				port: '',
				user: 'luckynumberint',
				password : '7@x"`f3d(~LUQRf(',
				database: 'luckynumberint'
			}
		},
		production: {
			mode: 'production',
			sql: {
				host: '127.0.0.1',
				port: 27017,
				user: '',
				password : '',
				database: 'kiosk'
			}
		}
}
