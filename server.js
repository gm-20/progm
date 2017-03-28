var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var app = express();

require('./model/login.js');

//var User = mongoose.model('user');

//Connection to db
//mongoose.connect('mongodb://localhost/intern');
mongoose.connect('mongodb://grvm:grvm@ds143900.mlab.com:43900/intern')
app.engine('.html',require('ejs').__express);
app.set('views',__dirname + '/views');
app.set('view engine','html');
app.use(bodyParser());
app.use(function(req,res,next){
	res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0');
	next();
});

app.use(cookieParser());
app.use(session({
  secret: 'SECRET',
  cookie: {maxAge: 60*60*1000,secure: !true}
}));

require('./routes.js')(app);

var port = process.env.PORT || 8080;
app.listen(port);
