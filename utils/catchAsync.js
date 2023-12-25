// A high-order function, which takes another function named 'fn' as an argument and returns a new function
// 'fn' is expected to be an asynchronous function returning a promise
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
}

module.exports = catchAsync