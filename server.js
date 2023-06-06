const express = require('express');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const bodyParser = require('body-parser');
const getVideoId = require('get-video-id');
const url = require('url');
//const flash = require('connect-flash');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  // secret: 'your-secret-key',
  secret: 'Emipix123!@#',
  resave: false,
  saveUninitialized: true
}));
//app.use(flash());

// app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  // Retrieve your data from a database or any other source
	axios.get('https://lottobets.co/nextdrawWatch')
	  .then(response => {
		const data = response.data.result;
		data.forEach((element, index) => {
			if(element.live_url !=''){
				let videoID = getVideoId(element.live_url);
				element.live_url = makeLinkEmbeded(element.live_url, videoID.id, "Live");
			}
			
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
            console.log("response==",response.data)
			if(response.data.status=='success'){
				req.session.loggedIn = true;
				req.session.username = username;
				return res.redirect('/admin');
			}else{
				return res.redirect('/login');
			}
    });
  
  /*if (username !='') {
	
    res.redirect('/admin');
  } else {
    res.redirect('/login');
  }*/
});

// app.use('/admin', express.static('./node_modules/admin-lte'));
app.get('/admin', checkAuth, (req, res) => {
	axios.get('https://lottobets.co/listAllLotteriesWatch')
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

	// var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;	
    // var match = url.match(regExp);
	// console.log('url : ',url);
	// console.log('regExp : ',regExp);
	// console.log('match : ',match);
    // return (match&&match[7].length==11)? match[7] : false;	
	/*
  const regex = new RegExp('/(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g');
  const match = url.match(regex);
  console.log("regex : ",regex);
  console.log("match : ",match);
  
  
  if(match && match[1].length === 11){
	return match[1];
  }	else {
	const pattern = /^(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]+)/;
	const match = url.match(pattern);
	return match[1];  
  } 
  */
  
  const parsedUrl = url.parse(urlString, true);

  if (parsedUrl.hostname === 'www.youtube.com' || parsedUrl.hostname === 'youtube.com') {
    if (parsedUrl.pathname === '/watch') {
		console.log('parsedUrl.query.v : ',parsedUrl.query.v);
      return parsedUrl.query.v;
    } else if (parsedUrl.pathname.startsWith('/embed/')) {
		console.log("parsedUrl.pathname.split('/')[2] : ",parsedUrl.pathname.split('/')[2]);
      return parsedUrl.pathname.split('/')[2];
    } else if (parsedUrl.pathname.startsWith('/v/')) {
		console.log("parsedUrl.pathname.split('/')[2] : ",parsedUrl.pathname.split('/')[2]);
      return parsedUrl.pathname.split('/')[2];
    }
  } else if (parsedUrl.hostname === 'youtu.be') {
	  console.log('parsedUrl.pathname.substr(1) : ',parsedUrl.pathname.substr(1));
    return parsedUrl.pathname.substr(1);
  }

  return null;
  
}

function createEmbeddedYouTubeLink(videoId) {
  const embedUrl = "https://www.youtube.com/embed/"+videoId;

 // const iframe = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

  return embedUrl;
}