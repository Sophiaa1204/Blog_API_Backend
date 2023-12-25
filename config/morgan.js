// set up to log different information based on whether the HTTP response is successful or results in an error
const morgan = require('morgan')
// a customized logger
const logger = require('./logger')

morgan.token('message', (req,res) => res.locals.errorMessage || '')
const getIpFormat = () => ('')
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`
