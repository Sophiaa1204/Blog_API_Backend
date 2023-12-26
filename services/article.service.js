const query = require('../utils/db')
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')
const { getPaginationValues } = require('../utils/query')
const userService = require('./user.service')
const categoryService = require('./category.service')
const http = require("http");

const create = async({ title, thumbnailUrl, content, userId, categoryId, isPulish }) => {
    const insertDateTime = new Date()
    const [row] = await query(
        `INSERT INTO article (title, thumbnail_url, content, user_id, category_id, is_publish, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)`,
        [title, thumbnailUrl, content, userId, categoryId, insertDateTime, insertDateTime],
    )
    return getInfoById(row.insertId)
}

const getInfoById = async(id) => {
    const [rows] = await query(
        `SELECT a.id,
        title,
        thumbnail_url as thumbnailUrl,
        content,
        user_id as userId,
        u.email as userEmail,
        u.avatar_url as userAvatarUrl,
        category_id as categoryId,
        c.name as categoryName,
        c.sort as categorySort,
        is_publish as isPublish,
        a.created_at as createdAt,
        a.updated_at as updatedAt
        FROM article a
        LEFT JOIN user u ON a.user_id = u.id
        LEFT JOIN category c on a.category_id = c.id
        WHERE a.id = ? AND a.deleted_at IS NULL LIMIT 1;`,
        [id]
    )
    return rows.length ? rows[0] : null
}

const updateById = async(id, data) => {
    const info = await getInfoById(id)
    if (!info) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Article not found')
    const updateDateTime = new Date()
    const { title, thumbnailUrl, content, userId, categoryId, isPublish } = { ...info, ...data }
    if (!await userService.getInfoById(userId)) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User not found')
    if (!await categoryService.getInfoById(categoryId)) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Category not found')
    await query(`UPDATE article SET title=?, thumbnail_url=?, content=?, user_id=?, is_publish=?, updated_at=? WHERE article.id = ? `,
        [title, thumbnailUrl, content, userId, categoryId, isPublish, updateDateTime, id])
    return getInfoById(id)
}

const deleteById = async(id) => {
    const info = await getInfoById(id)
    if (!info) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Article not found')
    const deleteDateTime = new Date()
    await query(`UPDATE article SET deleted_at=? WHERE article.id=?`, [deleteDateTime,id])
    return true
}

const getList = async({ pageNum = 1, pageSize = 10 }) => {
    const [totalRow] = await query('SELECT count(*) as total FROM article WHERE deleted_at is NULL;')
    const [rows] = await query(
        `SELECT a.id,
                title,
                thumbnail_url as thumbnailUrl,
                content,
                user_id as userId,
                u.email as userEmail,
                u.avatar_url as userAvatarUrl,
                category_id as categoryId,
                c.name as categoryName,
                c.sort as categorySort,
                is_publish as isPublish,
                a.created_at as createdAt,
                a.updated_at as updateAt
             FROM article a
             LEFT JOIN user u ON a.user_id = u.id
             LEFT JOIN category c ON a.category_id = c.id
             WHERE a.deleted_at IS NULL
             LIMIT ?,?;
    `, getPaginationValues(pageNum, pageSize))
    return {
        rows,
        total: totalRow[0].total,
        pageNum,
        pageSize
    }
}

module.exports = {
    create,
    updateById,
    deleteById,
    getList,
    getInfoById
}