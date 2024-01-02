const { likeService } = require('../services')
const catchAsync = require('../utils/catchAsync')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const crypto = require('../utils/crypto')

const create = catchAsync(async(req, res) => {
    const info = await likeService.create(req.body)
    res.success(info, 'Created successfully')
})

const getInfoById = catchAsync(async(req, res) => {
    res.success(await likeService.getInfoById(req.params.id))
})

const updateInfoById = catchAsync(async(req, res) => {
    res.success(await likeService.updateById(req.params.id, req.body), 'Updated successfully')
})

const deleteInfoById = catchAsync(async(req, res) => {
    res.success(await likeService.deleteById(req.params.id), 'Deleted successfully')
})

const getList = catchAsync(async(req, res) => {
    res.success(await likeService.getList(req.body))
})

module.exports = {
    create,
    getInfoById,
    updateInfoById,
    deleteInfoById,
    getList,
}