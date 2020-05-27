var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// router module import
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user/index');
var adminRouter = require('./routes/admin/index');

var app = express();

// const value
var SERVER_PORT = 8100;

// disable etag of http header
app.disable('etag');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'express-admin', 
  secret: 'very secret - required', 
  saveUninitialized: true, 
  resave: true,
  cookie : {
    maxAge :  120 * 60 * 1000
  }
}))

// login intercepter
app.all('/*', function(req, res, next){
  if (req.session.user) {
    next();
  } else {
    // analysis path
    var arr = req.url.split('/');
    // remove paramters from query path 
    for (var i = 0, length = arr.length; i < length; i++) {
      arr[i] = arr[i].split('?')[0];
    }
    // Do not intercept request if the path is root, login or register
    if (arr.length > 1 && arr[1] == '') {
      next();
    } else if (arr.length > 2 && arr[1] == 'user' && (arr[2] == 'register' || arr[2] == 'login' || arr[2] == 'logout' || arr[2].indexOf('login') >= 0 )) {
      next();
    } else {
      // record original url
      req.session.originalUrl = req.originalUrl ? req.originalUrl : null;
      // redirect to user login page
      res.redirect('/user/login');
    }
  }
});

// path register
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var listener = app.listen(SERVER_PORT, function() {
  global.serverPort = listener.address().port;
  console.log("Server Start!");
});

module.exports = app;
