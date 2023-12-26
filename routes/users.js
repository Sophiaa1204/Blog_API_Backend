var express = require('express')
var router = express.Router()
const validate = require('../middlewares/validate')
const { userModel } = require('../model')
const { userController } = require('../controllers')

router.post('/login', validate(['email', 'password']), userController.login)
router.post('/signUp', validate(userModel.schema), userController.signUp)
router.post('/', validate(userModel.schema), userController.create)
router.get('/:id', validate(['id']), userController.getInfoById)
router.put('/:id', validate(['id', ...userModel.schema]), userController.updateInfoById)
router.delete('/:id', validate(['id']), userController.deleteInfoById)
router.get('/getList', userController.getList)
router.get('/getCurrentUserInfo', userController.getCurrentUserInfo)
router.put('/updateCurrentUserInfo', validate(userModel.schema), userController.updateCurrentUserInfo)

module.exports = router;
