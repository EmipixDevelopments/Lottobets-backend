'use strict';

var express = require('express');
var	http = require('http');
var fs = require('fs');
var join = require('path').join;
var path = require("path");
var mongoose = require( 'mongoose' );
var mysql = require('mysql');
var util = require('util')
var nunjucks = require('nunjucks')
const session =  require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var flash = require('connect-flash');
var passport = require('passport');
var cookieSession = require('cookie-session');
var jwt = require('jsonwebtoken');
// const numeral = require('numeral');

var winston = require('winston'); // Logger
require('winston-daily-rotate-file'); // Sys Logger  Daily

var Sys  = new require('../Boot/Sys');


var fileStoreOptions = {}; 
Sys.App = express();
// Session
Sys.App.use(session({
	store: new FileStore(fileStoreOptions),
	secret: 'KIosk',
	resave: false,
	saveUninitialized: false,
}));


// Passport
Sys.App.use(passport.initialize());
Sys.App.use(passport.session());

// Body Parser

Sys.App.use(fileUpload());

// for parsing application/json
Sys.App.use(bodyParser.json());

// for parsing application/xwww-
// Sys.App.use(bodyParser.urlencoded());
Sys.App.use(bodyParser.urlencoded({ extended: true }));

// Flash  for Error & Message
Sys.App.use(flash());

// Set Views
nunjucks.configure('./App/Views', {
	autoescape: true,
	express: Sys.App,
	watch: true,
});
Sys.App.set('view engine', 'html');
console.log("public",express.static('./public'));
Sys.App.use(express.static('./public'));
Sys.App.use('/node_modules', express.static('./node_modules'));
Sys.Server = require('http').Server(Sys.App);


// middleware to use session data in all routes
Sys.App.use(function(req,res,next){
	res.locals.session = req.session;
	next();
});

Sys.Config = new Array();
fs.readdirSync(join(__dirname, '../Config'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(function(file) {
  	Sys.Config[file.split('.')[0]] = require(join(join(__dirname, '../Config'), file))
});

Sys.Helper = new Array();
fs.readdirSync(join(__dirname, '../Helper'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(function(file) {
  	Sys.Helper[file.split('.')[0]] = require(join(join(__dirname, '../Helper'), file))
});

// Logger Load

Sys.Log = winston.createLogger({

  format: winston.format.json(),
  prettyPrint: function ( object ){
	return JSON.stringify(object);
  },
  transports: [
    new (winston.transports.DailyRotateFile)({
			filename: path.join(Sys.Config.App.logger.logFolder, '/'+ Sys.Config.App.logger.logFilePrefix +'-%DATE%.log'),
			datePattern: 'DD-MM-YYYY', // YYYY-MM-DD-HH
			zippedArchive: true,
			maxSize: '5m',
			schedule: '5m', 
			maxFiles: '1d'
		})
  ]
});

if (process.env.NODE_ENV !== 'production') {
  /*Sys.Log.add(new winston.transports.Console({
		level: 'debug',
		timestamp: true,
		
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple(),
			winston.format.timestamp(),
			winston.format.printf((info) => {
				const {
					timestamp, level, message, ...args
				} = info;
				const ts = timestamp.slice(0, 19).replace('T', ' ');
				return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
			})
		),
	}));*/
}

Sys.Log.info('Initializing Server...');

fs.readdirSync(path.join(__dirname, '../','./App'))
.filter(function(file) {
	return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);
})
.forEach(function(dir) {
	if(dir != 'Views' && dir != 'Routes'){ // Ignore Load Views & Routes in Sys Object
		Sys.App[dir] = {};
		Sys.Log.info('Loading... App '+dir);
		fs.readdirSync(path.join(__dirname,  '../', './App', dir)).filter(function(file) {
			return (file.indexOf(".") !== 0);
		}).forEach(function(file) {
			Sys.App[dir][file.split('.')[0]] = require(path.join(__dirname,  '../', './App', dir, file));
		});
	}
});

Sys.Log.info('Loading... Game Server.');
Sys.KioskServer = {};

let insidePath = null;
fs.readdirSync(path.join(__dirname, '../','./KioskServer'))
.filter(function(file) {
	return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);
}).forEach(function(dir) {
	Sys.KioskServer[dir] = {};
	//Sys.Log.info('Loading... Game '+dir);
	fs.readdirSync(path.join(__dirname,  '../', './KioskServer', dir)).filter(function(file) {
		return (file.indexOf(".") !== 0);
	}).forEach(function(subDir) {

		//Sys.Log.info('Loading... Game Sub Directory :'+subDir);
		insidePath = dir+'/'+subDir;
		if (fs.existsSync(path.join(__dirname,  '../', './KioskServer', insidePath))) {
			if(fs.lstatSync(path.join(__dirname,  '../', './KioskServer', insidePath)).isFile()){
				//Sys.Log.info('Loading... File :'+subDir);
					Sys.KioskServer[dir][subDir.split('.')[0]] = require(path.join(__dirname,  '../', './KioskServer', dir, subDir)); // Add File in Sub Folder Object
			}else{
				Sys.KioskServer[dir][subDir] = {};
				//Sys.Log.info('Loading... Game Sub Directory Folder:'+insidePath);

				fs.readdirSync(path.join(__dirname,  '../', './KioskServer', insidePath)).filter(function(file) {
					return (file.indexOf(".") !== 0);
				}).forEach(function(subInnerDir) {
					insidePath = dir+'/'+subDir+'/'+subInnerDir;
					//Sys.Log.info('Loading... Game Sub  Inner Directory :'+subInnerDir);
					if(fs.lstatSync(path.join(__dirname,  '../', './KioskServer', insidePath)).isFile()){
						//Sys.Log.info('Loading... Sub  File :'+subInnerDir);
							Sys.KioskServer[dir][subDir][subInnerDir.split('.')[0]] = require(path.join(__dirname,  '../', './KioskServer', dir+'/'+subDir, subInnerDir)); // Add File in Sub Folder Object
					}else{
						Sys.KioskServer[dir][subDir][subInnerDir] = {};
						//Sys.Log.info('Loading... Game Sub Inner Directory Folder:'+insidePath);

						fs.readdirSync(path.join(__dirname,  '../', './KioskServer', insidePath)).filter(function(file) {
							return (file.indexOf(".") !== 0);
						}).forEach(function(subInnerLastDir) {
							insidePath = dir+'/'+subDir+'/'+subInnerDir+'/'+subInnerLastDir;
							//Sys.Log.info('Loading... Game Sub  Inner Directory :'+insidePath);
							if(fs.lstatSync(path.join(__dirname,  '../', './KioskServer', insidePath)).isFile()){
							//	Sys.Log.info('Loading... Sub Last  File :'+subInnerLastDir);
								Sys.KioskServer[dir][subDir][subInnerDir][subInnerLastDir.split('.')[0]] = require(path.join(__dirname,  '../', './KioskServer', dir+'/'+subDir+'/'+subInnerDir, subInnerLastDir)); // Add File in Sub Folder Object
							}else{
							//	Sys.Log.info('Loading... Sub Last  Folder Plase Change Your Code:'+subInnerLastDir);
							}

						});
					}
				});

			}

		}

	});

});

Sys.Log.info('Loading... Router');
// Load Router
fs.readdirSync(join(__dirname, '../App/Routes'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(function(file) {
	Sys.App.use('/', require(join(join(__dirname, '../App/Routes'), file))); // Register Router to app.use
});

Sys.Log.info('Initializing Variables');
Sys.SportBet = [];
Sys.LiveTime = [];
Sys.Timers = [];
Sys.Competition = [];
Sys.Event = [];
Sys.SqlPool = {};
Sys.DefaultFreeChips = '500';

Sys.Log.info('Loading... DB Connection');
// MySql  Connection

if(Sys.Config.Database.connectionType == 'local'){
console.log("Sys.Config.Database[Sys.Config.Database.connectionType].sql.host :",Sys.Config.Database[Sys.Config.Database.connectionType].sql.host)

	Sys.SqlPool = mysql.createPool({
		connectionLimit: 100000,
		acquireTimeout: 100000,
		queueLimit:0,
		supportBigNumbers: true,
        bigNumberStrings: true,
        waitForConnections: true,
		host: Sys.Config.Database[Sys.Config.Database.connectionType].sql.host,
		user: Sys.Config.Database[Sys.Config.Database.connectionType].sql.user,
		password: Sys.Config.Database[Sys.Config.Database.connectionType].sql.password,
		database: Sys.Config.Database[Sys.Config.Database.connectionType].sql.database
	})

}
else{
Sys.Log.info('Connection... DB...');
	Sys.SqlPool = mysql.createPool({
		/*connectionLimit: 100000,
		acquireTimeout: 100000,
		queueLimit:0,
		waitForConnections: true,
		supportBigNumbers: true,
        bigNumberStrings: true,*/
		host: Sys.Config.Database[Sys.Config.Database.connectionType].sql.host,
		port:Sys.Config.Database[Sys.Config.Database.connectionType].sql.port,
		user: Sys.Config.Database[Sys.Config.Database.connectionType].sql.user,
		password: Sys.Config.Database[Sys.Config.Database.connectionType].sql.password,
		database: Sys.Config.Database[Sys.Config.Database.connectionType].sql.database
	})
 
}

Sys.SqlPool.query = util.promisify(Sys.SqlPool.query);


    


Sys.SqlPool.getConnection((err, connection) => {
    if (err) {
    console.log('=====',err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
	}
 
    if (connection){

		/*Sys.Log.info('Loading... Setting');
		Sys.Io = require('socket.io')(Sys.Server,{'pingTimeout' :Sys.Config.Socket.pingTimeout,'pingInterval' : Sys.Config.Socket.pingInterval});
		//Sys.Log.info('Loading... Socket');
		Sys.Io.on('connection',async function(socket) {
					Sys.Log.info('Socket Connected : ' + socket.id);
					//Sys.Log.info('Socket Connected : ' + socket.id);
					// Object.keys(Sys.App.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
					// 	Sys.App.Sockets[key](socket);
					// });
					Object.keys(Sys.KioskServer.Common.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
						Sys.KioskServer.Common.Sockets[key](socket,Sys.Io)
					});
		});*/

	    

		Sys.Server.listen(Sys.Config.Socket.port,function() {
		console.log("(---------------------------------------------------------------)");
		console.log(" |                    Server Started...                        |");
		console.log(" |                  https://"+Sys.Config.Database[Sys.Config.Database.connectionType].sql.host+":"+Sys.Config.Socket.port+"                      |");
		console.log("(---------------------------------------------------------------)");
		});
		connection.release()
	} 
    return
})


/*//////////////////////////////Dotnet/////////////////////////////////////////
if(Sys.Config.Database.connectionType2 == 'dotNet'){
//console.log("Sys.Config.Database[Sys.Config.Database.connectionType].sql.host :",Sys.Config.Database[Sys.Config.Database.connectionType].sql.host)

	Sys.SqlPool2 = mysql.createPool({
		connectionLimit: 100000,
		acquireTimeout: 100000,
		queueLimit:0,
		waitForConnections: true,
		supportBigNumbers: true,
        bigNumberStrings: true,
		host: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.host,
		user: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.user,
		password: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.password,
		database: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.database
	})

}
else{
Sys.Log.info('Connection... DB...');
	Sys.SqlPool2 = mysql.createPool({
		connectionLimit: 100000,
		acquireTimeout: 100000,
		queueLimit:0,
		waitForConnections: true,
		supportBigNumbers: true,
        bigNumberStrings: true,
		host: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.host,
		port:Sys.Config.Database[Sys.Config.Database.connectionType2].sql.port,
		user: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.user,
		password: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.password,
		database: Sys.Config.Database[Sys.Config.Database.connectionType2].sql.database
	})
 
}

Sys.SqlPool2.query = util.promisify(Sys.SqlPool2.query);


    


Sys.SqlPool2.getConnection((err, connection) => {
    if (err) {
    console.log('=====',err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
	}
 
     connection.release();
    return
})
Sys.SqlPool.on('connection',async function (err,) {
    

});*/
// var dbURI = '';
// if(Sys.Config.Database.connectionType == 'local'){

//   dbURI = 'mongodb://'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.host+':'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.port+'/'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.database;
// }
// else{
//   dbURI = 'mongodb://'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.user+':'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.password+'@'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.host+':'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.port+'/'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.database;
// }

// mongoose.connect(dbURI,Sys.Config.Database.option);

// // CONNECTION EVENTS
// // When successfully connected
// mongoose.connection.on('connected', async function () {
// 	Sys.Namespace = [];
// 	Sys.Log.info('Mongoose default connection open to ' + dbURI);
// 	Sys.Log.info('Loading... Setting');
// 	//await Sys.KioskServer.Common.Controllers.LiveApiController.updateLiveData();
// 	//await Sys.KioskServer.Common.Controllers.LiveApiController.updateDatabase();
// 	//await Sys.KioskServer.Common.Controllers.LiveApiController.bradcastLiveData();
// 	//await Sys.App.Controllers.BetApiController.getSportBetEventList();
// 	//await Sys.App.Controllers.FrontController.setLiveTimer();
// 	Sys.Io = require('socket.io')(Sys.Server,{'pingTimeout' :Sys.Config.Socket.pingTimeout,'pingInterval' : Sys.Config.Socket.pingInterval});
// 	Sys.Log.info('Loading... Socket');

// 	Sys.Io.on('connection',async function(socket) {
// 		Sys.Log.info('Socket Connected : ' + socket.id);
// 		Object.keys(Sys.App.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
// 			Sys.App.Sockets[key](socket);
// 		});
// 		Object.keys(Sys.KioskServer.Common.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
// 			Sys.KioskServer.Common.Sockets[key](socket)
// 		});
			 
		



// 		socket.on('disconnect',async function() {
// 			Sys.Log.info('Socket Disconnected : ' + socket.id);
// 			clearTimeout(Sys.Timers[socket.id]);
// 		});
// 	});

// 	Sys.Server.listen(Sys.Config.Socket.port,function() {
 
// 		console.log("(---------------------------------------------------------------)");
// 		console.log(" |                    Server Started...                        |");
// 		console.log(" |                  http://"+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.host+":"+Sys.Config.Socket.port+"                      |");
// 		console.log("(---------------------------------------------------------------)");
// 		setInterval(function(){ 
// 			const {rss,heapTotal} = process.memoryUsage();
// 			// Send Broadcast only for Dashboard 
// 			let data = {
// 				rss : parseInt(rss/1024/1024),
// 				heap : parseInt(heapTotal/1024/1024),
// 			}
// 			// console.log("Memory :",data)	  
// 		}, 1000);

// 	});
// });

// // If the connection throws an error
// mongoose.connection.on('error',async function (err) {
//   Sys.Log.info('Mongoose default connection error: ' + err);
// });

// // When the connection is disconnected
// mongoose.connection.on('disconnected', function () {
//   Sys.Log.info('Mongoose default connection disconnected');
// });

// // If the Node process ends, close the Mongoose connection
// process.on('SIGINT', function() {
//   mongoose.connection.close(function () {
//     Sys.Log.info('Mongoose default connection disconnected through app termination');
//     process.exit(0);
//   });
// });

/**
 * Initiate Redis
 */
// const redisDb = require('redis');
// Sys.redis = redisDb.createClient();

// // Print redis connection to the console
// Sys.redis.on('connect', function() {
// 	Sys.Log.info('Redis Connected !!!');
// });

// // Print redis errors to the console
// Sys.redis.on('error', (err) => {
// 	Sys.Log.error("Error connecting redis server : " + err);
// });


module.exports = { app: Sys.App, server: Sys.Server };
