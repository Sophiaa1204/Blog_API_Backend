const query = require('../utils/db')
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')
const { getPaginationValues } = require('../utils/query')

const isEmailTaken = async(email) => {
    const [rows] = await query(
        `SELECT u.email from user u WHERE u.email = ? AND u.deleted_at IS NULL`, [email])
    return !!rows.length
}

const getInfoByEmail = async(email) => {
    const [rows] = await query(
        `SELECT u.email from user u WHERE u.email = ? AND u.deleted_at IS NULL`, [email])
    return rows[0]
}

const create = async({ email, password, gender, avatarUrl, description }) => {
    const insertDateTime = new Date()
    if (await isEmailTaken(email)) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Email was taken')
    }
    const [row] = await query(
        `INSERT INTO user (email, password, gender, avatar_url, description, created_at, updated_at) VALUES (?,?,?,?,?,?,?)`,
        [email,
        password,
        gender,
        avatarUrl,
        description,
        insertDateTime,
        insertDateTime]
    )
    return getInfoById(row.insertId)
}

const getInfoById = async(id) => {
    const [rows] = await query(
        `SELECT id, email, password, gender, avatar_url as as avatarUrl, description, created_at as createdAt, updated_at as updatedAt FROM user WHERE user.id = ? AND user.deleted_at IS NULL limit 1`,
        [id],
    )
    return rows.length ? rows[0] : null
}

const updateById = async(id, data) => {
    const info = await getInfoById(id)
    if(!info) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User not found')
    const updateDateTime = new Date()
    const { email, password, gender, avatarUrl, description } = { ...info,...data }
    await query(`UPDATE user SET email=?, password=?, gender=?, avatar_url=?, description=?, updated_at=? WHERE user.id=?`,
        [email, password, gender, avatarUrl, description, updateDateTime, id])
    return getInfoById(id)
}

const deleteById = async(id) => {
    const info = await getInfoById(id)
    if (!info) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,'User not found')
    const deleteDateTime = new Date()
    await query(`UPDATE use SET deleted_at = ? WHERE user.id = ?`, [deleteDateTime, id])
    return true
}

const getList = async({ pageNum = 1, pageSize = 10 }) => {
    const [totalRow] = await query(`SELECT count(*) as total FROM user WHERE deleted_at is NULL`)
    const [rows] = await query(`SELECT * FROM user WHERE user.deleted_at IS NULL LIMIT ?,?`, getPaginationValues((pageNum,pageSize)))
    return {
        rows,
        total:totalRow[0].total,
        pageNum,
        pageSize,
    }
}

module.exports = {
    isEmailTaken,
    create,
    updateById,
    deleteById,
    getList,
    getInfoById,
    getInfoByEmail,
}