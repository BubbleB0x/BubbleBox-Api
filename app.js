var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var auth = require('./lib/auth/auth');

//Allow Cors policy
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var devicesRouter = require('./routes/devices');
var staffRouter = require('./routes/staff');
var adminRouter = require('./routes/admin');

var app = express();

//add env
require('dotenv').config()

// Aggiunta dei cors
app.use(cors({ origin: "*" }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Public routes
app.use('/', indexRouter);
//Auth middleware
app.use(function(req, res, next) {
  auth.authenticateToken(req, res, next)
});

//privates routes
app.use('/users', function(req, res, next) {
  auth.rbacUsers(req, res, next);
}, usersRouter);
app.use('/devices', function(req, res, next) {
  auth.rbacDevices(req, res, next)
}, devicesRouter);
app.use('/staff', function(req, res, next) {
  auth.rbacStaff(req, res, next)
}, staffRouter);
app.use('/admin', function(req, res, next) {
  auth.rbacAdmin(req, res, next)
}, adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  
  res.render('error');
});

module.exports = app;
