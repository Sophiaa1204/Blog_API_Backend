const query = require('../utils/db')
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')
const { getPaginationValues } = require('../utils/query')
const userService = require('./user.service')
const articleService = require('./article.service')

const create = async({ userId, articleId, content, commentId = null }) => {
    const insertDateTime = new Date()
    const [row] = await query(
        'INSERT INTO comment (content, user_id, article_id, comment_id, created_at, updated_at) VALUES (?,?,?,?,?,?)',
        [content, userId, articleId, commentId, insertDateTime, insertDateTime],
    )
    return getInfoById(row.insertId)
}

const getInfoById = async(id) => {
    const [rows] = await query(
        `SELECT c.id, 
             c.content as content,
             c.user_id as userId
             u.email as userEmail,
             u.avatar_url as userAvatarUrl,
             a.title as articleTitle,
             a.content as articleContent,
             a.thumbnail_url as articleThumbnailUrl,
             c.comment_id as parentId,
             ca.id as categoryId,
             ca.name as categoryName,
             c.article_id as articleId,
             c.created_at as createdAt,
             c.updated_at as updatedAt, 
             FROM comment c
             LEFT JOIN user u ON c.user_id = u.id
             LEFT JOIN article a ON c.article_id = a.id
             LEFT JOIN category ca ON a.category_id = ca.id
             WHERE
             c.id = ? AND c.deleted_at IS NULL
             LIMIT 1`, [id]
    )
    return rows.length ? rows[0] : null
}

const updateById = async(id, data) => {
    const info = await getInfoById(id)
    if (!info) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Comment not found')
    const updateDateTime = new Date()
    const { userId, articleId, commentId=null, content } = {...info,...data}
    if (!await userService.getInfoById(userId)) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User not found')
    if (!await articleService.getInfoById(articleId)) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Article not found')
    await query(`UPDATE comment l SET content=?, user_id = ?, article_id = ?, updated_at = ? WHERE l.id=? `, [
        content,
        userId,
        articleId,
        updateDateTime,
        id,
    ])
    return getInfoById(id)
}

const deleteById = async(id) => {
    const info = getInfoById(id)
    if (!info) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Comment not found')
    const deleteDateTime = new Date()
    await query('UPDATE comment l SET deleted_at=? WHERE l.id=?', [deleteDateTime, id])
    return true
}

const getList = async( { pageNum=1, pageSize = 10 }) => {
    const [totalRow] = await query(`SELECT count(*) as total FROM comment WHERE deleted_at IS NULL;`)
    const [rows] = await query(`SELECT c.id,
                       c.content as content,
                       c.user_id as userId,
                       u.email as userEmail,
                       u.avatar_url as userAvatarUrl,
                       a.title as articleTitle,
                       a.content as articleContent,
                       a.thumbnail_url as articleThumbnailUrl,
                       c.comment_id as parentId,
                       ca.id as categoryId,
                       ca.name as categoryName,
                       c.article_id as articleId,
                       c.created_at as createdAt,
                       c.updated_at as updatedAt,
                       FROM comment c
                       LEFT JOIN user u on c.user_id = u.id
                       LEFT JOIN article a on c.article_id = a.id
                       LEFT JOIN category ca on a.category_id = ca.id
                       WHERE
                       c.deleted_at IS NULL
                       LIMIT ?,?
                       `, getPaginationValues(pageNum, pageSize))
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
    getInfoById
}