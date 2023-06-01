const express = require('express');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  // secret: 'your-secret-key',
  secret: 'Emipix123!@#',
  resave: false,
  saveUninitialized: true
}));


// app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  // Retrieve your data from a database or any other source
  // const data = [
    // { lottoImage: 'images/unitedstatestexasallornothingnight.png',lottoName : 'All or Nothing Night', country: 'USA Texas', countryFlag : 'images/usa_flag.png', startTime : '00:00:00', startDate : '03 May 2023', watchLink : 'https://www.youtube.com/embed/El5nwzOEpDQ', drawLink: '' },
  // ];

	axios.get('http://3.120.224.214:3002/nextdraw')
	  .then(response => {
		const data = response.data.result;
		res.render('index', { data });
	  })
	  .catch(error => {
		console.error('Error fetching data:', error);
	});	

  
});
//backend Admin
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username !='') {
	req.session.loggedIn = true;
	req.session.username = username;
    res.redirect('/admin');
  } else {
    res.redirect('/login');
  }
});

// app.use('/admin', express.static('./node_modules/admin-lte'));
app.get('/admin', checkAuth, (req, res) => {
	axios.get('http://3.120.224.214:3002/listAllLotteries')
	  .then(response => {
		const data = response.data.result;
		
		res.render('admin/dashboard', {user: req.session.username, data });
	  })
	  .catch(error => {
		console.error('Error fetching data:', error);
	});	
});

app.get('/dashboard', checkAuth, (req, res) => {
  res.render('admin/dashboard'); 
});

app.get('/login', (req, res) => {
  res.render('admin/login'); 
});

app.get('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('/login');
});



app.listen(3002, () => {
  console.log('Server is running on port 3002');
});


function checkAuth(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}	