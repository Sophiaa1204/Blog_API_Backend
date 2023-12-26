var express = require('express')
var router = express.Router()
const validate = require('../middlewares/validate')
const { articleModel } = require('../model')
const { articleController } = require('../controllers')

router.post('/', validate(articleModel.schema), articleController.create)
router.get('/:id', validate(['id']), articleController.create)
router.put('/:id', validate(['id',...articleModel.schema]), articleController.updateInfoById)
router.delete('/:id', validate(['id']), articleController.deleteInfoById)
router.get('/list/get', articleController.getList)

module.exports = router