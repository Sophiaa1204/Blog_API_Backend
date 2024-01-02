var express = require('express');
var path = require('path');
// helps secure the apps by setting various HTTP headers
const helmet = require('helmet')
// Morgan is a popular HTTP request logger middleware for Node.js applications, especially those using the Express framework.
// It's designed to log requests to your application, helping you understand traffic and potential issues.
const morgan = require('./config/morgan')
const ApiError = require('./utils/ApiError')
const { errorConverter, errorHandler } = require('./middlewares/error')
// middleware for compressing HTTP request
const compression = require('compression')
// middleware to enable Cross-Origin Resource Sharing (CORS)
const cors = require('cors')
const httpStatus = require('http-status')

var app = express()
app.use(morgan.successHandler)
app.use(morgan.errorHandler)
app.use(helmet())
// middleware to parse incoming requests with JSON payloads
app.use(express.json())
// middleware to parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: false }))
// Compresses response bodies for all requests.
app.use(compression())
// Enables CORS with various options.
app.use(cors())
app.options('*', cors())
app.use(require('./middlewares/ApiSuccess'))
// Static file
app.use(express.static(path.join(__dirname, 'public')))
// Routes
app.use('/v1', require('./routes/index'))
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND), 'Not found')
})
// convert error to ApiError, if needed
app.use(errorConverter)
// handle error
app.use(errorHandler)
module.exports = app