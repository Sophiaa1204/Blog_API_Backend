const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')
// req.params: used to access route parameters
// Example: '/users/:userId' -> '/users/123' -> 'req.params.userId' would be 123
// req.query: used to access query string parameters
// Example: '/search?keyword=express' -> req.query would contain {keyword:'express'} -> not suitable for sensitive information
// req.body: used to access data  in the body of the request
module.exports = (schema) => (req, res, next) => {
    const query = { ...req.params, ...req.query, ...req.body }
    schema.every(item => query.hasOwnProperty(item) ? next() : next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'invalid query')))
}
