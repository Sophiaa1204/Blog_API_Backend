const { userService } = require('../services')
const catchAsync = require('../utils/catchAsync')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const crypto = require('../utils/crypto')

const login = catchAsync(async(req, res) => {
    // in body of POST method
    const { email, password } = req.body
    const info = await userService.getInfoByEmail(email)
    if (!info) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,'Wrong Username or Password')
    if (crypto.isSame(password, info.password)) {
        //TODO generate token
        res.success(info)
    } else {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Wrong Username or Password')
    }
})

const create = catchAsync(async(req, res) => {
    const info = await userService.create(req.body)
    //TODO generate token
    res.success(info, 'Created successfully')
})

//TODO encryptedPassword
const signUp = catchAsync(async(req, res) => {
    const info = await userService.create(req.body)
    //TODO generate token
    res.success(info, 'Sign-up successfully')
})

const getCurrentUserInfo = catchAsync(async(req, res) => {
    res.success(await userService.getInfoById(req.user.id))
})

const updateCurrentUserInfo = catchAsync(async(req, res) => {
    res.success(await userService.updateById(req.user.id, req.body))
})

const getInfoById = catchAsync(async(req, res) => {
    res.success(await userService.getInfoById(req.params.id))
})

const updateInfoById = catchAsync(async(req, res) => {
    res.success(await userService.updateById(req.params.id, req.body), 'Updated successfully')
})

const deleteInfoById = catchAsync(async(req, res) => {
    res.success(await userService.deleteById(req.params.id), 'Deleted successfully')
})

const getList = catchAsync(async(req, res) => {
    res.success(await userService.getList(req.body))
})

module.exports = {
    login,
    create,
    signUp,
    getCurrentUserInfo,
    updateCurrentUserInfo,
    getInfoById,
    updateInfoById,
    deleteInfoById,
    getList,
}