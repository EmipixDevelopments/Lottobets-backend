const express = require('express');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const bodyParser = require('body-parser');
const getVideoId = require('get-video-id');
const url = require('url');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'Emipix123!@#',
  resave: false,
  saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
	axios.get('https://lottobets.co/nextdrawWatch')
	  .then(response => {
		const data = response.data.result;
		data.forEach((element, index) => {
			// if(element.live_url !='' && element.live_url !=undefined){
				// let videoID = getVideoId(element.live_url);
				// element.live_url = makeLinkEmbeded(element.live_url, videoID.id, "Live");
			// }
			
			if(element.drawLink !='' && element.drawLink !=undefined){
				let videoID = getVideoId(element.drawLink);
				element.drawLink = makeLinkEmbeded(element.drawLink, videoID.id, "Watch");
			}	
		});
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

  const data = {
              "username": username,
              "password": password,
        };
        const conf = {
             headers: {
                 "Content-type": "application/json",
             },
        };    
        axios.post('https://lottobets.co/watchAdminLogin', data).then(response => {
			if(response.data.status=='success'){
				req.session.loggedIn = true;
				req.session.username = username;
				return res.redirect('/admin');
			}else{
				return res.redirect('/login');
			}
    });
});

app.get('/admin', checkAuth, (req, res) => {
	axios.get('https://lottobets.co/listAllLotteriesWatch')
	  .then(response => {
		const data = response.data.result;
		
		// data.sort((a, b) => a.DrawTime - b.DrawTime);
		
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

function makeLinkEmbeded(link ,videoId, linkType){
	//if(linkType == 'Live'){
		// console.log("linkType : ",linkType," link : ",link);
		//const videoId = getYouTubeVideoId(link);
		// const { videoId } = getVideoId(link);
	//} else { 
		if(videoId)
			return createEmbeddedYouTubeLink(videoId);
		else	
		  console.log("Invalid YouTube URL");
	//}
	
}

function getYouTubeVideoId(urlString) {
  const parsedUrl = url.parse(urlString, true);

  if (parsedUrl.hostname === 'www.youtube.com' || parsedUrl.hostname === 'youtube.com') {
    if (parsedUrl.pathname === '/watch') {
      return parsedUrl.query.v;
    } else if (parsedUrl.pathname.startsWith('/embed/')) {
      return parsedUrl.pathname.split('/')[2];
    } else if (parsedUrl.pathname.startsWith('/v/')) {
      return parsedUrl.pathname.split('/')[2];
    }
  } else if (parsedUrl.hostname === 'youtu.be') {
    return parsedUrl.pathname.substr(1);
  }

  return null;
  
}

function createEmbeddedYouTubeLink(videoId) {
	const embedUrl = "https://www.youtube.com/embed/"+videoId;
	return embedUrl;
}