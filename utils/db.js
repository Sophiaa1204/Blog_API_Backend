const mysql = require('mysql2/promise')

const connect = () => mysql.createConnection(require('../config/config').db)
// db queries may take some time, so we use async method here
module.exports = async(sql, values) => {
    const db = await connect()
    return db.query(sql, values)
}