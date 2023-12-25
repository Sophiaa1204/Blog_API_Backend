var express = require('express')
var router = express.Router()
const validate = require('../middlewares/validate')
const { userModel } = require('../model')
const { userController } = require('../controllers')

router.post('/login', validate(['email', 'password']), userController.login)


module.exports = router;
