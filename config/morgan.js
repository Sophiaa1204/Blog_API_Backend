// Morgan is a popular HTTP request logger middleware for Node.js. This configuration sets up two different logging behaviors: one for successful requests (status codes less than 400) and another for error requests (status codes 400 and above).
// set up to log different information based on whether the HTTP response is successful or results in an error
const morgan = require('morgan')
// a customized logger
const logger = require('./logger')

// This line defines a custom token named message for morgan. This token extracts the value of errorMessage from res.locals, a storage space for response-local variables, and returns it. If errorMessage is not set, it returns an empty string. This token can be used in morgan's logging format strings.
morgan.token('message', (req,res) => res.locals.errorMessage || '')
const getIpFormat = () => ('')
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`

const successHandler = morgan(successResponseFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: {write: (message) => logger.info(message.trim())}
})

const errorHandler = morgan(errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: {write: (message) => logger.error(message.trim())}
})

module.exports = {
    successHandler,
    errorHandler,
}
