var express = require('express');
var app = express();
global.config = require('./config/constants.js');
var port = config.port || 486;
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');
var cookieParser = require('cookie-parser');
global.moment = require('moment');
var FCM = require('fcm-node');
var session = require('express-session');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var fileUpload = require('express-fileupload');
const expressValidator = require('express-validator');

var fs = require('fs');
var nunjucks = require('nunjucks');
global.now = new Date();


//var server = require('http').createServer(app);
/*var https_options = {
  key: fs.readFileSync('public/backend/ssh/privkey.pem'),
  cert: fs.readFileSync('public/backend/ssh/fullchain.pem')
};
var server = require('https').createServer(https_options, app);*/
//+++++++++++++++++++++++++++++++COIN PAYMENT CODE END END+++++++++++++++++++++++++
if (process.env.NODE_ENV == "production") {
  var server = require('https').createServer(https_options, app);
 //var server = require('http').createServer(app);
} else {
  var server = require('http').createServer(app);
}

io = require('socket.io')(server, {cors: { origin: "*" }});

var Sequelize = require('sequelize');
global.Sequelize = Sequelize;
var sequelizeDB = require('./config/database.js')(Sequelize);
global.sequelize1 = sequelizeDB;
//require('./config/logconfig.js');
global.fs = require('fs');

app.use(expressValidator());
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser());
app.use("/", express.static(__dirname + "/public/Build"));


//set in headers in every request
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization" );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});




//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
nunjucks.configure('app/views', {
  autoescape: true,
  express: app,
  watch: true
});
app.set('view engine', 'html');


app.use(cookieSession({
  name: 'session',
  keys: ["bitmodocookie"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(fileUpload());

//START: login auth0
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
//END : login auth0

//Start: Load model, controller, helper, and route
//var model = require('./app/models/mongo/index')(mongoose);
var model = require('./app/models/mysql/index')(Sequelize, sequelizeDB);
var controllers = require('./app/controllers/index')(model);
require('./routes/index.js')(app, model, controllers);
global.helper = require('./app/helpers/helpers.js');


var https = require('https');
var axios = require('axios').default;
  
/*const headers = {};
const httpsAgent = new https.Agent({
    ca: fs.readFileSync('public/backend/ssh/smsbomb_cf.pem'),
    cert: fs.readFileSync('public/backend/ssh/smsbomb_cf.pem'),
    rejectUnauthorized: false
})*/

  


//Start: Server connection
console.log("process.env.NODE_ENV=",process.env.NODE_ENV)
app.set('port', port);
server.listen(port, function () {
  console.log("server starting on port " + port);
  console.log("(---------------------------------)");
  console.log("|         Server Started...       |");
  console.log("|   " + config.baseUrl + "        |");
  console.log("(---------------------------------)");
});
//End: Server connection

//Start: Socket connection code
global.io = io;
io.on('connection', function (client) {
  global.socket = client;
  console.log("Socket connection established",client.id);
  require('./socket/index')(model, io, client);
  
  client.on('disconnect', function () { console.log("Socket disconnected") });

});



module.exports = { app: app, server: server }
