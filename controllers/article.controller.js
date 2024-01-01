const { articleService } = require('../services')
const catchAsync = require('../utils/catchAsync')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const crypto = require('../utils/crypto')

//Since it’s designed for async functions, it’s well-suited for operations that involve I/O operations, database queries, or any other asynchronous tasks.
// Async: Keyword: async is a keyword that you put before a function declaration to make it asynchronous.
// Await
// Keyword: await is used inside an async function to wait for a Promise to settle (either resolved or rejected).
// Behavior: When you await a Promise, the function execution pauses at this line until the Promise settles, and then resumes with the resolved value of the Promise.
// If the Promise is rejected, an error is thrown, mimicking synchronous exception handling.

// Error Handling: To handle errors in await, you can use try/catch blocks.
// Sequential vs. Parallel: await can make asynchronous code look like it’s running sequentially. Be cautious, as this might lead to performance issues if operations could be run in parallel. You can use Promise.all for parallel operations.
// Only in Async Functions: The await keyword can only be used inside async functions (including async arrow functions).
const create = catchAsync(async(req,res) => {
    const info = await articleService.create(req.body)
    res.success(info, 'Created Successfully')
})

// req.params contains route parameters. Route parameters are part of the URL path, typically used to identify a specific resource or data point.
// Example: In a route defined as /users/:userId, if a user requests /users/123, then req.params will be { userId: '123' }.

// req.body contains data sent by the client in the body of the HTTP request. This is where you'll find data submitted through forms or as JSON in a POST or PUT request.

// req.query contains the query string parameters from the URL. These are optional key-value pairs at the end of the URL after a ?
// In a request to /users?sortBy=name, req.query will be { sortBy: 'name' }.
const getInfoById = catchAsync(async(req,res) => {
    res.success(await articleService.updateById(req.params.id))
})

const updateInfoById = catchAsync(async(req, res) => {
    res.success(await articleService.updateById(req.params.id, req.body), 'Update successfully')
})

const deleteInfoById = catchAsync(async(req, res) => {
    res.success(await articleService.deleteById(req.params.id), 'Deleted successfully')
})

const getList = catchAsync(async(req, res) => {
    res.success(await articleService.getList(req.body))
})

module.exports = {
    create,
    getInfoById,
    updateInfoById,
    deleteInfoById,
    getList,
}

// promise.all
// Promise.all is a powerful feature in JavaScript used for handling multiple promises concurrently.
// Basics of Promise.all
// Functionality: Promise.all takes an iterable (like an array) of promises as an input and returns a single Promise.
// Resolution: The returned promise resolves when all the promises in the input iterable have resolved, or if the input iterable contains no promises.
// Result: The result of Promise.all is a promise that resolves to an array of the results of the input promises.
// Error Handling: If any of the passed-in promises rejects, Promise.all immediately rejects with the value of the promise that rejected, disregarding the status of the other promises.


// let promise1 = fetchDataFromAPI1();
// let promise2 = fetchDataFromAPI2();
// let promise3 = fetchDataFromAPI3();
//
// Promise.all([promise1, promise2, promise3])
//     .then((results) => {
//         // results is an array of the values resolved from each promise
//         let [result1, result2, result3] = results;
//         // Do something with the results
//     })
//     .catch((error) => {
//         // Handle the error if any of the promises gets rejected
//     });
