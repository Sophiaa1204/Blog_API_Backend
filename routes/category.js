var express = require('express')
var router = express.Router()
const validate = require('../middlewares/validate')
const { categoryModel } = require('../model')
const { categoryController } = require('../controllers')

router.post('/', validate(categoryModel.schema), categoryController.create)
router.get('/:id', validate(['id']), categoryController.getInfoById)
router.put(':/id', validate(['id', ...categoryModel.schema]), categoryController.updateInfoById)
router.delete(':/id', validate(['id']), categoryController.deleteInfoById)
router.get('list/get', categoryController.getList)

module.exports = router