const query = require('../utils/db')
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')
const { getPaginationValues } = require('../utils/query')
const userService = require('./user.service')
const articleService = require('./article.service')

const create = async({ userId, articleId }) => {
    const insertDateTime = new Date()
    const [row] = await query(
        `INSERT INTO \`like\` (user_id, article_id, created_at, updated_at) VALUES (?,?,?,?)`,
        [
            userId,
            articleId,
            insertDateTime,
            insertDateTime,
        ],
    )
    return getInfoById(row.insertId)
}

const getInfoById = async(id) => {
    const [rows] = await query(
        `SELECT l.id,
        l.user_id as userId,
        u.email as userEmail,
        u.avatar_url as userAvatarUrl,
        a.title as articleTitle,
        a.content as articleContent,
        c.id as categoryId,
        c.name as categoryName,
        l.article_id as articleId,
        l.created_at as createdAt,
        l.updated_at as updatedAt,
        FROM \`like\` l
        LEFT JOIN user u on l.user_id = u.id
        LEFT JOIN article a on l.article_id = a.id
        LEFT JOI category c on a.category_id = c.id
        WHERE l.id=?
        AND l.deleted_at IS NULL
        LIMIT 1;`,
        [id],
    )
    return rows.length ? rows[0] : null
}

const updateById = async(id, data) => {
    const info = await getInfoById(id)
    if (!info) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Article not found')
    const updateDateTime = new Date()
    const { userId, articleId } = { ...info, ...data }
    if (!await userService.getInfoById(userId)) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User not found')
    if (!await articleService.getInfoById(articleId)) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Article not found')
    await query(`UPDATE \`like\` l SET user_id=?, article_id=?, updated_at=? WHEREl.id=?`, [
        userId,
        articleId,
        updateDateTime,
        id,
    ])
    return getInfoById(id)
}

const deleteById = async(id) => {
    const info = await getInfoById(id)
    if (!info) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Like not found')
    const deleteDateTime = new Date()
    await query(`UPDATE \`like\` l SET deleted_at=? WHERE l.id=?`, [deleteDateTime,id])
    return true
}

const getList = async({ pageNum = 1, pageSize = 10 }) => {
    const [totalRow] = await query(`SELECT count(*) as total FROM \`like\` WHERE deleted_at IS NULL`)
    const [rows] = await query(`SELECT l.id,
                            l.user_id as userId,
                            u.email as userEmail,
                            u.avatar_url as userAvatarUrl,
                            a.title as articleTitle,
                            a.content as articleContent,
                            a.thumbnail_url as articleThumbnailUrl,
                            c.id as categoryId,
                            c.name as categoryName,
                            l.article_id as articleId,
                            l.created_at as createdAt,
                            l.updated_at as updatedAt
                            FROM \`like\` l 
                            LEFT JOIN user u on l.user_id = u.id
                            LEFT JOIN article a on l.article_id = a.id
                            LEFT JOIN category c on a.category_id = c.id
                            WHERE
                            l.deleted_at IS NULL
                            LIMIT ?,?;`, getPaginationValues(pageNum, pageSize))
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
    getInfoById,
}