var express = require('express');
var app = express();
var Twig = require("twig");
var cookieParser = require('cookie-parser');
var request = require('request');
app.use(cookieParser());

app.use(express.static('web/'));

app.set('views', './app/Resources/views');

app.get('/logout', function (req, res) {
    res.clearCookie('accesstoken');
    res.clearCookie('username');
    res.redirect('/index.html');
});

app.get('/api/mentions', function (req, res) {
	var username = req.query.username;
	var comments = req.query.comments;
	var own = req.query.own;

	request('http://api.comprendre-steem.fr/getMentions?comments='+comments+'&own_comments='+own+'&username='+username, function (error, response, body) {
	  if(!error && response.statusCode==200) {
	  	res.send(body)
	  }
	});
});

app.get('/api/votes', function (req, res) {
	var username = req.query.username;
	var perpage = req.query.perpage;

	request('http://api.comprendre-steem.fr/getIncomingVotes?username='+username+'&limit='+perpage, function (error, response, body) {
	  if(!error && response.statusCode==200) {
	  	res.send(body)
	  }
	});
});

app.get('/api/votesCount', function (req, res) {
	var username = req.query.username;

	request('http://api.comprendre-steem.fr/getIncomingVotes?username='+username+'&limit='+10000, function (error, response, body) {
	  if(!error && response.statusCode==200) {
	  	var b = JSON.parse(body);
	  	res.send(b.size.toString());
	  }
	});
});

app.get('/auth', function (req, res) {
    var accesstoken = req.query.access_token;
    var usrname = req.query.username;

    res.cookie('accesstoken', accesstoken).cookie('username', usrname);
    res.redirect('/index.html');
});

app.get('/index.html', function (req, res) {
    var usrname = req.cookies['username'];
    var accesstoken = req.cookies['accesstoken'];
    if (accesstoken == undefined && usrname == undefined) {
        res.render('./default/index.html.twig', {
            url: 'http://localhost:8000',
            host: 'http://localhost:8000',
            accesstoken: false,
            username: false
        });
    } else {
        res.render('./default/index.html.twig', {
            url: 'http://localhost:8000',
            host: 'http://localhost:8000',
            accesstoken: "'" + accesstoken + "'",
            username: "'" + usrname + "'"
        });
    }
});

app.get('/', function (req, res) {
    res.send("Hello world!");
});

app.get('*', function (req, res) {
    res.send("Wrong URL!");
});

app.listen(8000);