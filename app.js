var express = require('express')

var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var flash = require('express-flash');
var routes = require('./routes')
var  user = require('./routes/user')
var users =require('./routes/users')
var item =require('./routes/item')
var stock = require('./routes/stock')
var path = require('path');
var index =require('./routes/index')
var session = require('express-session');
var app = express();
var mysql = require('mysql');
var bodyParser=require("body-parser");
var connection  = require('./lib/db.js');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var itemRouter = require('./routes/item');
var stockRouter = require('./routes/stock');
var userRouter = require('./routes/user');

app.use('/auth', authRouter);
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret : 'webslesson',
  resave : true,
  saveUninitialized : true
}));

app.get('/', routes.index);
app.get('/signup', user.signup);
app.post('/signup', user.signup);
app.get('/signup',routes.index)
app.get('/login', routes.index);
app.post('/login', user.login);
app.get('/home/dashboard', user.dashboard);
//app.get('/home/logout', user.logout);
app.get('/home/profile',user.profile);
app.get('/add',);
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" })
  res.redirect("/")
})

app.use(logger('dev'));
app.use(flash());
app.use('/users', usersRouter);
app.use('/item', itemRouter);
app.use('/stock',stockRouter);

app.use(function(req, res, next) {
  next(createError(404));
});


// app.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});
module.exports = app;