const {dbInstance} = require('../../config/database')
const tableName = 'tokens'

function getCurrentTime() {
    const currentDate = new Date();
    return new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000).toISOString();
}

exports.saveToken = async (userId, token) => {
    const currentDate = getCurrentTime()
    const db = await dbInstance;
    const rs = await db.request().query(`INSERT INTO ${tableName} (user_id, token, created_at) VALUES (${userId}, '${token}', '${currentDate}')`);
    return rs.rowsAffected
}

exports.updateToken = async (userId, newToken) => {
    const currentDate = getCurrentTime()
    const db = await dbInstance;
    const rs = await db.request().query(`UPDATE ${tableName} SET token = '${newToken}', created_at='${currentDate}' WHERE user_id = ${userId}`);
    return rs.rowsAffected
}

exports.findTokenByUserId = async (userId) => {
    const db = await dbInstance;
    const rs = await db.request().query(`SELECT * FROM ${tableName} WHERE user_id = ${userId}`);
    return rs.recordset
}