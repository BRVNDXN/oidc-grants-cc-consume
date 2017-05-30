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

var http = require("http");
var https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
getJSON = function(options, onResult) {
    console.log("rest::getJSON");

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};

const DATA_FOR_ACCESS_TOKEN = {
  grant_type: process.env.GRANT_TYPE,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  audience: process.env.AUDIENCE
}

var options_for_acess_token = {
    host: 'https://bthompson.auth0.com',
    port: 443,
    path: '/oauth/token',
    method: 'POST',
    body: JSON.stringify(DATA_FOR_ACCESS_TOKEN),
    headers: {
        'Content-Type': 'application/json'
    }
};

var options_for_api_request = {
    host: 'localhost:3000',
    port: 443,
    path: '/api/private',
    method: 'GET',
    body: JSON.stringify(),
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
};


app.get('/', function(req,res,next) {
  rest.getJSON(options_for_acess_token, function(statusCode, result) {
      // I could work with the result html/json here.  I could also just return it
      console.log("onResult: (" + statusCode + ")" + JSON.stringify(result));
      res.statusCode = statusCode;
      res.send(result);
  });
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});