var express = require('express');
var path = require('path');
// helps secure the apps by setting various HTTP headers
const helmet = require('helmet')
// Morgan is a popular HTTP request logger middleware for Node.js applications, especially those using the Express framework.
// It's designed to log requests to your application, helping you understand traffic and potential issues.
const morgan = require('./config/morgan')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
