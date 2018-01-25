var express = require('express');
var app = express();
var Twig = require("twig");
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static('web/'));

app.set('views', 'E:\\Programs\\Web Practice\\Steemit\\steemline\\app\\Resources\\views');

app.get('/logout', function (req, res) {
    res.clearCookie('accesstoken');
    res.clearCookie('username');
    res.redirect('/index.html');
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