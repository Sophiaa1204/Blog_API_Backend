var express = require('express');
var router = express.Router();

// use sub-route and modularization
// const userRouter = require('./userRouter');
//
// router.use('/users', userRouter);
// // Now, all requests to /users will be handled by userRouter

router.use('/user', require('./users'))
router.use('/category', require('./category'))
router.use('./article', require('./article'))
router.use('./public', require('./public'))
router.use('./like', require('./like'))
router.use('./comment', require('./comment'))

module.exports = router;
