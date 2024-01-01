const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')
// req.params: used to access route parameters
// Example: '/users/:userId' -> '/users/123' -> 'req.params.userId' would be 123
// req.query: used to access query string parameters
// Example: '/search?keyword=express' -> req.query would contain {keyword:'express'} -> not suitable for sensitive information
// req.body: used to access data  in the body of the request


// Function Signature:
//
// module.exports = (schema) => (req, res, next) => { ... }
// This code defines a higher-order function. The outer function takes a schema as its argument and returns an inner function.
// The inner function is an Express middleware with the standard (req, res, next) signature.
module.exports = (schema) => (req, res, next) => {
    const query = { ...req.params, ...req.query, ...req.body }
    schema.every(item => query.hasOwnProperty(item) ? next() : next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'invalid query')))
}

// High-order Function
// A higher-order function is a function that does at least one of the following:
//
// Takes one or more functions as arguments (i.e., procedural parameters).
// Returns a function as its result.


// Closures: When a function returns another function, the returned function can form a closure, meaning it retains access to the scope in which it was created.

// map: Returns a new array, does not modify the original array, ideal for transformations.
// forEach: Executes a function for each element, does not return anything, ideal for side effects.
// reduce: Reduces the array to a single value, highly flexible for various calculations and transformations.