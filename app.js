// Define global variables
global.rootRequire = function (name) {
  return require(__dirname + '/' + name);
}

var express 		   = require('express'),
	  app 	  		   = express(),
	  bodyParser	   = require('body-parser'),
    cookieParser   = require('cookie-parser');

app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');

// Support JSON-encoded bodies
app.use(bodyParser.json({
  limit: '5mb'
}));
// Support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '5mb'
}));
// Parse cookies
app.use(cookieParser());
// Parse request params like in Express 3.0
app.use( require('request-param')() );


// WIP

const request = require('request');

const AUTH_URL = 'https://bthompson.auth0.com/oauth/token';
const API_URL  = 'http://localhost:3000/api/private';

const DATA_FOR_ACCESS_TOKEN = {
  grant_type: process.env.GRANT_TYPE,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  audience: process.env.AUDIENCE
};

var options_for_acess_token = {
  method: 'POST',
  url: AUTH_URL,
  headers: { 'content-type': 'application/json' },
  body: {
    grant_type: process.env.GRANT_TYPE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    audience: process.env.AUDIENCE
   },
  json: true
};


app.get('/', function(req,res,next) {
  console.log("INDEX ROUTE... DATA_FOR_ACCESS_TOKEN:",JSON.stringify(DATA_FOR_ACCESS_TOKEN));

  request(options_for_acess_token, function (error, response, body) {
    if (error) throw new Error(error);

    console.log("ACCESS TOKEN:",body);

    var access_token = body.access_token,
        token_type   = body.token_type;

    var options_for_api_request = {
      method: 'GET',
      url: API_URL,
      headers: {
        authorization: token_type + ' ' + access_token
      }
    };

    request(options_for_api_request, function (error, response, body) {
      if (error) throw new Error(error);
      console.log("API REQUEST",body);

      res.status(200).send(body);
    });

  });
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});