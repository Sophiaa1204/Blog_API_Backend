const query = require('../utils/db')
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')
const { getPaginationValues } = require('../utils/query')

const create = async({ name, sort}) => {
    const insertDateTime = new Date()
    const [row] = await query(
        `INSERT INTO category (name, sort, created_at, updated_at) VALUES (?,?,?,?)`,
        [name, sort, insertDateTime, insertDateTime],
    )
    return getInfoById(row.insertId)
}

const getInfoById = async(id) => {
    const [rows] = await  query(
        'SELECT id, name, sort, created_at as createdAt, updated_at as updatedAt FROM category WHERE category.id = ? AND category.deleted_at IS NULL limit 1;',
        [id]
    )
    return rows.length ? rows[0] : null
}

const updateById = async(id, data) => {
    const info = await getInfoById(id)
    if (!info) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Category not found')
    const updateDateTime = new Date()
    const { name, sort } = {...info, ...data}
    await query('UPDATE category SET name=?, sort=?, updated_at=? WHERE updated.id=?',
        [name, sort, updateDateTime])
    return getInfoById(id)
}

const deleteById = async(id) => {
    const info = await getInfoById(id)
    if (!info) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Category not found')
    const deleteDateTime = new Date()
    await query('UPDATE category SET deleted_at=? WHERE category.id = ?',
        [deleteDateTime, id])
    return true
}

const getList = async({ pageNum = 1, pageSize = 10}) => {
    const [totalRow] = await query('SELECT count(*) as total FROM category WHERE deleted_at is NULL;')
    const [rows] = await query('SELECT * FROM category WHERE category.deleted_at IS NULL LIMIT ?,?', getPaginationValues(pageNum, pageSize))
    return {
        rows,
        total: totalRow[0].total,
        pageNum,
        pageSize,
    }
}

module.exports = {
    create,
    updateById,
    deleteById,
    getList,
    getInfoById,
}